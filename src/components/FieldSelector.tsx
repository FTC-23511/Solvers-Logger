import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FieldSelectorProps {
  fields: string[];
  selectedFields: string[];
  onToggleField: (field: string) => void;
}

export const FieldSelector = ({ 
  fields, 
  selectedFields, 
  onToggleField 
}: FieldSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Numeric Fields
      </h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-4">
          {fields.map((field) => (
            <div key={field} className="flex items-center space-x-2">
              <Checkbox
                id={field}
                checked={selectedFields.includes(field)}
                onCheckedChange={() => onToggleField(field)}
              />
              <Label
                htmlFor={field}
                className="text-sm font-mono cursor-pointer"
              >
                {field}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
