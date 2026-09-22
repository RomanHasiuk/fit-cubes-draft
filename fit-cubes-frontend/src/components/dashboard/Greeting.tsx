import { useStore } from "@/store/useStore";
import { getRelativeDateLabel } from "@/utils/calculations";

export const Greeting: React.FC = () => {
    const profile = useStore((state) => state.profile);
    const selectedDate = useStore((state) => state.selectedDate);
    return (
        <div className="shrink-0 px-5 pt-12 pb-2">
            <p className="text-sm text-muted-foreground">{getRelativeDateLabel(selectedDate)}</p>
            <h1 className="font-medium text-[18px] leading-[115%] tracking-normal">
                {getTimeOfDay()}, {profile.name}
            </h1>
        </div>
    )
}

function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}