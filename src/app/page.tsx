import { AppLayout } from '@/components/app-layout';
import { PostCard } from '@/components/post-card';
import { mockPosts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Home() {
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
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
