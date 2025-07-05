import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PromptBuilder } from '@/components/PromptBuilder';
import { PaymentModal } from '@/components/PaymentModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Folder, Download, Star, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { aiService } from '@/services/ai';
import { useAuth } from '@/hooks/useAuth';
import { createProject, updateProject, incrementUserUsage } from '@/services/database';
import { CONFIG } from '@/config/constants';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleGenerate = async (prompt: string) => {
    if (!user) return;
    
    setIsGenerating(true);
    
    try {
      // Call the AI service to generate website
      const response = await aiService.generateWebsite({
        prompt,
        existingCode: generatedCode,
        isUpdate: !!generatedCode
      });
      
      if (response.success) {
        const newCode = {
          html: response.html,
          css: response.css,
          js: response.js
        };
        setGeneratedCode(newCode);
        
        // Create or update project
        if (!currentProject) {
          const project = await createProject({
            userId: user.id,
            name: `Project ${Date.now()}`,
            prompt,
            html: response.html,
            css: response.css,
            js: response.js,
            isPublic: false
          });
          setCurrentProject(project.id);
        } else {
          await updateProject(currentProject, {
            prompt,
            html: response.html,
            css: response.css,
            js: response.js
          });
        }
        
        // Increment user usage
        await incrementUserUsage(user.id, 'promptsUsed');
        
        toast({
          title: "Website generated!",
          description: "Your website has been created successfully.",
        });
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!user?.plan || user.plan === 'free') {
      setShowPaymentModal(true);
    } else {
      // Handle download logic
      toast({
        title: "Download started",
        description: "Your project is being prepared for download.",
      });
    }
  };

  const handlePaymentSuccess = (planId: string) => {
    // Handle payment success - in real app this would update user in database
    toast({
      title: "Payment successful!",
      description: "Your plan has been upgraded.",
    });
    
    // Handle download after payment
    setTimeout(() => {
      toast({
        title: "Download ready!",
        description: "Your project files are ready for download.",
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground">You need to be signed in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const maxProjects = CONFIG.plans[user.plan].maxProjects;
  const maxPrompts = CONFIG.plans[user.plan].maxPrompts;
  const canDownload = CONFIG.plans[user.plan].canDownload;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 glass-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prompts Used</p>
                <p className="text-xl font-bold text-foreground">
                  {user.promptsUsed}/{maxPrompts === -1 ? '∞' : maxPrompts}
                </p>
              </div>
            </div>
            <Progress value={maxPrompts === -1 ? 0 : (user.promptsUsed / maxPrompts) * 100} className="mt-3" />
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Folder className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-xl font-bold text-foreground">
                  {user.projectCount}/{maxProjects === -1 ? '∞' : maxProjects}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-xl font-bold text-foreground capitalize">{user.plan}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full btn-primary"
              disabled={user.plan === 'premium'}
            >
              {user.plan === 'premium' ? (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Premium Active
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Website Builder</h1>
            <p className="text-muted-foreground">Create stunning websites with AI</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="btn-ghost" onClick={() => window.location.href = '/projects'}>
              <Folder className="w-4 h-4 mr-2" />
              My Projects
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Prompt Builder */}
        <PromptBuilder
          projectId={currentProject}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          generatedCode={generatedCode}
          isGenerating={isGenerating}
          canDownload={canDownload}
          promptsUsed={user.promptsUsed}
          maxPrompts={maxPrompts === -1 ? 999 : maxPrompts}
        />
      </main>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userRegion={(user.region as 'IN' | 'INTL') || 'INTL'}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dashboard;