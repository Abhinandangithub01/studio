
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { ShowcaseCard } from "@/components/showcase-card";
import { Button } from "@/components/ui/button";
import { getShowcases, upvoteShowcase } from "@/lib/showcase-service";
import type { Showcase } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

export default function ShowcasesPage() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShowcases = async () => {
      setLoading(true);
      const fetchedShowcases = await getShowcases();
      setShowcases(fetchedShowcases.sort((a, b) => b.upvotes - a.upvotes));
      setLoading(false);
    };
    fetchShowcases();
  }, []);

  const handleUpvote = async (id: string) => {
     if (!auth.currentUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to upvote.",
        variant: "destructive",
      });
      return;
    }
    
    // Optimistic UI update
    const originalShowcases = [...showcases];
    const updatedShowcases = showcases.map(s => 
        s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s
    );
    setShowcases(updatedShowcases.sort((a, b) => b.upvotes - a.upvotes));

    try {
        const newUpvotes = await upvoteShowcase(id);
        // If the server returns a different number, we can correct it
        setShowcases(prevShowcases => 
            prevShowcases.map(s => 
                s.id === id ? { ...s, upvotes: newUpvotes } : s
            ).sort((a, b) => b.upvotes - a.upvotes)
        );
    } catch (error) {
        // Revert on error
        setShowcases(originalShowcases);
        toast({
            title: "Upvote Failed",
            description: "Could not register your upvote. Please try again.",
            variant: "destructive"
        });
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
                <div key={i} className="space-y-4 rounded-lg border bg-card p-4">
                    <Skeleton className="h-[180px] w-full" />
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
