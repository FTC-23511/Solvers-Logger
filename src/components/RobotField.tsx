import { useEffect, useRef } from "react";
import { Pose2d } from "@/types/logger";
import fieldBackground from "@/assets/field-background.webp";
import robotImage from "@/assets/robot.webp";

interface RobotFieldProps {
  pose: Pose2d | null;
}

const FIELD_WIDTH = 144; // inches (12 feet)
const FIELD_HEIGHT = 144; // inches (12 feet)
const ROBOT_SIZE = 36; // inches

export const RobotField = ({ pose }: RobotFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Load and draw field background image
    const fieldImg = new Image();
    const robotImg = new Image();
    fieldImg.src = fieldBackground;
    robotImg.src = robotImage;

    let imagesLoaded = 0;
    const draw = () => {
      // Draw background image to fit canvas
      ctx.drawImage(fieldImg, 0, 0, width, height);

      // Draw robot if pose exists
      if (pose) {
        const scale = width / FIELD_WIDTH;
        const x = pose.x * scale;
        const y = height - (pose.y * scale); // Flip Y axis
        const robotSize = ROBOT_SIZE * scale;

        ctx.save();
        
        // Translate to robot position and rotate
        ctx.translate(x, y);
        ctx.rotate(-pose.heading); // Negative because canvas Y is flipped
        
        // Draw robot image centered
        ctx.drawImage(
          robotImg,
          -robotSize / 2,
          -robotSize / 2,
          robotSize,
          robotSize
        );
        
        ctx.restore();

        // Draw position text with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const posText = `(${pose.x.toFixed(1)}, ${pose.y.toFixed(1)}, ${(pose.heading * 180 / Math.PI).toFixed(1)}°)`;
        ctx.font = 'bold 14px monospace';
        const textMetrics = ctx.measureText(posText);
        ctx.fillRect(5, 5, textMetrics.width + 10, 25);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(posText, 10, 22);
      }
    };

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        draw();
      }
    };

    fieldImg.onload = onImageLoad;
    robotImg.onload = onImageLoad;

    // Call draw immediately if images are already loaded
    if (fieldImg.complete && robotImg.complete) {
      draw();
    }
  }, [pose]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border border-border rounded-lg max-w-full max-h-full"
      />
    </div>
  );
};
