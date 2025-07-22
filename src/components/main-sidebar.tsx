import Link from "next/link";
import {
  Home,
  BookOpen,
  Podcast,
  Video,
  Tags,
  GraduationCap,
  Trophy,
  Lightbulb,
  Heart,
  Star,
  User,
  Info,
  ShoppingBag,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Separator } from "./ui/separator";

export function MainSidebar() {
  return (
    <aside className="hidden md:block">
      <nav className="grid gap-1 text-sm font-medium">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <BookOpen className="h-4 w-4" />
          Reading List
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Podcast className="h-4 w-4" />
          Podcasts
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Video className="h-4 w-4" />
          Videos
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Tags className="h-4 w-4" />
          Tags
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <GraduationCap className="h-4 w-4" />
          DEV Education Tracks
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Trophy className="h-4 w-4" />
          DEV Challenges
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Lightbulb className="h-4 w-4" />
          DEV Help
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Heart className="h-4 w-4" />
          Advertise on DEV
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Star className="h-4 w-4" />
          DEV Showcase
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <Info className="h-4 w-4" />
          About
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <User className="h-4 w-4" />
          Contact
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent"
        >
          <ShoppingBag className="h-4 w-4" />
          Forem Shop
        </Link>
        <Separator className="my-2" />
        <p className="px-3 text-muted-foreground text-sm">Other</p>
         <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent">
            <ShieldCheck className="h-4 w-4" /> Code of Conduct
        </Link>
         <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent">
            <FileText className="h-4 w-4" /> Privacy Policy
        </Link>
         <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent">
            <FileText className="h-4 w-4" /> Terms of use
        </Link>
      </nav>
    </aside>
  );
}
