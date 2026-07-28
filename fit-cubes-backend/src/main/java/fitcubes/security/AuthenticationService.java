package fitcubes.security;

import fitcubes.dto.UserDto;
import fitcubes.dto.UserLoginRequestDto;
import fitcubes.dto.UserLoginResponseDto;
import fitcubes.dto.UserRegistrationRequestDto;
import fitcubes.exception.RegistrationException;
import fitcubes.mapper.UserMapper;
import fitcubes.model.Role;
import fitcubes.model.RoleName;
import fitcubes.model.User;
import fitcubes.repository.RoleRepository;
import fitcubes.repository.UserRepository;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;

    public UserLoginResponseDto login(UserLoginRequestDto requestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDto.email(), requestDto.password()));

        String token = jwtUtil.generateToken(authentication.getName());
        return new UserLoginResponseDto(token);
    }

    public UserDto register(UserRegistrationRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new RegistrationException("Email: " + requestDto.email() + " is already in use!");
        }

        User user = userMapper.toEntity(requestDto);

        Role userRole = roleRepository.findByName(RoleName.USER).orElseThrow(
                () -> new RegistrationException("Role: " + RoleName.USER + " not found"));
        user.setRoles(Set.of(userRole));
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            long remainingTimeMs = jwtUtil.getRemainingExpirationTime(token);
            tokenBlacklistService.blacklistToken(token, remainingTimeMs);
        }
    }
}
