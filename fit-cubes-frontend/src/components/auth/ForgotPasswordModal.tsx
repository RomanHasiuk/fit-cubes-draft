import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MailCheck, Loader2 } from 'lucide-react';
import { useModalOpen } from '@/hooks/useModalOpen';
import { AuthInput } from './AuthInput';
import { Button } from '@/components/ui/button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  initialEmail?: string;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  initialEmail = '',
  onClose,
}) => {
  useModalOpen(isOpen);

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setError(null);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen, initialEmail]);

  const CYRILLIC_REGEX = /[\u0400-\u04FF]/;
  const EMAIL_LATIN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleEmailBlur = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (CYRILLIC_REGEX.test(trimmed)) {
      setError('Email must contain only Latin characters (a-z)');
    } else if (!EMAIL_LATIN_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. name@domain.com)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address');
      return;
    }
    if (CYRILLIC_REGEX.test(trimmed)) {
      setError('Email must contain only Latin characters (a-z)');
      return;
    }
    if (!EMAIL_LATIN_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    setIsLoading(true);
    try {
      // Prototype simulate API call (Spring Boot /api/auth/forgot-password)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/20 backdrop-blur-[3px] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md bg-card/70 backdrop-blur-[3px] text-card-foreground border border-border rounded-[5px] p-6 sm:p-7 shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer select-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 pointer-events-none" />
            </button>

            {!isSuccess ? (
              <div>
                <h3 className="text-xl sm:text-2xl font-serif tracking-tight text-foreground font-semibold mb-2 text-left">
                  Reset Password
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 text-left leading-relaxed">
                  Enter the email address associated with your account and we’ll send you a link to reset your password.
                </p>

                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <AuthInput
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="example@fitcubes.uk"
                    autoComplete="email"
                    error={error || undefined}
                    hasError={Boolean(error)}
                    autoFocus
                  />

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin pointer-events-none" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-12 h-12 rounded-[5px] bg-[#F59F0A]/15 text-[#F59F0A] flex items-center justify-center mb-4">
                  <MailCheck className="w-6 h-6 stroke-[2.2] pointer-events-none" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  Check your inbox
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                  We have sent password reset instructions to{' '}
                  <span className="font-semibold text-foreground">{email}</span>.
                </p>
                <Button
                  type="button"
                  variant="default"
                  onClick={onClose}
                  className="w-full h-[44px] rounded-[5px]"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
