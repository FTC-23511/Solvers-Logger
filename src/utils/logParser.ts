import { LogEntry, ParsedData, Pose2d } from "@/types/logger";

export const parseLogFile = (content: string): ParsedData => {
  const lines = content.split('\n').filter(line => line.trim());
  const entries: LogEntry[] = [];
  const numericFields = new Set<string>();
  const poseFields = new Set<string>();
  
  let startTime: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
    
    if (nextLine.startsWith('INFO:')) {
      const timeMatch = currentLine.match(/(\d{1,2}):(\d{2}):(\d{2})/);
      if (!timeMatch) continue;
      
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const seconds = parseInt(timeMatch[3]);
      
      let totalHours = hours;
      if (currentLine.includes('PM') && hours !== 12) {
        totalHours += 12;
      } else if (currentLine.includes('AM') && hours === 12) {
        totalHours = 0;
      }
      
      const timeInSeconds = totalHours * 3600 + minutes * 60 + seconds;
      
      if (startTime === null) {
        startTime = timeInSeconds;
      }
      
      const relativeTime = timeInSeconds - startTime;
      
      const dataLine = nextLine.substring(5).trim();
      
      const fields = dataLine.split(';').filter(f => f.trim());
      
      fields.forEach(field => {
        const parts = field.split(':');
        if (parts.length < 3) return;
        
        const name = parts[0].trim();
        const type = parts[1].trim();
        const valueStr = parts.slice(2).join(':').trim();
        
        let value: string | number | boolean | Pose2d = valueStr;
        
        if (type === 'Pose' || type === 'Pose2d') {
          const match = valueStr.match(/\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
          if (match) {
            value = {
              x: parseFloat(match[1]),
              y: parseFloat(match[2]),
              heading: parseFloat(match[3])
            } as Pose2d;
            poseFields.add(name);
            numericFields.add(`${name}.x`);
            numericFields.add(`${name}.y`);
          }
        } 
        else if (['Double', 'Long', 'Int', 'Float', 'Number', 'double', 'long', 'int', 'float', 'number'].includes(type)) {
          value = parseFloat(valueStr);
          if (!isNaN(value)) {
            numericFields.add(name);
          }
        }
        else if (type === 'Boolean' || type === 'boolean') {
          value = valueStr === 'true';
        }
        
        entries.push({
          timestamp: currentLine,
          type,
          name,
          value,
          timeInSeconds: relativeTime
        });
      });
      
      i++;
    }
  }

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
