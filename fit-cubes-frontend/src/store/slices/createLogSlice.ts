import type { StateCreator } from 'zustand';
import type { DayLog, FoodEntry, ExerciseEntry } from '@/types';
import type { StoreState } from '../useStore.ts';

export interface LogSlice {
  dailyLogs: DayLog[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getDayLog: (date: string) => DayLog | undefined;
  ensureDayLog: (date: string) => DayLog;
  addFoodEntry: (date: string, entry: FoodEntry) => void;
  updateFoodEntry: (date: string, entryId: string, updatedEntry: FoodEntry) => void;
  removeFoodEntry: (date: string, entryId: string) => void;
  addExerciseEntry: (date: string, entry: ExerciseEntry) => void;
  updateExerciseEntry: (date: string, entryId: string, updatedEntry: ExerciseEntry) => void;
  removeExerciseEntry: (date: string, entryId: string) => void;
  setWeight: (date: string, weight: number) => void;
}

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const createLogSlice: StateCreator<StoreState, [], [], LogSlice> = (set, get) => ({
  dailyLogs: [],
  selectedDate: getTodayString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  getDayLog: (date) => {
    return get().dailyLogs.find((log) => log.date === date);
  },

  ensureDayLog: (date) => {
    const existing = get().dailyLogs.find((log) => log.date === date);
    if (existing) return existing;
    const newLog: DayLog = { date, foodEntries: [], exerciseEntries: [] };
    set((state) => ({ dailyLogs: [...state.dailyLogs, newLog] }));
    return newLog;
  },

  addFoodEntry: (date, entry) => {
    set((state) => {
      const logs = [...state.dailyLogs];
      const idx = logs.findIndex((l) => l.date === date);
      if (idx >= 0) {
        logs[idx] = {
          ...logs[idx],
          foodEntries: [...logs[idx].foodEntries, entry],
        };
      } else {
        logs.push({ date, foodEntries: [entry], exerciseEntries: [] });
      }
      return { dailyLogs: logs };
    });
  },

  updateFoodEntry: (date, entryId, updatedEntry) => {
    set((state) => {
      const logs = state.dailyLogs.map((log) => {
        if (log.date === date) {
          return {
            ...log,
            foodEntries: log.foodEntries.map((e) => e.id === entryId ? updatedEntry : e),
          };
        }
        return log;
      });
      return { dailyLogs: logs };
    });
  },

  removeFoodEntry: (date, entryId) => {
    set((state) => {
      const logs = state.dailyLogs.map((log) => {
        if (log.date === date) {
          return {
            ...log,
            foodEntries: log.foodEntries.filter((e) => e.id !== entryId),
          };
        }
        return log;
      });
      return { dailyLogs: logs };
    });
  },

  addExerciseEntry: (date, entry) => {
    set((state) => {
      const logs = [...state.dailyLogs];
      const idx = logs.findIndex((l) => l.date === date);
      if (idx >= 0) {
        logs[idx] = {
          ...logs[idx],
          exerciseEntries: [...logs[idx].exerciseEntries, entry],
        };
      } else {
        logs.push({ date, foodEntries: [], exerciseEntries: [entry] });
      }
      return { dailyLogs: logs };
    });
  },

  updateExerciseEntry: (date, entryId, updatedEntry) => {
    set((state) => {
      const logs = [...state.dailyLogs];
      const idx = logs.findIndex((l) => l.date === date);
      if (idx >= 0) {
        logs[idx] = {
          ...logs[idx],
          exerciseEntries: logs[idx].exerciseEntries.map(e => e.id === entryId ? updatedEntry : e),
        };
      }
      return { dailyLogs: logs };
    });
  },

  removeExerciseEntry: (date, entryId) => {
    set((state) => {
      const logs = state.dailyLogs.map((log) => {
        if (log.date === date) {
          return {
            ...log,
            exerciseEntries: log.exerciseEntries.filter(
              (e) => e.id !== entryId
            ),
          };
        }
        return log;
      });
      return { dailyLogs: logs };
    });
  },

  setWeight: (date, weight) => {
    set((state) => {
      const logs = [...state.dailyLogs];
      const idx = logs.findIndex((l) => l.date === date);
      if (idx >= 0) {
        logs[idx] = { ...logs[idx], weight };
      } else {
        logs.push({ date, foodEntries: [], exerciseEntries: [], weight });
      }
      return { dailyLogs: logs };
    });
  },
});
