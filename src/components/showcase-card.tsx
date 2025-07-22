import Image from "next/image";
import type { Showcase } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type ShowcaseCardProps = {
  showcase: Showcase;
};

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
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
            <div className="flex-1">
                <CardTitle className="font-headline text-xl mb-2">{showcase.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">{showcase.description}</p>
            </div>
            <Button variant="outline" className="flex flex-col h-auto p-2">
                <ArrowUp className="h-4 w-4"/>
                <span className="text-xs">{showcase.upvotes}</span>
            </Button>
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
