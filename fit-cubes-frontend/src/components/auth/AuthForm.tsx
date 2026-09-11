import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SocialAuthButtons } from './SocialAuthButtons';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Button } from '@/components/ui/button';
import { useAuthForm, type AuthMode } from './useAuthForm';
import {
  authContainerVariants,
  authItemVariants,
  authLayoutTransition,
  AUTH_CUBIC_BEZIER,
} from './authAnimations';

export type { AuthMode };

interface AuthFormProps {
  initialMode?: AuthMode;
  onSuccess: () => void;
}

export function AuthForm({
  initialMode = 'login',
  onSuccess,
}: AuthFormProps) {
  const {
    isLogin,
    email,
    password,
    repeatedPassword,
    staySignedIn,
    agreeTerms,
    isLoading,
    generalError,
    fieldErrors,
    isForgotPasswordOpen,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleRepeatedPasswordChange,
    handleRepeatedPasswordBlur,
    handleToggleStaySignedIn,
    handleToggleAgreeTerms,
    handleModeToggle,
    handleOpenForgotPassword,
    handleCloseForgotPassword,
    handleSocialAuth,
    handleSubmit,
  } = useAuthForm({ initialMode, onSuccess });

  return (
    <motion.div
      variants={authContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col justify-center h-full select-none"
    >
      {/* Dynamic Animated Header */}
      <motion.div
        layout
        variants={authItemVariants}
        transition={{ layout: authLayoutTransition }}
        className="text-center mb-4 sm:mb-6 md:mb-6"
      >
        <h2 className="heading-h2 font-normal">
          {isLogin ? 'Log in' : 'Sign up'}
        </h2>
      </motion.div>

      {/* Global Form Level Error Banner */}
      {generalError && (
        <motion.div
          layout
          variants={authItemVariants}
          className="mb-4 px-3.5 py-2.5 rounded-[5px] bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium"
        >
          {generalError}
        </motion.div>
      )}

      {/* Main Input Form: 1. Email, 2. Password, 3. Confirm Password (animated) */}
      <motion.form
        layout
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        {/* 1. Email Input (Always 1st) */}
        <motion.div
          layout
          key="email-wrapper"
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
        >
          <Input
            key="email-field"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="example@fitcubes.uk"
            autoComplete="email"
            label="Email"
            error={fieldErrors.email}
            hasError={Boolean(fieldErrors.email || generalError)}
          />
        </motion.div>

        {/* 2. Password Input (Always 2nd) */}
        <motion.div
          layout
          key="password-wrapper"
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
        >
          <Input
            key="password-field"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="Password"
            label="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            error={fieldErrors.password}
            hasError={Boolean(fieldErrors.password || generalError)}
          />
        </motion.div>

        {/* 3. Confirm Password Input (Only for Sign Up, placed right below Password) */}
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.div
              layout
              key="repeated-password-field"
              initial={{ opacity: 0, height: 0, overflow: 'hidden', marginBottom: -12 }}
              animate={{
                opacity: 1,
                height: 'auto',
                marginBottom: 0,
                transitionEnd: { overflow: 'visible' }
              }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden', marginBottom: -12 }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.35, ease: AUTH_CUBIC_BEZIER },
                marginBottom: { duration: 0.35, ease: AUTH_CUBIC_BEZIER },
                layout: authLayoutTransition,
              }}
            >
              <Input
                type="password"
                value={repeatedPassword}
                onChange={handleRepeatedPasswordChange}
                onBlur={handleRepeatedPasswordBlur}
                placeholder="Confirm Password"
                autoComplete="new-password"
                label="Confirm Password"
                error={fieldErrors.repeatedPassword}
                hasError={Boolean(fieldErrors.repeatedPassword)}
              />
            </motion.div>
          )}
        </AnimatePresence>


        {/* Checkbox Options with Atomic Morphing */}
        <motion.div
          layout
          key="checkbox-wrapper"
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
          className="flex flex-col gap-2.5 text-xs text-white/80 pt-1"
        >
          {/* Row 1: Permanent Stay Signed In + Dynamic Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={handleToggleStaySignedIn}
                className="sr-only"
              />
              <div
                className={`w-[18px] h-[18px] rounded-[4px] border transition-colors flex items-center justify-center ${
                  staySignedIn
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                {staySignedIn && <Check className="w-4 h-4 stroke-[3] text-white" />}
              </div>
              <span>Stay signed in</span>
            </label>

            <AnimatePresence>
              {isLogin && (
                <motion.button
                  key="forgot-password-btn"
                  type="button"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleOpenForgotPassword}
                  className="text-link hover:underline transition-all cursor-pointer select-none text-xs"
                >
                  Forgot password?
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Row 2: Dynamic Smooth Expansion for Terms & Privacy */}
          <AnimatePresence initial={false}>
            {!isLogin && (
              <motion.div
                layout
                key="terms-checkbox"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.35, ease: AUTH_CUBIC_BEZIER },
                  layout: authLayoutTransition,
                }}
                className="overflow-hidden flex flex-col gap-1.5 pt-0.5"
              >
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={handleToggleAgreeTerms}
                    className="sr-only"
                  />
                  <div
                    className={`w-[18px] h-[18px] rounded-[4px] border shrink-0 mt-0.5 transition-colors flex items-center justify-center ${
                      agreeTerms
                        ? 'bg-primary border-primary text-primary-foreground'
                        : fieldErrors.terms
                        ? 'border-red-500/80 bg-red-500/10 shadow-[0_0_6px_rgba(239,68,68,0.2)]'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {agreeTerms && <Check className="w-4 h-4 stroke-[3] text-white" />}
                  </div>
                  <span className="leading-snug text-white/70">
                    By signing up you are giving the thumbs up to our{' '}
                    <a href="#terms" className="text-link hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-link hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                {fieldErrors.terms && (
                  <p className="text-xs text-red-400 font-medium pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span>{fieldErrors.terms}</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Primary Submit Button with UI Kit States & Unified Design System */}
        <motion.div
          layout
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
        >
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin pointer-events-none" />
                <span>Please wait...</span>
              </>
            ) : isLogin ? (
              'Log in'
            ) : (
              'Create account'
            )}
          </Button>
        </motion.div>
      </motion.form>

      {/* Mode Switcher */}
      <motion.div
        layout
        variants={authItemVariants}
        transition={{ layout: authLayoutTransition }}
        className="mt-2 text-center text-xs/[1.35] text-white/80"
      >
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeToggle('signup')}
              className="ml-2 text-link hover:underline font-medium cursor-pointer"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeToggle('login')}
              className="text-link hover:underline font-medium cursor-pointer"
            >
              Log in
            </button>
          </p>
        )}
      </motion.div>

      {/* Separator */}
      <motion.div
        layout
        variants={authItemVariants}
        transition={{ layout: authLayoutTransition }}
        className="flex items-center gap-3 my-3 sm:mt-5 sm:mb-11"
      >
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-foreground text-[16px] font-medium leading-none -translate-y-[1.5px] select-none">
          or
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      {/* Social Authorization Buttons (Each button cascades individually) */}
      <SocialAuthButtons
        onSocialAuth={handleSocialAuth}
        isLoading={isLoading}
        itemVariants={authItemVariants}
      />

      {/* Custom Forgot Password Modal (Supports Light & Dark Theme) */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        initialEmail={email}
        onClose={handleCloseForgotPassword}
      />
    </motion.div>
  );
}
