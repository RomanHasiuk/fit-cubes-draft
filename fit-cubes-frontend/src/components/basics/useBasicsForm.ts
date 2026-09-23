import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  sanitizeNameInput,
  sanitizePositiveInt,
} from '@/utils/inputHandlers';
import type { Gender } from '@/constants';

export const BASICS_LIMITS = {
  age: { min: 16, max: 120 },
  weight: { min: 30, max: 300 },
  height: { min: 100, max: 250 },
  name: { min: 2, max: 50 },
} as const;

export interface BasicsFieldErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  weight?: string;
  height?: string;
}

interface UseBasicsFormProps {
  onNext: () => void;
}

export function useBasicsForm({ onNext }: UseBasicsFormProps) {
  const profile = useStore((state) => state.profile);
  const updateProfile = useStore((state) => state.updateProfile);

  const getInitialName = () => {
    let nameStr = (profile.name || '').trim();
    if (!nameStr) {
      try {
        const stored = localStorage.getItem('fitcubes_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.name) nameStr = String(parsed.name).trim();
        }
      } catch {
        // ignore parse error
      }
    }
    return nameStr;
  };

  const [firstName, setFirstName] = useState(() => {
    const parts = getInitialName().split(' ');
    return parts[0] || '';
  });
  const [lastName, setLastName] = useState(() => {
    const parts = getInitialName().split(' ');
    return parts.slice(1).join(' ') || '';
  });

  const [gender, setGender] = useState<Gender>(profile.gender || 'male');
  const [age, setAge] = useState<string>(profile.age ? String(profile.age) : '28');
  const [weight, setWeight] = useState<string>(profile.weightKg ? String(profile.weightKg) : '85.5');
  const [height, setHeight] = useState<string>(profile.heightCm ? String(profile.heightCm) : '180');
  const [activityFactor, setActivityFactor] = useState<number>(profile.activityFactor || 1.5);
  const [fieldErrors, setFieldErrors] = useState<BasicsFieldErrors>({});

  const clearFieldError = (field: keyof BasicsFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);

    if (
      selectedGender === 'female' &&
      gender === 'male' &&
      age === '28' &&
      weight === '85.5' &&
      height === '180'
    ) {
      setAge('25');
      setWeight('65');
      setHeight('168');
    } else if (
      selectedGender === 'male' &&
      gender === 'female' &&
      age === '25' &&
      weight === '65' &&
      height === '168'
    ) {
      setAge('28');
      setWeight('85.5');
      setHeight('180');
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError('firstName');
    setFirstName(sanitizeNameInput(e.target.value));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError('lastName');
    setLastName(sanitizeNameInput(e.target.value));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError('age');
    const val = sanitizePositiveInt(e.target.value, 150);
    setAge(val === '' ? '' : String(val));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError('weight');
    const raw = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    let clean = parts[0];
    if (parts.length > 1) {
      clean += '.' + parts.slice(1).join('').slice(0, 1);
    }
    setWeight(clean);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError('height');
    const val = sanitizePositiveInt(e.target.value, 300);
    setHeight(val === '' ? '' : String(val));
  };

  const handleActivityFactorChange = (val: number) => {
    setActivityFactor(val);
  };

  const validateForm = (): boolean => {
    const errors: BasicsFieldErrors = {};

    const cleanFirstName = firstName.trim();
    if (!cleanFirstName) {
      errors.firstName = 'Enter first name';
    } else if (cleanFirstName.length < BASICS_LIMITS.name.min) {
      errors.firstName = `Min ${BASICS_LIMITS.name.min} letters`;
    }

    const cleanLastName = lastName.trim();
    if (!cleanLastName) {
      errors.lastName = 'Enter last name';
    } else if (cleanLastName.length < BASICS_LIMITS.name.min) {
      errors.lastName = `Min ${BASICS_LIMITS.name.min} letters`;
    }

    const fullName = `${cleanFirstName} ${cleanLastName}`.trim();
    if (fullName.length > BASICS_LIMITS.name.max) {
      errors.lastName = `Max ${BASICS_LIMITS.name.max} chars`;
    }

    const numAge = parseInt(age, 10);
    if (!age.trim() || isNaN(numAge) || numAge < BASICS_LIMITS.age.min || numAge > BASICS_LIMITS.age.max) {
      errors.age = `${BASICS_LIMITS.age.min}–${BASICS_LIMITS.age.max}`;
    }

    const numWeight = parseFloat(weight);
    if (!weight.trim() || isNaN(numWeight) || numWeight < BASICS_LIMITS.weight.min || numWeight > BASICS_LIMITS.weight.max) {
      errors.weight = `${BASICS_LIMITS.weight.min}–${BASICS_LIMITS.weight.max} kg`;
    }

    const numHeight = parseInt(height, 10);
    if (!height.trim() || isNaN(numHeight) || numHeight < BASICS_LIMITS.height.min || numHeight > BASICS_LIMITS.height.max) {
      errors.height = `${BASICS_LIMITS.height.min}–${BASICS_LIMITS.height.max} cm`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const numAge = parseInt(age, 10);
    const numWeight = parseFloat(weight);
    const numHeight = parseInt(height, 10);

    updateProfile({
      name: fullName,
      gender,
      age: numAge,
      weightKg: numWeight,
      heightCm: numHeight,
      activityFactor,
    });

    onNext();
  };

  return {
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
  };
}
