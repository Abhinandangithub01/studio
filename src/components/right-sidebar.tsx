import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const discussions = [
    { title: "Nebula Works – A Futuristic Admin Dashboard Built with Pure HTML/CSS/JS", comments: 23 },
    { title: "Meme Monday", comments: 73 },
    { title: "This news made me so darn happy.", comments: 6 },
    { title: "Implementing Light/Dark Theme - My Struggles and Tips", comments: 5 },
    { title: "Looking for dev to join in on projects", comments: 1 },
    { title: "Introducing Nexus: A Polished Dashboard Built with Vite, React, and Shadcn/ui", comments: 4 },
    { title: "Why I Chose Tailwind CSS as a Frontend Developer — And Never Looked Back", comments: 3 },
]

export function RightSidebar() {
  return (
    <aside className="hidden lg:block space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {discussions.map((item, index) => (
                <div key={index}>
                    <p className="hover:text-primary cursor-pointer">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.comments} comments</p>
                    {index < discussions.length - 1 && <Separator className="mt-4" />}
                </div>
            ))}
        </CardContent>
      </Card>
    </aside>
  );
}
