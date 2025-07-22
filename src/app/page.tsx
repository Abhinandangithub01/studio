
"use client";

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { DiscussionCard } from '@/components/discussion-card';
import type { Post } from '@/lib/mock-data';
import { getPosts, getPostsFromFollowing } from '@/lib/post-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'following'
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      if (activeTab === 'discover') {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } else {
        const user = auth.currentUser;
        if (user) {
          const fetchedPosts = await getPostsFromFollowing(user.uid);
          setPosts(fetchedPosts);
        } else {
          toast({
            title: "Not Logged In",
            description: "Please log in to see posts from users you follow.",
            variant: "destructive",
          })
          setPosts([]);
        }
      }
      setLoading(false);
    }
    fetchPosts();
  }, [activeTab, toast]);


  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <Input placeholder="What's on your mind?" className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
        </Card>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setActiveTab('discover')} className={`font-bold text-lg p-0 h-auto hover:bg-transparent ${activeTab === 'discover' ? '' : 'text-muted-foreground'}`}>Discover</Button>
          <Button variant="ghost" onClick={() => setActiveTab('following')} className={`text-lg p-0 h-auto hover:bg-transparent ${activeTab === 'following' ? 'font-bold' : 'text-muted-foreground'}`}>Following</Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
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
