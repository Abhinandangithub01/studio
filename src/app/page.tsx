
"use client";

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { DiscussionCard } from '@/components/discussion-card';
import type { Post } from '@/lib/mock-data';
import { getPosts } from '@/lib/post-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);


  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <Input placeholder="What's on your mind?" className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
        </Card>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="font-bold text-lg p-0 h-auto hover:bg-transparent">Discover</Button>
          <Button variant="ghost" className="text-muted-foreground text-lg p-0 h-auto hover:bg-transparent">Following</Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <>
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </>
          ) : (
            posts.map((post) => (
              <DiscussionCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
