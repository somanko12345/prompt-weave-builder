// Configuration constants for PromptEy
// In production, these would come from secure environment variables

export const CONFIG = {
  // Firebase Configuration (Developer to add)
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  },

  // OpenRouter API Configuration (Developer to add)
  openRouter: {
    apiKey: "YOUR_OPENROUTER_API_KEY",
    baseUrl: "https://openrouter.ai/api/v1",
    models: {
      gemini: "google/gemini-pro",
      deepseek: "deepseek/deepseek-r1"
    }
  },

  // Payment Configuration (Developer to add)
  payments: {
    razorpay: {
      keyId: "YOUR_RAZORPAY_KEY_ID",
      keySecret: "YOUR_RAZORPAY_KEY_SECRET"
    },
    paypal: {
      clientId: "YOUR_PAYPAL_CLIENT_ID",
      clientSecret: "YOUR_PAYPAL_CLIENT_SECRET"
    }
  },

  // App Configuration
  app: {
    name: "PromptEy",
    version: "1.0.0",
    domain: "promptey.com",
    supportEmail: "support@promptey.com"
  },

  // Plan Limits
  plans: {
    free: {
      maxProjects: 5,
      maxPrompts: 5,
      canDownload: false
    },
    premium: {
      maxProjects: 10,
      maxPrompts: -1, // Unlimited
      canDownload: true
    }
  }
};

// Feature flags
export const FEATURES = {
  mockMode: true, // Set to false when connecting real APIs
  enableAnalytics: true,
  enablePayments: true,
  enableDownloads: true
};