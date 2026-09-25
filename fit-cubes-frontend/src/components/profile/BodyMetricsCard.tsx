import React from 'react';
import { SelectButton } from '@/components/ui/SelectButton';
import { Input } from '@/components/ui/input';
import { ActivitySlider } from '@/components/basics/ActivitySlider';
import InfoTooltip from '@/components/InfoTooltip';
import {
  GENDER_OPTIONS,
  type Gender,
} from '@/constants';
import {
  blockInvalidIntegerInput,
  blockInvalidNumberInput,
  sanitizePositiveInt,
} from '@/utils/inputHandlers';
import { clampValue } from '@/utils/calculations';

interface BodyMetricsCardProps {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activityFactor: number;
  onGenderChange: (gender: Gender) => void;
  onAgeChange: (age: number) => void;
  onWeightChange: (weight: number) => void;
  onHeightChange: (height: number) => void;
  onActivityChange: (factor: number) => void;
}

export const BodyMetricsCard: React.FC<BodyMetricsCardProps> = ({
  gender,
  age,
  weightKg,
  heightCm,
  activityFactor,
  onGenderChange,
  onAgeChange,
  onWeightChange,
  onHeightChange,
  onActivityChange,
}) => {
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = sanitizePositiveInt(e.target.value);
    onAgeChange(typeof val === 'number' ? val : 0);
  };

  const handleAgeBlur = () => {
    onAgeChange(clampValue(age, 16, 120, 25));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, '.');
    onWeightChange(val === '' ? 0 : parseFloat(val) || 0);
  };

  const handleWeightBlur = () => {
    onWeightChange(clampValue(weightKg, 30, 300, 70));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = sanitizePositiveInt(e.target.value);
    onHeightChange(typeof val === 'number' ? val : 0);
  };

  const handleHeightBlur = () => {
    onHeightChange(clampValue(heightCm, 100, 250, 175));
  };

  return (
    <div className="flex flex-col gap-6 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-4 md:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-[#32363E]/60 pb-3">
        <h3 className="font-sans text-[16px] font-semibold text-foreground">
          Body Metrics
        </h3>
        <InfoTooltip
          title="Body Metrics"
          content="Your biometric parameters are used to precisely calculate your basal metabolism according to the Mifflin-St Jeor equation."
          align="right"
        />
      </div>

      {/* Gender Selection */}
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <label className="form-label text-[14px] font-medium text-foreground">Gender</label>
          <InfoTooltip
            title="Gender"
            content="Used to calculate your Basal Metabolic Rate (BMR) via the Mifflin-St Jeor formula."
            align="right"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {GENDER_OPTIONS.map((opt) => (
            <SelectButton
              key={opt.id}
              isSelected={gender === opt.id}
              onClick={() => onGenderChange(opt.id)}
            >
              {opt.label}
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Metrics Inputs */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Age */}
        <div className="flex flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <label className="form-label text-[13px] font-medium text-foreground truncate">Age</label>
            <InfoTooltip
              title="Age"
              content="Metabolism slows down with age, gradually adjusting calorie requirements."
              align="left"
            />
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={age || ''}
            onKeyDown={blockInvalidIntegerInput}
            onChange={handleAgeChange}
            onBlur={handleAgeBlur}
            placeholder="25"
            maxLength={3}
            className="text-center"
          />
        </div>

        {/* Weight */}
        <div className="flex flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <label className="form-label text-[13px] font-medium text-foreground truncate">Weight (kg)</label>
            <InfoTooltip
              title="Weight"
              content="More body mass requires more energy to sustain at rest and during exercise."
              align="center"
            />
          </div>
          <Input
            type="text"
            inputMode="decimal"
            value={weightKg || ''}
            onKeyDown={blockInvalidNumberInput}
            onChange={handleWeightChange}
            onBlur={handleWeightBlur}
            placeholder="75"
            maxLength={5}
            className="text-center"
          />
        </div>

        {/* Height */}
        <div className="flex flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <label className="form-label text-[13px] font-medium text-foreground truncate">Height (cm)</label>
            <InfoTooltip
              title="Height"
              content="Height correlates directly with body surface area and basal energy expenditure."
              align="right"
            />
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={heightCm || ''}
            onKeyDown={blockInvalidIntegerInput}
            onChange={handleHeightChange}
            onBlur={handleHeightBlur}
            placeholder="175"
            maxLength={3}
            className="text-center"
          />
        </div>
      </div>

      {/* Activity Slider */}
      <div className="border-t border-[#32363E]/60 pt-4">
        <ActivitySlider
          value={activityFactor}
          onChange={onActivityChange}
        />
      </div>
    </div>
  );
};
