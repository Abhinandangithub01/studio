
'use client';

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { CommentSection } from "@/components/comment-section";
import { getPost } from "@/lib/post-service";
import type { Post } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const fetchedPost = await getPost(params.id);
      setPost(fetchedPost);
      setLoading(false);
    };
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </AppLayout>
  }
  
  if (!post) {
    return <AppLayout><div className="text-center">Post not found.</div></AppLayout>;
  }
  
  const authorName = post.authorName || "Anonymous";
  const authorAvatar = post.authorAvatar;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <article className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">{post.title}</h1>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{authorName}</p>
                <p className="text-sm text-muted-foreground">Posted on {post.createdAt as string}</p>
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
             <p>{post.content}</p>
          </div>

          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" /> {post.reactions} Reactions
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" /> {post.commentsCount} Comments
              </Button>
            </div>
            <Button variant="ghost">
                <Bookmark className="mr-2 h-4 w-4" /> Bookmark
            </Button>
          </div>
        </article>

        <CommentSection />
      </div>
    </AppLayout>
  );
}
