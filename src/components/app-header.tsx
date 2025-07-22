
"use client";

/**
 * @fileoverview Defines the main application header.
 * This component includes the site logo, navigation links (in a sheet for mobile),
 * a search bar, and a user menu with options for profile, settings, and logout.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Bell, CircleUser, Home, Menu, Presentation, Search, Trophy } from "lucide-react";

// UI Component Imports
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppHeader() {
    const router = useRouter();
    const { toast } = useToast();

    /**
     * Handles the user logout process.
     * Signs the user out from Firebase Auth and redirects to the login page.
     */
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            });
        } catch (error) {
            console.error("Logout failed:", error);
            toast({
                title: "Logout Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };
    
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                {/* Mobile navigation menu (Sheet) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                            <Link href="#" className="flex items-center gap-2 text-lg font-bold text-foreground">
                                Nebbulon
                            </Link>
                            <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Home className="h-4 w-4" /> Home
                            </Link>
                            <Link href="/showcases" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Presentation className="h-4 w-4" /> Product Showcases
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Trophy className="h-4 w-4" /> Product Challenges
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                {/* Desktop Logo */}
                <Link href="/" className="hidden md:flex items-center gap-2 font-bold text-xl text-foreground">
                    Nebbulon
                </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 flex justify-center">
                <form className="w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search..." className="w-full appearance-none bg-muted pl-8 shadow-none" />
                    </div>
                </form>
            </div>

            {/* Right-side actions: Create Post, Notifications, User Menu */}
            <div className="flex items-center gap-4">
                 <Link href="/posts/new">
                    <Button>
                        Create Post
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                {/* User Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/profile/edit">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
