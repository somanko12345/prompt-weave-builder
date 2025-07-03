import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Download, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  promptsUsed: number;
}

interface ProjectCardProps {
  project: Project;
  onOpen: (projectId: string) => void;
  onRename: (projectId: string, newName: string) => void;
  onDelete: (projectId: string) => void;
  onDownload: (projectId: string) => void;
  canDownload: boolean;
}

export const ProjectCard = ({
  project,
  onOpen,
  onRename,
  onDelete,
  onDownload,
  canDownload
}: ProjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(project.name);

  const handleRename = () => {
    if (newName.trim() && newName !== project.name) {
      onRename(project.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(project.name);
      setIsEditing(false);
    }
  };

  return (
    <Card className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="aspect-video bg-gradient-surface rounded-t-lg relative overflow-hidden">
        {project.thumbnail ? (
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">No preview</p>
            </div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <Button 
            size="sm" 
            onClick={() => onOpen(project.id)}
            className="btn-primary"
          >
            Open
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDownload(project.id)}
            disabled={!canDownload}
            className="btn-ghost"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Project Name */}
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="h-8 text-sm font-medium"
              autoFocus
            />
          ) : (
            <h3 
              className="font-medium text-foreground truncate flex-1 cursor-text"
              onClick={() => setIsEditing(true)}
            >
              {project.name}
            </h3>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(project.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {project.updatedAt.toLocaleDateString()}</span>
          <Badge variant="outline" className="text-xs">
            {project.promptsUsed} prompts
          </Badge>
        </div>
      </div>
    </Card>
  );
};