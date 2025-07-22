import Link from "next/link";
import {
  Home,
  Presentation,
  Trophy,
} from "lucide-react";

export function MainSidebar() {
  return (
    <aside className="hidden md:block">
      <nav className="grid gap-1 text-sm font-medium">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Presentation className="h-4 w-4" />
          Product Showcases
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Trophy className="h-4 w-4" />
          Product Challenges
        </Link>
      </nav>
    </aside>
  );
}
