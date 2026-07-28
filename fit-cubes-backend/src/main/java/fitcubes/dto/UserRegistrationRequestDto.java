package fitcubes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record UserRegistrationRequestDto(
        @Email
        @NotBlank(message = "Email cannot be null")
        String email,

        @NotBlank
        String password,

        @NotBlank
        String repeatedPassword,

        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        @Min(value = 1, message = "Age must be greater than 0")
        int age
) {
}
