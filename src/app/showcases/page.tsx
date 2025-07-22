
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { ShowcaseCard } from "@/components/showcase-card";
import { Button } from "@/components/ui/button";
import { getShowcases, upvoteShowcase } from "@/lib/showcase-service";
import type { Showcase } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowcasesPage() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcases = async () => {
      setLoading(true);
      const fetchedShowcases = await getShowcases();
      setShowcases(fetchedShowcases);
      setLoading(false);
    };
    fetchShowcases();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
        const newUpvotes = await upvoteShowcase(id);
        setShowcases(prevShowcases => 
            prevShowcases.map(s => 
                s.id === id ? { ...s, upvotes: newUpvotes } : s
            )
        );
    } catch (error) {
        console.error("Failed to upvote:", error);
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-bold">Product Showcases</h1>
        <Button asChild>
          <Link href="/showcases/new">Submit Product</Link>
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcases.map((showcase) => (
            <ShowcaseCard key={showcase.id} showcase={showcase} onUpvote={handleUpvote} />
            ))}
        </div>
      )}
    </AppLayout>
  );
}
