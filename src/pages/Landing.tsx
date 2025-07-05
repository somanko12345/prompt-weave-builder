import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Folder, Download, Plus, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import heroImage from '@/assets/hero-bg.jpg';

const Landing = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Create stunning websites from simple text prompts using advanced AI models"
    },
    {
      icon: <Folder className="w-6 h-6" />,
      title: "Project Management",
      description: "Organize, edit, and manage multiple website projects in one place"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Ready Code",
      description: "Download complete, production-ready HTML, CSS, and JavaScript files"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["5 projects", "Basic AI models", "Limited prompts", "Community support"],
      popular: false
    },
    {
      name: "Premium",
      price: "₹150",
      period: "/month",
      features: ["Unlimited projects", "Advanced AI models", "Unlimited prompts", "Priority support", "Custom domains"],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PromptEy</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          </div>

          <Button 
            className="btn-primary"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <User className="w-4 h-4 mr-2" />
            {loading ? 'Loading...' : 'Sign In with Google'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="py-20 px-6 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
            ✨ AI-Powered Website Builder
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Create Stunning
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Websites </span>
            with AI
          </h1>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Transform your ideas into beautiful, responsive websites using simple text prompts. 
            No coding required - just describe what you want and watch it come to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary backdrop-blur-sm"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <Plus className="w-5 h-5 mr-2" />
              {loading ? 'Loading...' : 'Start Creating Free'}
            </Button>
            <Button size="lg" variant="outline" className="btn-ghost backdrop-blur-sm border-white/30 text-white hover:bg-white/10">
              <Star className="w-5 h-5 mr-2" />
              See Examples
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="p-8 glass-card backdrop-blur-xl bg-card/10">
              <div className="bg-background/20 rounded-lg p-6 border border-border/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-lg p-8 text-white">
                  <h2 className="text-3xl font-bold mb-4">Welcome to the Future</h2>
                  <p className="text-blue-200 mb-6">Experience innovation like never before</p>
                  <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white text-purple-900 rounded-lg text-sm font-medium">Get Started</div>
                    <div className="px-4 py-2 border border-white rounded-lg text-sm font-medium">Learn More</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional websites with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`p-8 glass-card cursor-pointer transition-all duration-300 ${
                  hoveredFeature === index ? 'scale-105 shadow-glow' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative p-8 glass-card ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={signInWithGoogle}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : (plan.name === 'Free' ? 'Get Started Free' : 'Upgrade to Premium')}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Card className="p-12 glass-card max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Dream Website?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already building amazing websites with AI. 
              Start your journey today - it's completely free!
            </p>
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <Plus className="w-5 h-5 mr-2" />
              {loading ? 'Loading...' : 'Start Creating Now'}
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">PromptEy</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PromptEy. All rights reserved. Built with ❤️ and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;