import { AppLayout } from '@/components/app-layout';
import { PostCard } from '@/components/post-card';
import { mockPosts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Home Feed</h1>
          <Button asChild>
            <Link href="/posts/new">New Post</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
