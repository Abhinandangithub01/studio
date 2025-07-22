
'use client';

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { createComment, getComments } from "@/lib/comment-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

type CommentSectionProps = {
  postId: string;
};

export function CommentSection({ postId }: CommentSectionProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to post a comment.",
        variant: "destructive",
      });
      return;
    }
    if (newComment.trim() === "") return;

    setSubmitting(true);
    try {
      await createComment({
        postId: postId,
        userId: currentUser.uid,
        content: newComment,
      });
      setNewComment("");
      // Refresh comments
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
       toast({
        title: "Success!",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentUser && (
            <div className="flex gap-4">
            <Avatar>
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback>{currentUser.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
                <Textarea 
                  placeholder="Add your comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handlePostComment} disabled={submitting}>
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
            </div>
            </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <>
              <div className="flex gap-4"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-64" /></div></div>
              <div className="flex gap-4"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-72" /></div></div>
            </>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                    <AvatarFallback>{comment.authorName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">{comment.createdAt as string}</p>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
