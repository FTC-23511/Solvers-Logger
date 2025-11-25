import { useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileLoad: (content: string) => void;
}

export const FileUpload = ({ onFileLoad }: FileUploadProps) => {
  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.txt')) {
      toast.error("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content);
      toast.success("Log file loaded successfully");
    };
    reader.readAsText(file);
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
    >
      <input
        type="file"
        accept=".txt"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-foreground font-medium mb-2">
          Drop your log file here or click to browse
        </p>
        <p className="text-sm text-muted-foreground">
          Accepts .txt files
        </p>
      </label>
    </div>
  );
};
