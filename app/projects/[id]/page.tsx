'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Save, Wand2, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Project {
  id: number;
  title: string;
  script_content: string;
}

interface ImageResult {
  keyword: string;
  images: {
    url: string;
    thumbnail: string;
    source_url: string;
    description: string;
    photographer: string;
    license: string;
  }[];
}

export default function ProjectPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAugmenting, setIsAugmenting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      loadProject();
    }
  }, [user, projectId]);

  const loadProject = async () => {
    setIsLoading(true);
    const response = await apiClient.getProject(projectId);

    if (response.error) {
      toast.error('Failed to load project');
      router.push('/dashboard');
    } else {
      setProject(response.data.project);
      setTitle(response.data.project.title);
      setScriptContent(response.data.project.script_content || '');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const response = await apiClient.updateProject(projectId, title, scriptContent);

    if (response.error) {
      toast.error('Failed to save project');
    } else {
      toast.success('Project saved!');
      setProject(response.data.project);
    }
    setIsSaving(false);
  };

  const handleAugment = async () => {
    if (!scriptContent.trim()) {
      toast.error('Please write some content first');
      return;
    }

    setIsAugmenting(true);
    setKeywords([]);
    setImageResults([]);
    setSelectedKeyword(null);

    const response = await apiClient.augmentImages(scriptContent, projectId);

    if (response.error) {
      toast.error('Failed to augment images');
    } else {
      setKeywords(response.data.keywords);
      setImageResults(response.data.imageResults);
      toast.success(`Found ${response.data.keywords.length} keywords!`);
      if (response.data.keywords.length > 0) {
        setSelectedKeyword(response.data.keywords[0]);
      }
    }
    setIsAugmenting(false);
  };

  const handleKeywordClick = async (keyword: string) => {
    setSelectedKeyword(keyword);
  };

  const selectedImages = imageResults.find(r => r.keyword === selectedKeyword)?.images || [];

  if (authLoading || isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-2"
                placeholder="Project Title"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleAugment} disabled={isAugmenting}>
              {isAugmenting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Augmenting...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Augment
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Script Editor */}
        <div className="flex-1 p-6 overflow-auto">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <Textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                placeholder="Write your script here... The AI will extract keywords and find relevant images for you."
                className="h-full min-h-[600px] resize-none text-base leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        {/* Image Sidebar */}
        <div className="w-96 border-l bg-secondary/10 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Image Suggestions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {keywords.length > 0 
                ? `${keywords.length} keywords extracted`
                : 'Click "Augment" to find images'}
            </p>
          </div>

          {keywords.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant={selectedKeyword === keyword ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleKeywordClick(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="flex-1">
            {selectedKeyword && selectedImages.length > 0 ? (
              <div className="p-4 space-y-4">
                {selectedImages.map((image, idx) => (
                  <Card key={idx} className="overflow-hidden group">
                    <div className="relative aspect-video">
                      <img
                        src={image.thumbnail}
                        alt={image.description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(image.source_url, '_blank')}
                        >
                          View Source
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {image.photographer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : keywords.length > 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a keyword to view images
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div className="space-y-2">
                  <Wand2 className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Write your script and click "Augment" to get AI-powered image suggestions
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
