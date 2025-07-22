import Link from "next/link";
import type { Post, User } from "@/lib/mock-data";
import { mockUsers } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Eye } from "lucide-react";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = mockUsers[post.userId] as User | undefined;

  return (
    <Card>
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
      <CardContent className="space-y-4">
        <Link href="/post" className="block">
          <CardTitle className="font-headline text-2xl hover:text-secondary">{post.title}</CardTitle>
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground">{post.content.substring(0, 150)}...</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.reactions} reactions</span>
            </div>
            <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.commentsCount} comments</span>
            </div>
             <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{post.views} views</span>
            </div>
        </div>
        <Button asChild variant="outline">
            <Link href="/post">Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
