import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

/**
 * Syncs a local modal open/close boolean with the global `openModalCount` in Zustand.
 * Increments on open, decrements on close or unmount — safe for nested modals.
 *
 * Usage: `useModalOpen(showFoodSearch);`
 */
export function useModalOpen(isOpen: boolean): void {
  const increment = useStore((state) => state.incrementOpenModals);
  const decrement = useStore((state) => state.decrementOpenModals);

  useEffect(() => {
    if (isOpen) {
      increment();
      return () => decrement();
    }
  }, [isOpen, increment, decrement]);
}
