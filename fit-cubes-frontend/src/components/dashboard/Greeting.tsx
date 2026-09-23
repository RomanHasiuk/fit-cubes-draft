import type React from 'react';
import { useStore } from '@/store/useStore';
import { getRelativeDateLabel } from '@/utils/calculations';

export const Greeting: React.FC = () => {
  const profile = useStore((state) => state.profile);
  const selectedDate = useStore((state) => state.selectedDate);

  return (
    <div className="shrink-0 px-5 pb-2 pt-[102px] md:pt-[126px]">
      <p className="text-sm text-muted-foreground">
        {getRelativeDateLabel(selectedDate)}
      </p>
      <h1 className="heading-h2">
        {getTimeOfDay()}, {profile.name || 'Friend'}
      </h1>
    </div>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
