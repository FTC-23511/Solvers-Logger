import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number;
  maxTime: number;
  onPlayPause: () => void;
  onReset: () => void;
  onTimeChange: (time: number) => void;
}

export const TimelineControls = ({
  isPlaying,
  currentTime,
  maxTime,
  onPlayPause,
  onReset,
  onTimeChange
}: TimelineControlsProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex gap-2">
        <Button
          onClick={onPlayPause}
          size="icon"
          variant="secondary"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          onClick={onReset}
          size="icon"
          variant="secondary"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center gap-4">
        <span className="text-sm font-mono text-muted-foreground min-w-[60px]">
          {currentTime.toFixed(1)}s
        </span>
        <Slider
          value={[currentTime]}
          max={maxTime}
          step={0.1}
          onValueChange={([value]) => onTimeChange(value)}
          className="flex-1"
        />
        <span className="text-sm font-mono text-muted-foreground min-w-[60px] text-right">
          {maxTime.toFixed(1)}s
        </span>
      </div>
    </div>
  );
};
