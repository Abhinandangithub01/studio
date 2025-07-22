"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, X } from "lucide-react";
import { getTagSuggestions } from "@/app/actions/suggest-tags";
import { useToast } from "@/hooks/use-toast";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestTags = () => {
    if (content.trim().length < 50) {
      toast({
        title: "Content too short",
        description: "Please write at least 50 characters to get tag suggestions.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const suggested = await getTagSuggestions({ postContent: content });
      if (suggested) {
        setTags((prevTags) => [...new Set([...prevTags, ...suggested])]);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch tag suggestions. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...new Set([...tags, tagInput.trim()])]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Create New Post</CardTitle>
            <CardDescription>Share your knowledge and projects with the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" placeholder="e.g., 10 Tips for Better Product Roadmaps" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea
                id="content"
                placeholder="Write your post here..."
                className="min-h-[300px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
                <Button variant="outline" onClick={handleSuggestTags} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                  )}
                  Suggest Tags
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Post</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
