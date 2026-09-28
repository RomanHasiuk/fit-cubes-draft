import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useModalOpen } from '@/hooks/useModalOpen';
import { Button } from '@/components/ui/button';

export type LegalModalType = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  type: LegalModalType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  useModalOpen(isOpen);

  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg bg-card/95 text-foreground border border-border rounded-[5px] p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {isTerms ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-foreground">
                    {isTerms ? 'Terms of Service' : 'Privacy Policy'}
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground">
                    FitCubes • Draft v1.0
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 py-4 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
              <div className="p-3.5 rounded-[5px] bg-secondary/80 border border-border/50 text-foreground/90 space-y-1">
                <div className="flex items-center gap-2 font-medium text-amber-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Preview Notice</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isTerms
                    ? 'The official Terms of Service are currently being finalized for the commercial release of FitCubes. Below is an overview of the core principles of using our service.'
                    : 'The official GDPR-compliant Privacy Policy is being prepared for the commercial release of FitCubes. Below is an overview of how we safeguard your personal data.'}
                </p>
              </div>

              {isTerms ? (
                <>
                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      1. Informational & Educational Tool
                    </h4>
                    <p>
                      FitCubes is a calorie and macronutrient calculation tool designed to assist with personal fitness goals. Calculations (TDEE, BMI, macro ratios) are based on standard clinical formulas and do not constitute professional medical advice or personalized dietary prescriptions.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      2. User Responsibility
                    </h4>
                    <p>
                      You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted through your account. Please consult a licensed healthcare provider before making radical changes to your nutrition or exercise regimen.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      3. Service Availability
                    </h4>
                    <p>
                      While we aim for maximum uptime and reliable data persistence, FitCubes is provided on an &quot;as is&quot; basis during beta testing and development stages.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      1. Data Privacy & Zero Resale
                    </h4>
                    <p>
                      We never sell, rent, or monetize your personal information, biometric parameters (weight, height, age), or nutritional logs to third-party advertisers or data brokers.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      2. Storage & Security
                    </h4>
                    <p>
                      All authentication tokens are transmitted over encrypted TLS/SSL connections and verified with signed JWT tokens. Your daily logs are stored securely and associated solely with your user identifier.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      3. Account Deletion & GDPR Rights
                    </h4>
                    <p>
                      You hold the full right to delete your profile and purge all historical meal and activity logs at any time via the profile settings screen.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end shrink-0">
              <Button
                type="button"
                onClick={onClose}
                className="px-5 h-9 text-xs sm:text-sm font-semibold rounded-[5px] cursor-pointer"
              >
                Understood
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
