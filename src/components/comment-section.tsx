import { mockComments, mockUsers, type User } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommentSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Comments ({mockComments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={mockUsers['user-1'].avatarUrl} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-2">
            <Textarea placeholder="Add your comment..." />
            <Button>Post Comment</Button>
          </div>
        </div>

        <div className="space-y-4">
          {mockComments.map((comment) => {
            const author = mockUsers[comment.userId] as User | undefined;
            return (
              <div key={comment.id} className="flex gap-4">
                {author && (
                  <Avatar>
                    <AvatarImage src={author.avatarUrl} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    {author && <p className="font-semibold">{author.name}</p>}
                    <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
