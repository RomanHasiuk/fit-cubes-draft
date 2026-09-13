import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectButton } from '@/components/ui/SelectButton';
import InfoTooltip from '@/components/InfoTooltip';
import { ActivitySlider } from './ActivitySlider';
import { useBasicsForm } from './useBasicsForm';
import {
  blockInvalidIntegerInput,
  blockInvalidNumberInput,
} from '@/utils/inputHandlers';

interface BasicsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function BasicsForm({ onNext, onBack }: BasicsFormProps) {
  const {
    firstName,
    lastName,
    gender,
    age,
    weight,
    height,
    activityFactor,
    fieldErrors,
    handleGenderSelect,
    handleFirstNameChange,
    handleLastNameChange,
    handleAgeChange,
    handleWeightChange,
    handleHeightChange,
    handleActivityFactorChange,
    handleSubmit,
  } = useBasicsForm({ onNext });

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Header */}
      <div className="mb-3 flex h-[34px] w-full items-center justify-between sm:mb-12 md:mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[34px] w-[34px] cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/10 bg-[#16191E] transition-all hover:border-white/20 active:scale-95"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="pointer-events-none h-6 w-6 text-foreground/80" />
        </button>

        <h2 className="heading-h2 text-center">Tell Us About Yourself</h2>

        <div className="pointer-events-none h-[34px] w-[34px] opacity-0" />
      </div>

      {/* Form */}
      <form
        id="basics-form"
        noValidate
        onSubmit={handleSubmit}
        className="mb-[18px] flex w-full flex-col gap-8"
      >
        {/* 1. Name Section */}
        <div className="flex flex-col gap-2">
          <label className="form-label">Name</label>
          <div className="flex flex-col gap-3">
            <Input
              label="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder="First Name"
              maxLength={25}
              error={fieldErrors.firstName}
              hasError={Boolean(fieldErrors.firstName)}
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Last Name"
              maxLength={25}
              error={fieldErrors.lastName}
              hasError={Boolean(fieldErrors.lastName)}
            />
          </div>
        </div>

        {/* 2. Gender Section */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <label className="form-label">Gender</label>
            <InfoTooltip
              title="Gender"
              content="Used to calculate your Basal Metabolic Rate (BMR) via the Mifflin-St Jeor formula."
              align="left"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectButton
              isSelected={gender === 'male'}
              onClick={() => handleGenderSelect('male')}
            >
              Male
            </SelectButton>
            <SelectButton
              isSelected={gender === 'female'}
              onClick={() => handleGenderSelect('female')}
            >
              Female
            </SelectButton>
          </div>
        </div>

        {/* 3. Metrics Section */}
        <div className="grid grid-cols-3 items-start gap-2">
          {/* Age */}
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex w-full items-center justify-between">
              <label className="form-label truncate">Age</label>
              <InfoTooltip
                title="Age"
                content="Metabolic rate naturally adjusts with age."
                align="left"
              />
            </div>
            <Input
              type="text"
              inputMode="numeric"
              value={age}
              onKeyDown={blockInvalidIntegerInput}
              onChange={handleAgeChange}
              placeholder="23"
              maxLength={3}
              className="px-1 text-center"
              error={fieldErrors.age}
              hasError={Boolean(fieldErrors.age)}
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex w-full items-center justify-between">
              <label className="form-label truncate">Weight (KG)</label>
              <InfoTooltip
                title="Weight"
                content="Key metric for calculating daily caloric burn and macro breakdown."
                align="center"
              />
            </div>
            <Input
              type="text"
              inputMode="decimal"
              value={weight}
              onKeyDown={blockInvalidNumberInput}
              onChange={handleWeightChange}
              placeholder="70"
              maxLength={5}
              className="px-1 text-center"
              error={fieldErrors.weight}
              hasError={Boolean(fieldErrors.weight)}
            />
          </div>

          {/* Height */}
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex w-full items-center justify-between">
              <label className="form-label truncate">Height (CM)</label>
              <InfoTooltip
                title="Height"
                content="Taller individuals have larger surface area, increasing basal energy needs."
                align="right"
              />
            </div>
            <Input
              type="text"
              inputMode="numeric"
              value={height}
              onKeyDown={blockInvalidIntegerInput}
              onChange={handleHeightChange}
              placeholder="175"
              maxLength={3}
              className="px-1 text-center"
              error={fieldErrors.height}
              hasError={Boolean(fieldErrors.height)}
            />
          </div>
        </div>
        <ActivitySlider
          value={activityFactor}
          onChange={handleActivityFactorChange}
        />
      </form>
      <div className="pt-1">
        <Button form="basics-form" type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
