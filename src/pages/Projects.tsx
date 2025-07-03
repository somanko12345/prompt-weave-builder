import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Folder } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  photoURL: '',
  plan: 'free' as const,
  region: 'IN' as const,
  promptsUsed: 2,
  maxPrompts: 5,
  projectsCount: 3,
  maxProjects: 5
};

// Mock projects data
const mockProjects = [
  {
    id: '1',
    name: 'SaaS Landing Page',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    promptsUsed: 3,
    thumbnail: ''
  },
  {
    id: '2',
    name: 'Portfolio Website',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    promptsUsed: 2,
    thumbnail: ''
  },
  {
    id: '3',
    name: 'E-commerce Store',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-16'),
    promptsUsed: 4,
    thumbnail: ''
  }
];

const Projects = () => {
  const [user] = useState(mockUser);
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (projects.length >= user.maxProjects) {
      toast({
        title: "Project limit reached",
        description: `Free plan allows up to ${user.maxProjects} projects. Upgrade to create more.`,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Simulate project creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject = {
        id: String(projects.length + 1),
        name: `New Project ${projects.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        promptsUsed: 0,
        thumbnail: ''
      };
      
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: "Project created!",
        description: "Your new project is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Failed to create project",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    // Navigate to builder with project
    console.log('Opening project:', projectId);
    window.location.href = '/dashboard';
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, name: newName } : project
    ));
    
    toast({
      title: "Project renamed",
      description: `Project renamed to "${newName}".`,
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    toast({
      title: "Project deleted",
      description: "Project has been permanently deleted.",
    });
  };

  const handleDownloadProject = (projectId: string) => {
    if (user.plan === 'free') {
      toast({
        title: "Upgrade required",
        description: "Upgrade to premium to download projects.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download started",
      description: "Your project is being prepared for download.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={() => console.log('Sign out')} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground">
              Manage and organize your AI-generated websites
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant={projects.length >= user.maxProjects ? "destructive" : "secondary"}>
              {projects.length}/{user.maxProjects} projects
            </Badge>
            <Button 
              onClick={handleCreateProject}
              disabled={isCreating || projects.length >= user.maxProjects}
              className="btn-primary"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 glass-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-primary"
              />
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
                onRename={handleRenameProject}
                onDelete={handleDeleteProject}
                onDownload={handleDownloadProject}
                canDownload={user.plan !== 'free'}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 glass-card text-center">
            {searchQuery ? (
              <div className="space-y-4">
                <Search className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">No projects found</h3>
                  <p className="text-muted-foreground">
                    No projects match your search query "{searchQuery}"
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="btn-ghost"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
                  <p className="text-muted-foreground">
                    Create your first AI-powered website to get started
                  </p>
                </div>
                <Button 
                  onClick={handleCreateProject}
                  disabled={projects.length >= user.maxProjects}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Upgrade Prompt for Free Users */}
        {user.plan === 'free' && projects.length >= user.maxProjects && (
          <Card className="mt-8 p-6 glass-card border-primary/50">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Project limit reached</h3>
                <p className="text-muted-foreground">
                  Upgrade to premium to create unlimited projects and unlock advanced features
                </p>
              </div>
              <Button className="btn-primary">
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Projects;