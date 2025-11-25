# Logger

A simple web-based tool for visualizing custom `.txt` logger files.  
Upload a log file and instantly view all parsed numeric fields and X/Y coordinates on an interactive line graph.

## Features
- Upload `.txt` log files using Erin’s format (`timestamp;type;name;value`)
- Automatically plots **pose.x** and **pose.y** as a full line graph
- X-axis uses increasing index values (0, 1, 2, 3…)
- Left-side panel lists every numeric field as individual checkboxes
- Toggle fields on/off to show or hide data lines
- Always-visible full line graph (playback does not crop the view)
- Playback cursor moves across the graph to show the current time position
- Clean, simplified UI (no robot image, no field visualization)

## Expected Log Format
```java
timestamp;type;name;value
0.021;double;pose.x;1.024
0.021;double;pose.y;2.551
0.021;double;heading;1.5707
```
