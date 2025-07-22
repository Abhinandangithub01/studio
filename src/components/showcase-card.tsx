
import Image from "next/image";
import type { Showcase } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { auth } from "@/lib/firebase";

type ShowcaseCardProps = {
  showcase: Showcase;
  onUpvote: (id: string) => void;
  optimisticUpvotes?: number;
};

export function ShowcaseCard({ showcase, onUpvote, optimisticUpvotes }: ShowcaseCardProps) {
  const upvoteCount = optimisticUpvotes !== undefined ? optimisticUpvotes : showcase.upvotes;
  const user = auth.currentUser;

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative p-0">
        <Image
          src={showcase.imageUrl}
          alt={showcase.title}
          width={600}
          height={400}
          className="rounded-t-lg object-cover aspect-[3/2]"
          data-ai-hint="product showcase"
        />
      </CardHeader>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
                <CardTitle className="font-headline text-xl mb-2">{showcase.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{showcase.description}</p>
            </div>
            {user && (
              <Button variant="outline" className="flex flex-col h-auto p-2" onClick={() => onUpvote(showcase.id)}>
                  <ArrowUp className="h-4 w-4"/>
                  <span className="text-xs font-bold">{upvoteCount}</span>
              </Button>
            )}
        </div>
        <CardFooter className="p-0 pt-4 flex-wrap gap-2">
          {showcase.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}
