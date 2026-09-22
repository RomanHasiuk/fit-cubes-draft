import { Greeting } from '@/components/dashboard/Greeting';
import { CalorieRing } from '@/components/dashboard/CalorieRing';
import { MacroBars } from '@/components/dashboard/MacroBars';
import { EnergyBalanceCard } from '@/components/dashboard/EnergyBalanceCard';
import ProgressScreen from './ProgressScreen';

export default function Dashboard() {

  return (

    <div className="flex flex-col h-full">
              <Greeting />
              <CalorieRing />
              <MacroBars />
              <EnergyBalanceCard />
              <ProgressScreen />
    </div>
  );
}

