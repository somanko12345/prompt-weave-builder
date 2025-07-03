// AI service for OpenRouter API integration
// This would connect to OpenRouter for Gemini and DeepSeek models

export interface GenerateWebsiteRequest {
  prompt: string;
  existingCode?: {
    html: string;
    css: string;
    js: string;
  };
  isUpdate?: boolean;
}

export interface GenerateWebsiteResponse {
  html: string;
  css: string;
  js: string;
  success: boolean;
  error?: string;
}

// Mock AI service for demo
export const aiService = {
  // Generate website from prompt using OpenRouter
  generateWebsite: async (request: GenerateWebsiteRequest): Promise<GenerateWebsiteResponse> => {
    console.log('Generating website with prompt:', request.prompt);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock responses based on prompt content
    const isLandingPage = request.prompt.toLowerCase().includes('landing');
    const isPortfolio = request.prompt.toLowerCase().includes('portfolio');
    const isEcommerce = request.prompt.toLowerCase().includes('ecommerce') || request.prompt.toLowerCase().includes('store');
    
    let mockResponse: GenerateWebsiteResponse;
    
    if (isLandingPage) {
      mockResponse = {
        html: generateLandingPageHTML(),
        css: '',
        js: '',
        success: true
      };
    } else if (isPortfolio) {
      mockResponse = {
        html: generatePortfolioHTML(),
        css: '',
        js: '',
        success: true
      };
    } else if (isEcommerce) {
      mockResponse = {
        html: generateEcommerceHTML(),
        css: '',
        js: '',
        success: true
      };
    } else {
      mockResponse = {
        html: generateDefaultHTML(request.prompt),
        css: '',
        js: '',
        success: true
      };
    }
    
    return mockResponse;
  }
};

// Mock HTML generators
function generateLandingPageHTML(): string {
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-white text-xl font-bold">SaaS Product</div>
        <div class="space-x-4">
          <button class="text-white hover:text-blue-200">Features</button>
          <button class="text-white hover:text-blue-200">Pricing</button>
          <button class="px-4 py-2 bg-white text-purple-900 rounded-lg hover:bg-blue-50">Sign Up</button>
        </div>
      </nav>
      
      <div class="container mx-auto px-6 py-20 text-center">
        <h1 class="text-6xl font-bold text-white mb-6">
          Transform Your Business with AI
        </h1>
        <p class="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
          Powerful SaaS solution that helps you scale faster and work smarter with cutting-edge AI technology.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Start Free Trial
          </button>
          <button class="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
      
      <div class="container mx-auto px-6 py-16">
        <h2 class="text-4xl font-bold text-white text-center mb-12">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-3">AI-Powered Analytics</h3>
            <p class="text-blue-200">Get insights that matter with our advanced AI analytics engine.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-3">Seamless Integration</h3>
            <p class="text-blue-200">Connect with your existing tools and workflows effortlessly.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-3">Enterprise Security</h3>
            <p class="text-blue-200">Bank-grade security to protect your most sensitive data.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generatePortfolioHTML(): string {
  return `
    <div class="min-h-screen bg-gray-900 text-white">
      <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-2xl font-bold">John Designer</div>
        <div class="space-x-6">
          <a href="#about" class="hover:text-blue-400">About</a>
          <a href="#work" class="hover:text-blue-400">Work</a>
          <a href="#contact" class="hover:text-blue-400">Contact</a>
        </div>
      </nav>
      
      <div class="container mx-auto px-6 py-20">
        <div class="text-center mb-16">
          <h1 class="text-6xl font-bold mb-6">
            Creative <span class="text-blue-400">Designer</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            I create beautiful digital experiences that combine functionality with stunning visual design.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div class="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
            <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Web App Design</h3>
              <p class="text-gray-300">Modern SaaS application interface</p>
            </div>
          </div>
          
          <div class="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
            <div class="h-48 bg-gradient-to-br from-green-500 to-blue-600"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Mobile App</h3>
              <p class="text-gray-300">iOS & Android app design</p>
            </div>
          </div>
          
          <div class="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
            <div class="h-48 bg-gradient-to-br from-pink-500 to-red-600"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Brand Identity</h3>
              <p class="text-gray-300">Complete brand redesign</p>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p class="text-gray-300 mb-8">Ready to bring your ideas to life?</p>
          <button class="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateEcommerceHTML(): string {
  return `
    <div class="min-h-screen bg-white">
      <nav class="border-b border-gray-200 px-6 py-4">
        <div class="container mx-auto flex items-center justify-between">
          <div class="text-2xl font-bold text-gray-800">ShopFlow</div>
          <div class="flex items-center space-x-6">
            <a href="#" class="text-gray-600 hover:text-gray-800">Categories</a>
            <a href="#" class="text-gray-600 hover:text-gray-800">Deals</a>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Cart (0)
            </button>
          </div>
        </div>
      </nav>
      
      <div class="container mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-800 mb-4">
            Premium Products, Unbeatable Prices
          </h1>
          <p class="text-xl text-gray-600">
            Discover amazing deals on the latest products from top brands
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100 rounded-lg mb-4"></div>
            <h3 class="font-semibold text-gray-800 mb-2">Premium Headphones</h3>
            <p class="text-gray-600 mb-3">High-quality wireless headphones</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">$199</span>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100 rounded-lg mb-4"></div>
            <h3 class="font-semibold text-gray-800 mb-2">Smart Watch</h3>
            <p class="text-gray-600 mb-3">Latest fitness tracking technology</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">$299</span>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100 rounded-lg mb-4"></div>
            <h3 class="font-semibold text-gray-800 mb-2">Laptop Stand</h3>
            <p class="text-gray-600 mb-3">Ergonomic aluminum laptop stand</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">$79</span>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100 rounded-lg mb-4"></div>
            <h3 class="font-semibold text-gray-800 mb-2">Wireless Mouse</h3>
            <p class="text-gray-600 mb-3">Precision wireless gaming mouse</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">$59</span>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateDefaultHTML(prompt: string): string {
  return `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-6 py-20">
        <div class="text-center space-y-8">
          <h1 class="text-6xl font-bold text-white mb-6">
            AI Generated Website
          </h1>
          <p class="text-xl text-purple-200 max-w-2xl mx-auto">
            This beautiful website was created from your prompt: "${prompt}"
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Get Started
            </button>
            <button class="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}