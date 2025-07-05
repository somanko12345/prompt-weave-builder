// Configuration constants for PromptEy
// In production, these would come from secure environment variables

export const CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyAfOPaXsQj2Gd6wYCQcazgqu8z9UWGcgsU",
    authDomain: "prompteyv2.firebaseapp.com",
    projectId: "prompteyv2",
    storageBucket: "prompteyv2.firebasestorage.app",
    messagingSenderId: "941705685446",
    appId: "1:941705685446:web:a2f16ea511b546d9aeaac7"
  },

  // OpenRouter API Configuration
  openRouter: {
    apiKey: "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",
    baseUrl: "https://openrouter.ai/api/v1",
    models: {
      qwen3: "qwen/qwen3-30b-a3b:free",
      deepseek: "deepseek/deepseek-chat-v3:free"
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
  mockMode: false, // Set to false when connecting real APIs
  enableAnalytics: true,
  enablePayments: true,
  enableDownloads: true
};