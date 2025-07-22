import Image from "next/image";
import type { Project } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="relative p-0">
        <Image
          src={project.imageUrl}
          alt={project.title}
          width={600}
          height={400}
          className="rounded-t-lg object-cover aspect-[3/2]"
          data-ai-hint="portfolio project"
        />
        {project.featured && (
            <Badge className="absolute top-2 right-2" variant="secondary">
                <Star className="w-3 h-3 mr-1"/>
                Featured
            </Badge>
        )}
      </CardHeader>
      <div className="flex flex-col flex-1 p-6">
        <CardTitle className="font-headline text-xl mb-2">{project.title}</CardTitle>
        <CardContent className="flex-1 p-0">
          <p className="text-muted-foreground">{project.description}</p>
        </CardContent>
        <CardFooter className="p-0 pt-4 flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}
