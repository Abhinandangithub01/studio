
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTrendingPosts } from "@/lib/post-service";
import type { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function RightSidebar() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      setLoading(true);
      const posts = await getTrendingPosts();
      setTrendingPosts(posts);
      setLoading(false);
    }
    fetchTrendingPosts();
  }, []);

  return (
    <aside className="hidden lg:block space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
                trendingPosts.map((item, index) => (
                    <div key={item.id}>
                        <Link href={`/post/${item.id}`} className="hover:text-primary cursor-pointer">
                            {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.commentsCount} comments</p>
                        {index < trendingPosts.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))
            )}
        </CardContent>
      </Card>
    </aside>
  );
}
