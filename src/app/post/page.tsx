import { AppLayout } from "@/components/app-layout";
import { CommentSection } from "@/components/comment-section";
import { mockPosts, mockUsers, type User } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Bookmark } from "lucide-react";

export default function PostPage() {
  const post = mockPosts[0];
  const author = mockUsers[post.userId] as User | undefined;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <article className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">{post.title}</h1>
            {author && (
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={author.avatarUrl} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{author.name}</p>
                  <p className="text-sm text-muted-foreground">Posted on {post.createdAt}</p>
                </div>
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{post.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            <blockquote className="border-l-4 border-secondary pl-4 italic text-muted-foreground">
              "The key to great design is capturing the spirit of the client and the essence of the space."
            </blockquote>
            <p>Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.</p>
          </div>

          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" /> {post.reactions} Reactions
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" /> {post.commentsCount} Comments
              </Button>
            </div>
            <Button variant="ghost">
                <Bookmark className="mr-2 h-4 w-4" /> Bookmark
            </Button>
          </div>
        </article>

        <CommentSection />
      </div>
    </AppLayout>
  );
}
