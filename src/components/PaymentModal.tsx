import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Download, Plus, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: {
    inr: number;
    usd: number;
  };
  features: string[];
  popular?: boolean;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  userRegion: 'IN' | 'INTL';
  onPaymentSuccess: (planId: string) => void;
}

const plans: Plan[] = [
  {
    id: 'download',
    name: 'Download Only',
    price: { inr: 50, usd: 4.99 },
    features: [
      'Download current project as ZIP',
      'All source files included',
      'One-time payment'
    ]
  },
  {
    id: 'premium-download',
    name: 'Premium Download',
    price: { inr: 65, usd: 5.99 },
    features: [
      'Download current project as ZIP',
      '10 additional prompts',
      'Priority generation',
      'One-time payment'
    ],
    popular: true
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: { inr: 150, usd: 12.99 },
    features: [
      'Unlimited prompts',
      'Unlimited downloads',
      'Priority support',
      'Advanced AI models',
      'Custom domains (coming soon)'
    ]
  }
];

export const PaymentModal = ({ open, onClose, userRegion, onPaymentSuccess }: PaymentModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium-download');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (planId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment successful!",
        description: "Your plan has been activated.",
      });
      
      onPaymentSuccess(planId);
      onClose();
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentProvider = () => {
    return userRegion === 'IN' ? 'Razorpay' : 'PayPal';
  };

  const getCurrency = () => {
    return userRegion === 'IN' ? '₹' : '$';
  };

  const getPrice = (plan: Plan) => {
    return userRegion === 'IN' ? plan.price.inr : plan.price.usd;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <p className="text-center text-muted-foreground">
            Unlock the full potential of PromptEy
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:scale-105'
              } ${plan.popular ? 'ring-2 ring-primary/50' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">
                      {getCurrency()}{getPrice(plan)}
                    </span>
                    {plan.id === 'premium-monthly' && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Payment will be processed via {getPaymentProvider()}
            </p>
            
            <Button
              onClick={() => handlePayment(selectedPlan)}
              disabled={isProcessing}
              className="btn-primary w-full max-w-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedPlan === 'download' || selectedPlan === 'premium-download' ? (
                    <Download className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Pay {getCurrency()}{getPrice(plans.find(p => p.id === selectedPlan)!)}
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Secure payment • Cancel anytime • 7-day money-back guarantee</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};