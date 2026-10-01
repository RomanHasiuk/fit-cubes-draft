import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';

interface ResetPasswordScreenProps {
  token: string;
  onSuccess: () => void;
}

export function ResetPasswordScreen({ token, onSuccess }: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (error) setError(null);
  };

  const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatedPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPassword = newPassword.trim();
    const trimmedRepeated = repeatedPassword.trim();

    if (!trimmedPassword) {
      setError('Please enter your new password.');
      return;
    }

    if (trimmedPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (trimmedPassword !== trimmedRepeated) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!token) {
      setError('Reset token is missing or invalid. Please request a new link.');
      return;
    }

    setIsLoading(true);
    try {
      // Backend expects strictly { token, newPassword } without repeatedPassword
      const res = await authService.confirmPasswordReset({
        token,
        newPassword: trimmedPassword,
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errorMsg =
          res.error ||
          (res.errors && res.errors[0]) ||
          'Failed to reset password. The link may have expired or already been used.';
        setError(errorMsg);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark relative flex min-h-[100dvh] w-full select-none flex-col items-center justify-center overflow-y-auto bg-[#08090B] p-4 text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-background to-background opacity-60" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-[440px] flex-col items-center rounded-[12px] border border-white/10 bg-[#121418]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        {/* Brand Logo */}
        <div className="mb-6 flex flex-col items-center">
          <Logo size={64} variant="static" />
          <span className="mt-2 font-serif text-[18px] font-bold tracking-wider text-primary">
            FITCUBES
          </span>
        </div>

        {!isSuccess ? (
          <div className="w-full">
            <div className="mb-6 text-center">
              <h2 className="font-serif text-[26px] font-semibold text-foreground sm:text-[28px]">
                Create New Password
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground sm:text-[14px]">
                Enter a strong password of at least 8 characters.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="password"
                label="New Password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={handleNewPasswordChange}
                autoComplete="new-password"
                disabled={isLoading}
                hasError={Boolean(error)}
                autoFocus
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Repeat your new password"
                value={repeatedPassword}
                onChange={handleRepeatedPasswordChange}
                autoComplete="new-password"
                disabled={isLoading}
                hasError={Boolean(error)}
              />

              {/* Inline Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 rounded-[5px] border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="w-full gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onSuccess}
                  disabled={isLoading}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  Return to sign in
                </button>
              </div>
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="font-serif text-[24px] font-semibold text-foreground">
              Password Reset Complete!
            </h3>

            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>

            <div className="mt-6 w-full">
              <Button
                type="button"
                variant="default"
                onClick={onSuccess}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
