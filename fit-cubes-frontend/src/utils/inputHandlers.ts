import type React from 'react';

/** Forbidden key characters for non-negative numeric inputs */
const FORBIDDEN_NUMBER_KEYS = new Set(['-', '+', 'e', 'E']);

/** Forbidden key characters for strictly positive integer inputs */
const FORBIDDEN_INTEGER_KEYS = new Set(['-', '+', 'e', 'E', '.', ',']);

/**
 * Blocks negative signs and exponential notation in numeric input fields.
 * Performs in O(1) time complexity with zero heap re-allocation.
 */
export const blockInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (FORBIDDEN_NUMBER_KEYS.has(e.key)) {
    e.preventDefault();
  }
};

/**
 * Blocks negative signs, exponential notation, and decimal points for integer-only input fields.
 */
export const blockInvalidIntegerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (FORBIDDEN_INTEGER_KEYS.has(e.key)) {
    e.preventDefault();
  }
};

/**
 * Normalizes input string by stripping leading zeros and clamping to a maximum positive integer.
 * Examples: "0232" -> 232, "0" -> "", "" -> ""
 */
export const sanitizePositiveInt = (value: string, max: number = 10000): number | "" => {
  if (value === "") return "";
  const clean = value.replace(/^0+(?=\d)/, "");
  const parsed = parseInt(clean, 10);
  if (isNaN(parsed) || parsed <= 0) return "";
  return Math.min(max, parsed);
};

/**
 * Sanitizes names (recipes, foods, categories), allowing Unicode letters, digits, and basic punctuation.
 */
export const sanitizeNameInput = (value: string): string => {
  return value.replace(/[^0-9\p{L}\s.,'%-]/gu, "");
};

/**
 * Sanitizes macronutrient decimal inputs (protein, fats, carbs) up to a maximum (default 100g).
 */
export const sanitizeMacroInput = (value: string, max: number = 100): number | "" => {
  if (value === "") return "";
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return "";
  return Math.min(max, Math.round(parsed * 10) / 10);
};
