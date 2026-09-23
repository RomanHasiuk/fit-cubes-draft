import { useState, type ChangeEvent, type FormEvent } from 'react';
import { authService, type SocialProvider } from '@/services/authService';
import { useStore } from '@/store/useStore';

export type AuthMode = 'login' | 'signup';

export interface FieldErrors {
  email?: string;
  password?: string;
  repeatedPassword?: string;
  terms?: string;
}

interface UseAuthFormOptions {
  initialMode?: AuthMode;
  onSuccess: (isLogin?: boolean) => void;
}

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;
const EMAIL_LATIN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function useAuthForm({ initialMode = 'login', onSuccess }: UseAuthFormOptions) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const isLogin = mode === 'login';

  const handleModeToggle = (newMode: AuthMode) => {
    setFieldErrors({});
    setGeneralError(null);
    setMode(newMode);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (fieldErrors.repeatedPassword && repeatedPassword && e.target.value === repeatedPassword) {
      setFieldErrors((prev) => ({ ...prev, repeatedPassword: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleRepeatedPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatedPassword(e.target.value);
    if (fieldErrors.repeatedPassword) {
      setFieldErrors((prev) => ({ ...prev, repeatedPassword: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleEmailBlur = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (CYRILLIC_REGEX.test(trimmed)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: 'Email must contain only Latin characters (a-z)',
      }));
    } else if (!EMAIL_LATIN_REGEX.test(trimmed)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address (e.g. name@domain.com)',
      }));
    }
  };

  const handlePasswordBlur = () => {
    if (!password) return;
    if (CYRILLIC_REGEX.test(password)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'Password must contain only Latin characters (a-z)',
      }));
    } else if (password.length < 8) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters long',
      }));
    } else if (!isLogin && !/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'Password must contain at least one letter and one number',
      }));
    }
  };

  const handleRepeatedPasswordBlur = () => {
    if (isLogin) return;
    if (!repeatedPassword) return;

    if (CYRILLIC_REGEX.test(repeatedPassword)) {
      setFieldErrors((prev) => ({
        ...prev,
        repeatedPassword: 'Password must contain only Latin characters (a-z)',
      }));
    } else if (repeatedPassword !== password) {
      setFieldErrors((prev) => ({
        ...prev,
        repeatedPassword: 'Passwords do not match',
      }));
    }
  };

  const handleToggleStaySignedIn = () => {
    setStaySignedIn((prev) => !prev);
  };

  const handleToggleAgreeTerms = () => {
    setAgreeTerms((prev) => {
      const next = !prev;
      if (next && fieldErrors.terms) {
        setFieldErrors((curr) => ({ ...curr, terms: undefined }));
      }
      return next;
    });
  };

  const handleOpenForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Please enter your email address';
    } else if (CYRILLIC_REGEX.test(trimmedEmail)) {
      errors.email = 'Email must contain only Latin characters (a-z)';
    } else if (!EMAIL_LATIN_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    if (!password) {
      errors.password = 'Please enter your password';
    } else if (CYRILLIC_REGEX.test(password)) {
      errors.password = 'Password must contain only Latin characters (a-z)';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!isLogin && !/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain at least one letter and one number';
    }

    if (!isLogin) {
      if (!repeatedPassword) {
        errors.repeatedPassword = 'Please confirm your password';
      } else if (repeatedPassword !== password) {
        errors.repeatedPassword = 'Passwords do not match';
      }

      if (!agreeTerms) {
        errors.terms = 'You must agree to the Terms of Service & Privacy Policy';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await authService.login({
          email: trimmedEmail,
          password,
        });
        if (res.ok) {
          if (res.data?.user?.name) {
            useStore.getState().updateProfile({ name: res.data.user.name });
          }
          onSuccess(true);
        } else {
          setGeneralError(res.error || 'Invalid email or password');
        }
      } else {
        const res = await authService.register({
          email: trimmedEmail,
          password,
          repeatedPassword,
        });
        if (res.ok) {
          if (res.data?.user?.name) {
            useStore.getState().updateProfile({ name: res.data.user.name });
          }
          onSuccess(false);
        } else {
          setGeneralError(res.error || 'Registration failed. Please try again.');
        }
      }
    } catch {
      // Prototype offline fallback
      onSuccess(isLogin);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: SocialProvider) => {
    setIsLoading(true);
    // Stage 2 OAuth2 integration:
    authService.initiateSocialAuth(provider);

    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 600);
  };

  return {
    mode,
    isLogin,
    email,
    password,
    repeatedPassword,
    staySignedIn,
    agreeTerms,
    isLoading,
    fieldErrors,
    generalError,
    isForgotPasswordOpen,
    handleModeToggle,
    handleEmailChange,
    handlePasswordChange,
    handleRepeatedPasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    handleRepeatedPasswordBlur,
    handleToggleStaySignedIn,
    handleToggleAgreeTerms,
    handleOpenForgotPassword,
    handleCloseForgotPassword,
    handleSubmit,
    handleSocialAuth,
  };
}
