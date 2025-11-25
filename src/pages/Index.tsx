import { useState, useCallback, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { LoggerChart } from "@/components/LoggerChart";
import { parseLogFile } from "@/utils/logParser";
import { ParsedData } from "@/types/logger";
import { Card } from "@/components/ui/card";
import { FieldSelector } from "@/components/FieldSelector";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileLoad = useCallback((content: string) => {
    const parsed = parseLogFile(content);
    setData(parsed);
    setCurrentTime(0);
    setIsPlaying(false);
    // Auto-select robotPose x and y fields
    const xField = parsed.numericFields.find(f => f.includes('.x'));
    const yField = parsed.numericFields.find(f => f.includes('.y'));
    if (xField && yField) {
      setSelectedFields([xField, yField]);
    } else {
      setSelectedFields(parsed.numericFields.slice(0, 2));
    }
  }, []);

  const handleToggleField = useCallback((field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  }, []);

  const handleReset = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || !data) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.05;
        if (next >= data.maxTime) {
          setIsPlaying(false);
          return data.maxTime;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Logger Visualizer
            </h1>
            <p className="text-muted-foreground">
              Upload a .txt log file to visualize X/Y coordinate data
            </p>
          </div>
          <FileUpload onFileLoad={handleFileLoad} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Logger Visualizer</h1>
        <button
          onClick={() => setData(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Load new file
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        <Card className="p-4 w-64 flex-shrink-0">
          <FieldSelector
            fields={data.numericFields}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
          />
        </Card>
        
        <Card className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <LoggerChart
              entries={data.entries}
              selectedFields={selectedFields}
              currentTime={currentTime}
            />
          </div>
          
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentTime.toFixed(2)}s / {data.maxTime.toFixed(2)}s
              </span>
            </div>
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => setCurrentTime(value)}
              max={data.maxTime}
              step={0.01}
              className="w-full"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
