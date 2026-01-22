import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, X, Download, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import useScrollReveal from '@/hooks/useScrollReveal';

export interface UploadedFile {
  name: string;
  content: string;
  type: string;
}

export interface ParsedData {
  headers: string[];
  rows: string[][];
  numericColumns: { [key: string]: number[] };
  columnStats: { [key: string]: { min: number; max: number; avg: number; sum: number } };
}

interface FileUploadSectionProps {
  onDataParsed?: (data: ParsedData | null) => void;
}

const FileUploadSection = ({ onDataParsed }: FileUploadSectionProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [report, setReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
  const { ref: sectionRef } = useScrollReveal();

  const parseCSV = useCallback((content: string): string[][] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  }, []);

  // Parse and emit data whenever files change
  useEffect(() => {
    if (files.length === 0) {
      onDataParsed?.(null);
      return;
    }

    // Find the first CSV file for chart data
    const csvFile = files.find(f => f.name.endsWith('.csv') || f.type === 'text/csv');
    if (!csvFile) {
      onDataParsed?.(null);
      return;
    }

    const data = parseCSV(csvFile.content);
    const headers = data[0] || [];
    const rows = data.slice(1);

    // Extract numeric columns
    const numericColumns: { [key: string]: number[] } = {};
    const columnStats: { [key: string]: { min: number; max: number; avg: number; sum: number } } = {};

    headers.forEach((header, colIndex) => {
      const values = rows.map(row => parseFloat(row[colIndex])).filter(n => !isNaN(n));
      if (values.length > 0) {
        numericColumns[header] = values;
        const sum = values.reduce((a, b) => a + b, 0);
        columnStats[header] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: sum / values.length,
          sum
        };
      }
    });

    onDataParsed?.({ headers, rows, numericColumns, columnStats });
  }, [files, parseCSV, onDataParsed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: file.name,
          content: e.target?.result as string,
          type: file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'text/plain')
        });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'text/plain' || 
              file.type === 'text/csv' || 
              file.name.endsWith('.txt') || 
              file.name.endsWith('.csv')
    );

    if (droppedFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only .txt or .csv files",
        variant: "destructive"
      });
      return;
    }

    const processedFiles = await Promise.all(droppedFiles.map(processFile));
    setFiles(prev => [...prev, ...processedFiles]);
    setReport('');
  }, [toast]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'text/plain' || 
              file.type === 'text/csv' || 
              file.name.endsWith('.txt') || 
              file.name.endsWith('.csv')
    );

    if (selectedFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only .txt or .csv files",
        variant: "destructive"
      });
      return;
    }

    const processedFiles = await Promise.all(selectedFiles.map(processFile));
    setFiles(prev => [...prev, ...processedFiles]);
    setReport('');
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setReport('');
  };

  const generateReport = async () => {
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file to generate a report",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate processing time for demo
    await new Promise(resolve => setTimeout(resolve, 1500));

    let reportContent = `# Data Analysis Report\n`;
    reportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    reportContent += `---\n\n`;

    files.forEach((file, fileIndex) => {
      reportContent += `## File ${fileIndex + 1}: ${file.name}\n\n`;

      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const data = parseCSV(file.content);
        const headers = data[0] || [];
        const rows = data.slice(1);

        reportContent += `### Overview\n`;
        reportContent += `- **Columns:** ${headers.length}\n`;
        reportContent += `- **Rows:** ${rows.length}\n`;
        reportContent += `- **Headers:** ${headers.join(', ')}\n\n`;

        // Basic statistics for numeric columns
        reportContent += `### Column Analysis\n\n`;
        headers.forEach((header, colIndex) => {
          const values = rows.map(row => row[colIndex]).filter(v => v !== undefined && v !== '');
          const numericValues = values.map(v => parseFloat(v)).filter(n => !isNaN(n));
          
          reportContent += `#### ${header}\n`;
          reportContent += `- Total entries: ${values.length}\n`;
          reportContent += `- Unique values: ${new Set(values).size}\n`;
          
          if (numericValues.length > 0) {
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const avg = sum / numericValues.length;
            const min = Math.min(...numericValues);
            const max = Math.max(...numericValues);
            
            reportContent += `- Min: ${min.toFixed(2)}\n`;
            reportContent += `- Max: ${max.toFixed(2)}\n`;
            reportContent += `- Average: ${avg.toFixed(2)}\n`;
            reportContent += `- Sum: ${sum.toFixed(2)}\n`;
          }
          reportContent += `\n`;
        });

        // Sample data preview
        reportContent += `### Data Preview (First 5 rows)\n\n`;
        reportContent += `| ${headers.join(' | ')} |\n`;
        reportContent += `| ${headers.map(() => '---').join(' | ')} |\n`;
        rows.slice(0, 5).forEach(row => {
          reportContent += `| ${row.join(' | ')} |\n`;
        });
        reportContent += `\n`;

      } else {
        // Text file analysis
        const lines = file.content.split('\n');
        const words = file.content.split(/\s+/).filter(w => w.length > 0);
        const chars = file.content.length;
        
        reportContent += `### Text Analysis\n`;
        reportContent += `- **Lines:** ${lines.length}\n`;
        reportContent += `- **Words:** ${words.length}\n`;
        reportContent += `- **Characters:** ${chars}\n`;
        reportContent += `- **Average words per line:** ${(words.length / lines.length).toFixed(1)}\n\n`;

        // Word frequency
        const wordFreq: Record<string, number> = {};
        words.forEach(word => {
          const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (w.length > 2) {
            wordFreq[w] = (wordFreq[w] || 0) + 1;
          }
        });
        
        const topWords = Object.entries(wordFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        if (topWords.length > 0) {
          reportContent += `### Top 10 Words\n\n`;
          reportContent += `| Word | Frequency |\n`;
          reportContent += `| --- | --- |\n`;
          topWords.forEach(([word, freq]) => {
            reportContent += `| ${word} | ${freq} |\n`;
          });
          reportContent += `\n`;
        }

        // Content preview
        reportContent += `### Content Preview\n\n`;
        reportContent += `\`\`\`\n${file.content.slice(0, 500)}${file.content.length > 500 ? '...' : ''}\n\`\`\`\n\n`;
      }

      reportContent += `---\n\n`;
    });

    reportContent += `## Summary\n\n`;
    reportContent += `This report analyzed ${files.length} file(s) and extracted key metrics and insights from the data.\n`;

    setReport(reportContent);
    setIsGenerating(false);
    
    toast({
      title: "Report generated!",
      description: "Your analysis report is ready to download",
    });
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report downloaded!",
      description: "Check your downloads folder",
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden reveal-on-scroll"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Upload & Generate</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drop your text or CSV files and transform them into comprehensive analysis reports
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Files
            </h3>
            
            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                ${isDragging 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                }
              `}
            >
              <input
                type="file"
                accept=".txt,.csv,text/plain,text/csv"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300
                  ${isDragging ? 'bg-primary/30 scale-110' : 'bg-white/10'}
                `}>
                  <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-lg font-medium mb-2">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse • .txt and .csv files only
                </p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-muted-foreground">{files.length} file(s) uploaded</p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-white/10">
                        {file.name.endsWith('.csv') ? 'CSV' : 'TXT'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <Button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-medium"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            )}
          </GlassCard>

          {/* Report Preview */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Generated Report
              </h3>
              {report && (
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-accent/50 hover:bg-accent/20 text-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            <div className="min-h-[400px] max-h-[500px] overflow-y-auto rounded-lg bg-black/30 border border-white/10 p-4">
              {report ? (
                <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-mono leading-relaxed">
                  {report}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-center">
                    Upload files and click "Generate Report"<br />
                    to see your analysis here
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default FileUploadSection;
