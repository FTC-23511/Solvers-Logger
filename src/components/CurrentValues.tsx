import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "@/types/logger";
import { getValueAtTime } from "@/utils/logParser";

interface CurrentValuesProps {
  entries: LogEntry[];
  fields: string[];
  currentTime: number;
}

export const CurrentValues = ({ entries, fields, currentTime }: CurrentValuesProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Current Values
      </h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-4">
          {fields.map((field) => {
            const value = getValueAtTime(entries, field, currentTime);
            return (
              <div key={field} className="flex justify-between text-sm">
                <span className="font-mono text-muted-foreground">{field}:</span>
                <span className="font-mono text-foreground">
                  {value !== null && value !== undefined 
                    ? typeof value === 'number' 
                      ? value.toFixed(3)
                      : JSON.stringify(value)
                    : 'N/A'
                  }
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
