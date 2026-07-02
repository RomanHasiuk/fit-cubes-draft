import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Target, Flame, TrendingDown, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { calculateBMR, calculateTDEE, generateMacroTargets, adjustMacrosForProtein, type DietType, type WeightGoal } from '@/utils/calculations';
import InfoTooltip from '@/components/InfoTooltip';
import { MetricInput } from '@/components/profile/MetricInput';
import { OptionSelector } from '@/components/profile/OptionSelector';
import { ProteinIndicator } from '@/components/profile/ProteinIndicator';

interface OnboardingProps {
  onComplete: () => void;
}

const LIMITS = {
  age: { min: 16, max: 120 },
  weight: { min: 30, max: 300 },
  height: { min: 100, max: 250 },
  name: { min: 2, max: 50 }
};

const STEPS = ['welcome', 'basics', 'targets', 'ready'] as const;

export default function Onboarding({ onComplete }: OnboardingProps) {
  const profile = useStore((state) => state.profile);
  const updateProfile = useStore((state) => state.updateProfile);
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<WeightGoal>('maintain');
  const [diet, setDiet] = useState<DietType>('balanced');
  const [error, setError] = useState<string | null>(null);
  const currentStep = STEPS[step];

  const handleNext = () => {
    // Validation
    if (currentStep === 'basics') {
      const trimmedName = profile.name.trim();

      if (!trimmedName) {
        setError("Please enter your name");
        return;
      }

      // check name length
      if(trimmedName.length < LIMITS.name.min || trimmedName.length > LIMITS.name.max){
        setError(`Name must be between ${LIMITS.name.min} and ${LIMITS.name.max} characters long`);
        return;
      }

      // check on spacebar start and end
      if(profile.name !== profile.name.trim()){
        setError("Name cannot start or end with a space");
        return;
      }

      // check name allows numbers, but MUST contain at least one letter
      const allowedCharsRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-']+$/;
      const hasLetterRegex = /[a-zA-Zа-яА-ЯіїєґІЇЄҐąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
      
      if (!allowedCharsRegex.test(trimmedName)) {
        setError("Name can only contain letters, numbers, spaces, hyphens, and apostrophes");
        return;
      }
      if (!hasLetterRegex.test(trimmedName)) {
        setError("Name must contain at least one letter");
        return;
      }

      // Metrics Validation
      // Check age
      if (profile.age < LIMITS.age.min || profile.age > LIMITS.age.max) {
        setError(`Age must be between ${LIMITS.age.min} and ${LIMITS.age.max}`);
        return;
      }

      // Check weight
      if (profile.weightKg < LIMITS.weight.min || profile.weightKg > LIMITS.weight.max) {
        setError(`Weight must be between ${LIMITS.weight.min} kg and ${LIMITS.weight.max} kg`);
        return;
      }

      // Check height
      if (profile.heightCm < LIMITS.height.min || profile.heightCm > LIMITS.height.max) {
        setError(`Height must be between ${LIMITS.height.min} cm and ${LIMITS.height.max} cm`);
        return;
      }
    }

    if (currentStep === 'targets') {
      if (!profile.macroTargets?.protein || profile.macroTargets.protein <= 0) {
        setError("Protein field cannot be blank or zero");
        return;
      }
    }

    setError(null);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const bmr = calculateBMR(profile);
  const tdeeBase = calculateTDEE(profile);

  const targetCalories = Math.round(goal === 'lose' ? tdeeBase * 0.85 : goal === 'gain' ? tdeeBase * 1.15 : tdeeBase);

  // Auto-update macro targets when goal or diet changes
  useEffect(() => {
    if (currentStep === 'targets') {
      const macros = generateMacroTargets(targetCalories, diet, profile.weightKg, goal);
      updateProfile({ macroTargets: macros });
    }
  }, [targetCalories, diet, profile.weightKg, goal, currentStep, updateProfile]);

  return (
    <div className="h-screen w-full bg-background flex justify-center items-center p-0 md:p-4">
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-background rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
        <div className="flex-1 flex flex-col pt-8 pb-6 overflow-hidden">
          {/* Header with Back button and Progress dots */}
          <div className="relative flex items-center justify-center mb-6 px-6 shrink-0">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="absolute left-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-4 custom-scrollbar">
            <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <motion.div
                key="welcome"
                className="flex-1 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-3">FitCubes</h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm px-4">
                  Your personal assistant for precise weight and body composition control.
                  <br /><br />
                  <span className="text-foreground font-medium">Create custom recipes and automatically calculate macros per 100g of the cooked meal!</span>
                  <br /><br />
                  <span className="text-foreground">Fill in your data to better calculate your calorie needs to reach your goals.</span>
                </p>
                <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span>BMR Engine</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <TrendingDown className="w-5 h-5 text-primary" />
                    <span>Deficit Track</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span>Macro Log</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Basics Step */}
            {currentStep === 'basics' && (
              <motion.div
                key="basics"
                className="flex-1 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  This data is used to calculate your basal metabolic rate and daily needs.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <input
                      type="text"
                      maxLength={50}
                      minLength={2}
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <OptionSelector
                    label="Gender"
                    selectedValue={profile.gender}
                    onSelect={(val) => {
                      if (val === 'female' && profile.gender === 'male' && profile.age === 28 && profile.weightKg === 85.5 && profile.heightCm === 180) {
                        updateProfile({ gender: 'female', age: 25, weightKg: 65, heightCm: 168 });
                      } else if (val === 'male' && profile.gender === 'female' && profile.age === 25 && profile.weightKg === 65 && profile.heightCm === 168) {
                        updateProfile({ gender: 'male', age: 28, weightKg: 85.5, heightCm: 180 });
                      } else {
                        updateProfile({ gender: val });
                      }
                    }}
                    columns={2}
                    options={[
                      { id: 'male', label: 'Male', tip: 'Calculation using male formula' },
                      { id: 'female', label: 'Female', tip: 'Calculation using female formula' }
                    ]}
                  />

                  <div className="flex gap-3">
                    <MetricInput
                      label="Age"
                      value={profile.age || ''}
                      onChange={(val) => updateProfile({ age: val })}
                      tooltipTitle="Age"
                      tooltipContent="Metabolism slows down with age."
                      align="left"
                    />
                    <MetricInput
                      label="Weight (kg)"
                      value={profile.weightKg || ''}
                      onChange={(val) => updateProfile({ weightKg: val })}
                      tooltipTitle="Weight"
                      tooltipContent="More weight requires more energy."
                      step="0.1"
                      align="center"
                    />
                    <MetricInput
                      label="Height (cm)"
                      value={profile.heightCm || ''}
                      onChange={(val) => updateProfile({ heightCm: val })}
                      tooltipTitle="Height"
                      tooltipContent="Height affects metabolic rate."
                      align="right"
                    />
                  </div>

                  <div className="bg-card rounded-xl p-4 border border-border mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Activity factor</span>
                        <InfoTooltip title="Activity" content="Multiplier from 1.2 to 1.9. Greatly impacts TDEE." />
                      </div>
                      <span className="text-sm font-medium">{profile.activityFactor}</span>
                    </div>
                    <input
                      type="range"
                      min="1.2"
                      max="1.9"
                      step="0.05"
                      value={profile.activityFactor}
                      onChange={(e) =>
                        updateProfile({
                          activityFactor: parseFloat(e.target.value),
                        })
                      }
                      className="w-full mt-3 accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Sedentary</span>
                      <span>Very active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Targets Step */}
            {currentStep === 'targets' && (
              <motion.div
                key="targets"
                className="flex-1 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-1">Macro Targets</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Set your daily targets or use auto-calculation.
                </p>

                <div className="bg-primary/10 rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Target Calories</p>
                  <p className="text-3xl font-bold text-primary">{targetCalories} kcal</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-primary/20 rounded text-primary uppercase font-bold tracking-wider">
                      {goal === 'lose' ? 'Loss' : goal === 'gain' ? 'Gain' : 'Maintain'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      BMR {Math.round(bmr)} × {profile.activityFactor} {goal !== 'maintain' && (goal === 'lose' ? '- 15%' : '+ 15%')}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <OptionSelector
                    label="Goal"
                    selectedValue={goal}
                    onSelect={setGoal}
                    options={[
                      { id: 'lose', label: 'Loss', tip: 'Deficit: ~15% daily' },
                      { id: 'maintain', label: 'Maintain', tip: 'Base level: no changes' },
                      { id: 'gain', label: 'Gain', tip: 'Surplus: ~15% daily' }
                    ]}
                  />

                  <OptionSelector
                    label="Strategy"
                    selectedValue={diet}
                    onSelect={setDiet}
                    options={[
                      { id: 'balanced', label: 'Balanced', tip: 'Optimal macros' },
                      { id: 'low-carb', label: 'Low-carb', tip: 'Fewer carbs' },
                      { id: 'keto', label: 'Keto', tip: 'Max fats' }
                    ]}
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Manual protein adjustment</h3>
                    <span className="text-[10px] text-muted-foreground italic">Can be changed later</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="flex flex-col items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase mb-1.5 text-center">
                        Protein
                      </label>
                      <input
                        type="number"
                        value={profile.macroTargets.protein || ''}
                        onChange={(e) => {
                          let newProtein = parseInt(e.target.value) || 0;
                          const maxProtein = Math.round(profile.weightKg * 2.5);
                          if (newProtein > maxProtein) newProtein = maxProtein;
                          const macros = adjustMacrosForProtein(targetCalories, newProtein, diet);
                          updateProfile({ macroTargets: macros });
                        }}
                        className="w-full h-12 bg-card border border-border rounded-xl px-2 text-center text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-center font-medium">
                        ~{Math.round((profile.macroTargets.protein * 4 / targetCalories) * 100)}%
                      </p>
                    </div>

                    <div>
                      <label className="flex flex-col items-center gap-1 text-[10px] font-bold text-blue-400 uppercase mb-1.5 text-center">
                        Carbs
                      </label>
                      <input
                        type="number"
                        value={profile.macroTargets.carbs || ''}
                        readOnly
                        className="w-full h-12 bg-secondary/20 opacity-70 border border-border rounded-xl px-2 text-center text-sm font-bold outline-none cursor-not-allowed"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-center font-medium">
                        ~{Math.round((profile.macroTargets.carbs * 4 / targetCalories) * 100)}%
                      </p>
                    </div>

                    <div>
                      <label className="flex flex-col items-center gap-1 text-[10px] font-bold text-amber-400 uppercase mb-1.5 text-center">
                        Fats
                      </label>
                      <input
                        type="number"
                        value={profile.macroTargets.fats || ''}
                        readOnly
                        className="w-full h-12 bg-secondary/20 opacity-70 border border-border rounded-xl px-2 text-center text-sm font-bold outline-none cursor-not-allowed"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-center font-medium">
                        ~{Math.round((profile.macroTargets.fats * 9 / targetCalories) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                <ProteinIndicator 
                  protein={profile.macroTargets.protein} 
                  weight={profile.weightKg} 
                />
              </motion.div>
            )}

            {/* Ready Step */}
            {currentStep === 'ready' && (
              <motion.div
                key="ready"
                className="flex-1 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                  <TrendingDown className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Ready</h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Your profile is set up. Your daily calorie budget is{' '}
                  <span className="text-primary font-semibold">{targetCalories} kcal</span>.
                  Start logging food and exercises to track your body changes.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-lg font-bold">{profile.macroTargets?.protein || 0}g</p>
                    <p className="text-[10px] text-muted-foreground">Protein</p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-lg font-bold">{profile.macroTargets?.carbs || 0}g</p>
                    <p className="text-[10px] text-muted-foreground">Carbs</p>
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-lg font-bold">{profile.macroTargets?.fats || 0}g</p>
                    <p className="text-[10px] text-muted-foreground">Fats</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-destructive text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Button */}
          <div className="mt-auto pt-4 px-6 shrink-0">
            <button
              onClick={handleNext}
              className="w-full h-14 bg-primary rounded-xl text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
            >
              {step === STEPS.length - 1 ? 'Start' : 'Continue'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
