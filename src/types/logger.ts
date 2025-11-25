export interface LogEntry {
  timestamp: string;
  type: string;
  name: string;
  value: any;
  timeInSeconds: number;
}

export interface Pose2d {
  x: number;
  y: number;
  heading: number;
}

export interface ParsedData {
  entries: LogEntry[];
  numericFields: string[];
  poseFields: string[];
  maxTime: number;
}
