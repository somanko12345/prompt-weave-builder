import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromptBuilderProps {
  projectId?: string;
  onGenerate?: (prompt: string) => Promise<void>;
  onDownload?: () => void;
  generatedCode?: {
    html: string;
    css: string;
    js: string;
  };
  isGenerating?: boolean;
  canDownload?: boolean;
  promptsUsed?: number;
  maxPrompts?: number;
}

export const PromptBuilder = ({
  projectId,
  onGenerate,
  onDownload,
  generatedCode,
  isGenerating = false,
  canDownload = false,
  promptsUsed = 0,
  maxPrompts = 5
}: PromptBuilderProps) => {
  const [prompt, setPrompt] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the website you want to create",
        variant: "destructive"
      });
      return;
    }

    if (promptsUsed >= maxPrompts) {
      toast({
        title: "Prompt limit reached",
        description: "Upgrade to premium for unlimited prompts",
        variant: "destructive"
      });
      return;
    }

    try {
      await onGenerate?.(prompt);
      setPrompts(prev => [...prev, prompt]);
      setPrompt('');
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const updatePreview = () => {
    if (!generatedCode || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${generatedCode.css}</style>
        </head>
        <body>
          ${generatedCode.html}
          <script>${generatedCode.js}</script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(fullHTML);
    doc.close();
  };

  // Update preview when code changes
  useEffect(() => {
    if (generatedCode) {
      updatePreview();
    }
  }, [generatedCode]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Prompt Builder */}
      <div className="lg:w-1/2 flex flex-col space-y-6">
        {/* Prompt Input */}
        <Card className="p-6 glass-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Describe Your Website</h3>
              <Badge variant={promptsUsed >= maxPrompts ? "destructive" : "secondary"}>
                {promptsUsed}/{maxPrompts} prompts used
              </Badge>
            </div>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a modern landing page for a SaaS product with hero section, features, and pricing..."
              className="input-primary min-h-[120px] resize-none"
              disabled={isGenerating || promptsUsed >= maxPrompts}
            />

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || promptsUsed >= maxPrompts}
                className="btn-primary flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {prompts.length === 0 ? 'Generate Website' : 'Update Website'}
                  </>
                )}
              </Button>

              <Button
                onClick={onDownload}
                disabled={!generatedCode || !canDownload}
                variant="outline"
                className="btn-ghost"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </Card>

        {/* Previous Prompts */}
        {prompts.length > 0 && (
          <Card className="p-6 glass-card">
            <h4 className="text-md font-medium text-foreground mb-4">Previous Prompts</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {prompts.map((p, index) => (
                <div key={index} className="p-3 bg-secondary/50 rounded-lg text-sm text-foreground">
                  <div className="flex items-start justify-between">
                    <p className="flex-1 pr-2">{p}</p>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 glass-card">
          <h4 className="text-md font-medium text-foreground mb-3">💡 Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Be specific about the type of website you want</li>
            <li>• Mention desired sections (hero, about, features, etc.)</li>
            <li>• Include color preferences and style direction</li>
            <li>• Use follow-up prompts to refine and add features</li>
          </ul>
        </Card>
      </div>

      {/* Right Panel - Preview */}
      <div className="lg:w-1/2 flex flex-col">
        <Card className="flex-1 p-4 glass-card">
          <div className="h-full rounded-lg overflow-hidden border border-border/50">
            {generatedCode ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-secondary/30">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Ready to Create</h3>
                    <p className="text-muted-foreground">Enter a prompt to generate your website</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};