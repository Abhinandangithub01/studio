
"use client";

/**
 * @fileoverview Page for creating a new discussion post.
 * Provides a form for users to input a title, content, and tags.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// Component Imports
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Service & Hook Imports
import { createPost } from "@/lib/post-service";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handles adding a new tag when the user presses Enter in the tag input field.
   * @param e The keyboard event.
   */
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      // Add the new tag, ensuring no duplicates.
      setTags([...new Set([...tags, tagInput.trim()])]);
      setTagInput("");
    }
  };

  /**
   * Removes a tag from the list.
   * @param tagToRemove The tag to be removed.
   */
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /**
   * Handles the form submission to create the new post.
   * @param e The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({
            title: "Error",
            description: "You must be logged in to create a post.",
            variant: "destructive",
        });
        return;
    }

     if (!title || !content) {
        toast({
            title: "Error",
            description: "Please fill out title and content.",
            variant: "destructive",
        });
        return;
    }

    setLoading(true);

    try {
        await createPost({
            title,
            content,
            tags,
            userId: user.uid,
        });
        toast({
            title: "Success!",
            description: "Your post has been published.",
        });
        router.push("/"); // Redirect to homepage after creation
    } catch (error) {
        console.error("Error creating post:", error);
        toast({
            title: "Submission Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Create New Post</CardTitle>
            <CardDescription>Share your knowledge and projects with the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input id="title" placeholder="e.g., 10 Tips for Better Product Roadmaps" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>

                <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                    id="content"
                    placeholder="Write your post here..."
                    className="min-h-[300px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
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
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2">
                        <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </Button>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
