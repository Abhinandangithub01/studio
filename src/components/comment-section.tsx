
'use client';

/**
 * @fileoverview This component manages the display and creation of comments for a specific post.
 * It fetches existing comments, shows a form for adding new comments (for logged-in users),
 * and handles the submission of new comments.
 */

import { useEffect, useState } from "react";

// Service and Type Imports
import type { Comment } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { createComment, getComments } from "@/lib/comment-service";

// UI and Hook Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

type CommentSectionProps = {
  postId: string; // The ID of the post whose comments are being displayed.
};

export function CommentSection({ postId }: CommentSectionProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = auth.currentUser;

  // Fetch comments when the component mounts or the postId changes.
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        toast({ title: "Error", description: "Could not load comments.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId, toast]);

  /**
   * Handles posting a new comment.
   */
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
      // Call the service to create the comment in Firestore.
      await createComment({
        postId: postId,
        userId: currentUser.uid,
        content: newComment,
      });
      setNewComment(""); // Clear the textarea
      
      // Refresh the comments list to show the new comment instantly.
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
        {/* Comment submission form, shown only to logged-in users */}
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

        {/* List of comments or loading skeletons */}
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
