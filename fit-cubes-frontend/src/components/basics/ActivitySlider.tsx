import { useRef, useCallback, type PointerEvent, type ChangeEvent } from 'react';
import InfoTooltip from '../InfoTooltip';

interface ActivitySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const MIN_ACTIVITY = 1.2;
export const MAX_ACTIVITY = 1.9;

export function ActivitySlider({
  value,
  onChange,
  min = MIN_ACTIVITY,
  max = MAX_ACTIVITY,
  step = 0.05,
}: ActivitySliderProps) {
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const updateActivityFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderTrackRef.current) return;
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + pos * (max - min);
      const rounded = Math.round(rawValue * 20) / 20;
      onChange(Number(rounded.toFixed(2)));
    },
    [min, max, onChange]
  );

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const track = sliderTrackRef.current;
    if (!track) return;
    track.setPointerCapture(e.pointerId);
    updateActivityFromPosition(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0) {
      updateActivityFromPosition(e.clientX);
    }
  };

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const sliderPercentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full mb-2">
          <span className="form-label">Activity factor</span>
          <InfoTooltip
            title="Activity Factor"
            content="Multiplier from 1.2 (sedentary desk job) to 1.9 (hard physical labor & daily sports). Multiplies your BMR to calculate TDEE."
            align="left"
          />
        </div>
        
      {/* Centered Value above Track */}
      <div className="text-center font-sans text-[16px] font-medium text-foreground leading-[1.5]">
        {value.toFixed(1)}
      </div>

      {/* Slider Track and Thumb */}
      <div
        ref={sliderTrackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-[24px] bg-[#DFDFE2] rounded-[5px] relative flex items-center cursor-pointer select-none touch-none"
      >
        {/* Thumb */}
        <div
          className="w-[18px] h-[18px] rounded-full bg-[#323236] shadow-md absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform active:scale-110"
          style={{
            left: `calc(${sliderPercentage}% - ${sliderPercentage * 0.18}px)`,
          }}
        />

        {/* Accessible hidden range input for screen readers / keyboard */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          className="sr-only"
          aria-label="Activity Factor"
        />
      </div>

      {/* Sublabels */}
      <div className="flex justify-between text-sm text-foreground/60 font-sans mt-0.5 md:mt-[5px]">
        <span>Sedentary</span>
        <span>Very Active</span>
      </div>
    </div>
  );
}
