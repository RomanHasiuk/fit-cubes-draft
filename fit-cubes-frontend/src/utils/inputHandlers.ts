import type React from 'react';

const FORBIDDEN_NUMBER_KEYS = new Set(['-', '+', 'e', 'E']);
const FORBIDDEN_INTEGER_KEYS = new Set(['-', '+', 'e', 'E', '.', ',']);

export const blockInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (FORBIDDEN_NUMBER_KEYS.has(e.key)) {
    e.preventDefault();
  }
};

export const blockInvalidIntegerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (FORBIDDEN_INTEGER_KEYS.has(e.key)) {
    e.preventDefault();
  }
};

export const sanitizePositiveInt = (value: string, max: number = 10000): number | "" => {
  if (value === "") return "";
  const clean = value.replace(/^0+(?=\d)/, "");
  const parsed = parseInt(clean, 10);
  if (isNaN(parsed) || parsed <= 0) return "";
  return Math.min(max, parsed);
};

export const sanitizeNameInput = (value: string): string => {
  return value.replace(/[^0-9\p{L}\s.,'%-]/gu, "");
};

export const sanitizeMacroInput = (value: string, max: number = 100): number | "" => {
  if (value === "") return "";
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return "";
  return Math.min(max, Math.round(parsed * 10) / 10);
};

