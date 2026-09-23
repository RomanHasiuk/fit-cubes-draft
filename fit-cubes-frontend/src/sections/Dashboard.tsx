import { Greeting } from '@/components/dashboard/Greeting';
import { CalorieRing } from '@/components/dashboard/CalorieRing';
import { MacroBars } from '@/components/dashboard/MacroBars';
import { EnergyBalanceCard } from '@/components/dashboard/EnergyBalanceCard';
import ProgressScreen from '@/sections/ProgressScreen';

export default function Dashboard() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col pb-12">
      <Greeting />
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:space-y-0 lg:px-4">
        <div className="flex justify-center">
          <CalorieRing />
        </div>
        <div className="flex flex-col space-y-4">
          <MacroBars />
          <EnergyBalanceCard />
        </div>
      </div>
      <ProgressScreen />
    </div>
  );
}
