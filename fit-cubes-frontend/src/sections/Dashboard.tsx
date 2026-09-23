import { Greeting } from '@/components/dashboard/Greeting';
import { CalorieRing } from '@/components/dashboard/CalorieRing';
import { MacroBars } from '@/components/dashboard/MacroBars';
import { EnergyBalanceCard } from '@/components/dashboard/EnergyBalanceCard';

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col">
      <Greeting />
      <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto pb-8">
        <CalorieRing />
        <MacroBars />
        <EnergyBalanceCard />
      </div>
    </div>
  );
}
