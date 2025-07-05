import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Folder } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserProjects, deleteProject, createProject } from '@/services/database';
import { CONFIG } from '@/config/constants';

interface Project {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  promptsUsed?: number; // Optional for compatibility
}

const Projects = () => {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setLoadingProjects(true);
      try {
        const userProjects = await getUserProjects(user.id);
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error loading projects",
          description: "Failed to load your projects",
          variant: "destructive"
        });
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && project.isPublic) ||
                           (filterBy === 'private' && !project.isPublic);
      
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, filterBy]);

  const handleCreateProject = async () => {
    if (!user) return;
    
    const maxProjects = CONFIG.plans[user.plan].maxProjects;
    if (projects.length >= maxProjects && maxProjects !== -1) {
      toast({
        title: "Project limit reached",
        description: `${user.plan} plan allows up to ${maxProjects} projects. Upgrade to create more.`,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const newProject = await createProject({
        userId: user.id,
        name: `New Project ${projects.length + 1}`,
        prompt: '',
        html: '',
        css: '',
        js: '',
        isPublic: false
      });
      
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: "Project created!",
        description: "Your new project is ready to use.",
      });
      
      // Navigate to dashboard with new project
      window.location.href = `/dashboard?project=${newProject.id}`;
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
    window.location.href = `/dashboard?project=${projectId}`;
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: "Failed to delete the project",
        variant: "destructive"
      });
    }
  };

  const handleDownloadProject = (projectId: string) => {
    if (!user || user.plan === 'free') {
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
          <p className="text-muted-foreground">You need to be signed in to view your projects.</p>
        </div>
      </div>
    );
  }

  const maxProjects = CONFIG.plans[user.plan].maxProjects;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
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
            <Badge variant={user.projectCount >= maxProjects && maxProjects !== -1 ? "destructive" : "secondary"}>
              {user.projectCount}/{maxProjects === -1 ? '∞' : maxProjects} projects
            </Badge>
            <Button 
              onClick={handleCreateProject}
              disabled={isCreating || (user.projectCount >= maxProjects && maxProjects !== -1)}
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
        {loadingProjects ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{...project, promptsUsed: 0}}
                onOpen={handleOpenProject}
                onDelete={() => handleDeleteProject(project.id)}
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
                  disabled={user.projectCount >= maxProjects && maxProjects !== -1}
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
        {user.plan === 'free' && user.projectCount >= maxProjects && maxProjects !== -1 && (
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