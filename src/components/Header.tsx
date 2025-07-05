import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    photoURL?: string;
    plan: 'free' | 'premium';
  } | null;
}

export const Header = ({ user }: HeaderProps) => {
  const { signOut } = useAuth();
  return (
    <header className="w-full border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">PromptEy</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="/dashboard" 
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/dashboard';
            }}
          >
            Dashboard
          </a>
          <a 
            href="/projects" 
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/projects';
            }}
          >
            Projects
          </a>
          <a 
            href="/" 
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
          >
            Home
          </a>
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Plan Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.plan === 'premium' 
                  ? 'bg-gradient-primary text-white' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {user.plan === 'premium' ? 'Premium' : 'Free'}
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card">
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button className="btn-primary">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};