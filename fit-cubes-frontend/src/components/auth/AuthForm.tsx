import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { AuthInput } from './AuthInput';
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
    mode,
    isLogin,
    name,
    email,
    password,
    staySignedIn,
    agreeTerms,
    isLoading,
    fieldErrors,
    generalError,
    isForgotPasswordOpen,
    handleModeToggle,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    handleNameBlur,
    handleToggleStaySignedIn,
    handleToggleAgreeTerms,
    handleOpenForgotPassword,
    handleCloseForgotPassword,
    handleSubmit,
    handleSocialAuth,
  } = useAuthForm({ initialMode, onSuccess });

  return (
    <motion.div
      layout
      variants={authContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col"
    >
      <motion.h2
        key={mode}
        layout
        variants={authItemVariants}
        className="text-[22px] md:text-[26px] leading-[1.2] font-semibold font-serif tracking-tight text-[#F5F6FA] mb-4 md:mb-10 lg:mb-6 text-left"
      >
        {isLogin ? 'Log in' : 'Sign up'}
      </motion.h2>

      {/* General Server Error Banner (Only for network/server errors) */}
      {generalError && (
        <motion.div
          layout
          variants={authItemVariants}
          className="mb-4 px-3.5 py-2.5 rounded-[5px] bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium"
        >
          {generalError}
        </motion.div>
      )}

      {/* Main Input Form */}
      <motion.form
        layout
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.div
              layout
              key="name-field"
              initial={{ opacity: 0, height: 0, marginBottom: -12 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: -12 }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.35, ease: AUTH_CUBIC_BEZIER },
                marginBottom: { duration: 0.35, ease: AUTH_CUBIC_BEZIER },
                layout: authLayoutTransition,
              }}
              className="overflow-hidden"
            >
              <AuthInput
                type="text"
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                placeholder="Full Name"
                autoComplete="name"
                label="Full Name"
                error={fieldErrors.name}
                hasError={Boolean(fieldErrors.name)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          key="email-wrapper"
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
        >
          <AuthInput
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

        <motion.div
          layout
          key="password-wrapper"
          variants={authItemVariants}
          transition={{ layout: authLayoutTransition }}
        >
          <AuthInput
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
                    ? 'bg-[#F59F0A] border-[#F59F0A] text-white'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                {staySignedIn && <Check className="w-3 h-3 stroke-[3]" />}
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
                  className="text-[#F59F0A] hover:underline transition-all cursor-pointer select-none text-xs"
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
                        ? 'bg-[#F59F0A] border-[#F59F0A] text-white'
                        : fieldErrors.terms
                        ? 'border-red-500/80 bg-red-500/10 shadow-[0_0_6px_rgba(239,68,68,0.2)]'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="leading-snug text-white/70">
                    By signing up you are giving the thumbs up to our{' '}
                    <a href="#terms" className="text-[#F59F0A] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-[#F59F0A] hover:underline">
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
            className="mt-2 w-full"
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
        className="mt-2 text-center text-xs sm:text-sm text-white/80"
      >
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeToggle('signup')}
              className="ml-2 text-[#F59F0A] hover:underline font-medium cursor-pointer"
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
              className="text-[#F59F0A] hover:underline font-medium cursor-pointer"
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
        className="flex items-center gap-3 mt-3 mb-4 sm:mt-5 sm:mb-11"
      >
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[#F5F6FA] text-[16px] font-medium leading-none -translate-y-[1.5px] select-none">
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
