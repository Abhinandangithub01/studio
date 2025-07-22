
"use client";

/**
 * @fileoverview The main homepage of the application.
 * It displays a feed of discussion posts, with tabs to switch between a global "Discover" feed
 * and a personalized "Following" feed for logged-in users.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Component Imports
import { AppLayout } from '@/components/app-layout';
import { DiscussionCard } from '@/components/discussion-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Service & Hook Imports
import type { Post } from '@/lib/types';
import { getPosts, getPostsFromFollowing } from '@/lib/post-service';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'following'
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Fetches posts based on the currently active tab.
     */
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (activeTab === 'discover') {
          // Fetch all posts for the discover feed
          const fetchedPosts = await getPosts();
          setPosts(fetchedPosts);
        } else {
          // For the "following" tab, first check if a user is logged in
          const user = auth.currentUser;
          if (user) {
            const fetchedPosts = await getPostsFromFollowing(user.uid);
            setPosts(fetchedPosts);
          } else {
            // If not logged in, show a toast and clear posts
            toast({
              title: "Not Logged In",
              description: "Please log in to see posts from users you follow.",
              variant: "destructive",
            });
            setPosts([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast({
          title: "Error",
          description: "Could not fetch posts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeTab, toast]); // Rerun effect when activeTab or toast function changes


  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        {/* Quick link to create a new post */}
        <Card className="p-4">
           <Button asChild className="w-full justify-start">
              <Link href="/posts/new">
                <Edit className="mr-2 h-4 w-4" />
                What's on your mind?
              </Link>
            </Button>
        </Card>
        
        {/* Tabs to switch between feeds */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setActiveTab('discover')} className={`font-bold text-lg p-0 h-auto hover:bg-transparent ${activeTab === 'discover' ? '' : 'text-muted-foreground'}`}>Discover</Button>
          <Button variant="ghost" onClick={() => setActiveTab('following')} className={`text-lg p-0 h-auto hover:bg-transparent ${activeTab === 'following' ? 'font-bold' : 'text-muted-foreground'}`}>Following</Button>
        </div>

        {/* Display posts or loading skeletons */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            // Show skeleton loaders while posts are being fetched
            <>
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </>
          ) : (
            posts.length > 0 ? (
                posts.map((post) => (
                    <DiscussionCard key={post.id} post={post} />
                ))
            ) : (
                // Display a message if there are no posts to show
                <Card className="p-8 text-center text-muted-foreground">
                    {activeTab === 'following' ? "You're not following anyone yet, or they haven't posted." : "No posts found."}
                </Card>
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
}
