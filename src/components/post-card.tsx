import Link from "next/link";
import type { Post, User } from "@/lib/mock-data";
import { mockUsers } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart } from "lucide-react";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = mockUsers[post.userId] as User | undefined;

  return (
    <Card className="bg-card border-border">
      {/* The image part from the original design is removed for now */}
      <CardHeader>
        <div className="flex items-center gap-4">
          {author && (
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            {author && <p className="font-semibold">{author.name}</p>}
            <p className="text-sm text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pl-16">
        <Link href="/post" className="block">
          <CardTitle className="font-headline text-2xl hover:text-primary">{post.title}</CardTitle>
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="ghost" className="p-1 px-2 hover:bg-accent/50">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pl-16">
        <div className="flex gap-4 text-muted-foreground">
            <Button variant="ghost" className="flex items-center gap-1.5 p-2 h-auto hover:bg-accent/50">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.reactions} reactions</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-1.5 p-2 h-auto hover:bg-accent/50">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.commentsCount} comments</span>
            </Button>
        </div>
        <Button asChild size="sm" variant="ghost" className="text-muted-foreground">
            <Link href="/post">Read</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
