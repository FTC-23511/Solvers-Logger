import { LogEntry, ParsedData, Pose2d } from "@/types/logger";

export const parseLogFile = (content: string): ParsedData => {
  const lines = content.split('\n').filter(line => line.trim());
  const entries: LogEntry[] = [];
  const numericFields = new Set<string>();
  const poseFields = new Set<string>();
  
  let startTime: number | null = null;

  lines.forEach((line) => {
    const parts = line.split(';');
    if (parts.length !== 4) return;

    const [timestamp, type, name, valueStr] = parts;
    
    // Convert timestamp to seconds
    const timeParts = timestamp.split(':').map(Number);
    const timeInSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    
    if (startTime === null) {
      startTime = timeInSeconds;
    }
    
    const relativeTime = timeInSeconds - startTime;

    let value: any = valueStr.trim();

    // Parse Pose2d
    if (type === 'Pose2d') {
      const match = valueStr.match(/\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
      if (match) {
        value = {
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
          heading: parseFloat(match[3])
        } as Pose2d;
        poseFields.add(name);
        // Add x and y as separate numeric fields for charting
        numericFields.add(`${name}.x`);
        numericFields.add(`${name}.y`);
      }
    } 
    // Parse numeric types
    else if (['double', 'long', 'int', 'float', 'number'].includes(type.toLowerCase())) {
      value = parseFloat(valueStr);
      if (!isNaN(value)) {
        numericFields.add(name);
      }
    }

    entries.push({
      timestamp,
      type,
      name,
      value,
      timeInSeconds: relativeTime
    });
  });

  const maxTime = entries.length > 0 
    ? Math.max(...entries.map(e => e.timeInSeconds))
    : 0;

  return {
    entries,
    numericFields: Array.from(numericFields),
    poseFields: Array.from(poseFields),
    maxTime
  };
};

export const getValueAtTime = (entries: LogEntry[], name: string, time: number): any => {
  // Find the entry at or before the given time
  const relevantEntries = entries.filter(e => e.name === name && e.timeInSeconds <= time);
  if (relevantEntries.length === 0) return null;
  return relevantEntries[relevantEntries.length - 1].value;
};

export const getChartDataForField = (entries: LogEntry[], fieldName: string) => {
  // Handle Pose2d x and y components
  if (fieldName.includes('.x') || fieldName.includes('.y')) {
    const [baseName, component] = fieldName.split('.');
    return entries
      .filter(e => e.name === baseName && typeof e.value === 'object')
      .map(e => ({
        time: e.timeInSeconds,
        value: e.value[component] || 0
      }));
  }
  
  return entries
    .filter(e => e.name === fieldName)
    .map(e => ({
      time: e.timeInSeconds,
      value: typeof e.value === 'number' ? e.value : 0
    }));
};
