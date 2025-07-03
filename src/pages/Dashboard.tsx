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
import { CONFIG } from '@/config/constants';

// Mock user data - in real app, this would come from authentication
interface User {
  name: string;
  email: string;
  photoURL: string;
  plan: 'free' | 'premium';
  region: 'IN' | 'INTL';
  promptsUsed: number;
  maxPrompts: number;
  projectsCount: number;
  maxProjects: number;
}

const mockUser: User = {
  name: 'John Doe',
  email: 'john@example.com',
  photoURL: '',
  plan: 'free',
  region: 'IN',
  promptsUsed: 2,
  maxPrompts: 5,
  projectsCount: 3,
  maxProjects: 5
};

// Mock generated code - in real app, this would come from AI API
const mockGeneratedCode = {
  html: `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-6 py-20">
        <div class="text-center space-y-8">
          <h1 class="text-6xl font-bold text-white mb-6">
            Welcome to the Future
          </h1>
          <p class="text-xl text-blue-200 max-w-2xl mx-auto">
            Experience innovation like never before with our cutting-edge platform designed for modern businesses.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </button>
            <button class="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  css: '',
  js: ''
};

const Dashboard = () => {
  const [user, setUser] = useState(mockUser);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      // Call the AI service to generate website
      const response = await aiService.generateWebsite({
        prompt,
        existingCode: generatedCode,
        isUpdate: !!generatedCode
      });
      
      if (response.success) {
        setGeneratedCode({
          html: response.html,
          css: response.css,
          js: response.js
        });
        
        setUser(prev => ({
          ...prev,
          promptsUsed: prev.promptsUsed + 1
        }));
        
        toast({
          title: "Website generated!",
          description: "Your website has been created successfully.",
        });
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (user.plan === 'free') {
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
    setUser(prev => ({
      ...prev,
      plan: planId === 'premium-monthly' ? 'premium' : 'free'
    }));
    
    // Handle download after payment
    setTimeout(() => {
      toast({
        title: "Download ready!",
        description: "Your project files are ready for download.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={() => console.log('Sign out')} />
      
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
                  {user.promptsUsed}/{user.maxPrompts}
                </p>
              </div>
            </div>
            <Progress value={(user.promptsUsed / user.maxPrompts) * 100} className="mt-3" />
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Folder className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-xl font-bold text-foreground">
                  {user.projectsCount}/{user.maxProjects}
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
            <Button variant="outline" className="btn-ghost">
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
          canDownload={user.plan !== 'free'}
          promptsUsed={user.promptsUsed}
          maxPrompts={user.maxPrompts}
        />
      </main>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userRegion={user.region}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dashboard;