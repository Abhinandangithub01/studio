
"use client";

/**
 * @fileoverview This is the client-side component responsible for rendering the user profile page.
 * It handles fetching user-specific data (posts, showcases, badges), and manages the follow/unfollow logic.
 * It's separated from the parent page to encapsulate client-side state and effects.
 */

import Link from "next/link";
import { useEffect, useState } from "react";

// Component Imports
import { DiscussionCard } from "@/components/discussion-card";
import { ShowcaseCard } from "./showcase-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Service & Hook Imports
import type { User, Post, Badge, Showcase } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { followUser, unfollowUser, checkIfFollowing } from "@/lib/user-service";
import { getPostsByUserId } from "@/lib/post-service";
import { getShowcasesByUserId } from "@/lib/showcase-service";
import { getBadgesForUser } from "@/lib/badge-service";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, Youtube, Github, Link as LinkIcon, Edit, Award, Coffee, UserPlus, UserCheck } from "lucide-react";

type ProfileClientPageProps = {
    user: User; // The profile user's data.
    isCurrentUser: boolean; // True if the logged-in user is viewing their own profile.
};

export function ProfileClientPage({ user, isCurrentUser }: ProfileClientPageProps) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(auth.currentUser);

  // State for user-specific content
  const [posts, setPosts] = useState<Post[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Listen for changes in authentication state.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setLoggedInUser);
    return () => unsubscribe();
  }, []);
  
  // Check the following status if viewing another user's profile.
  useEffect(() => {
    if (loggedInUser && !isCurrentUser) {
      const checkFollowingStatus = async () => {
        setLoadingFollow(true);
        const following = await checkIfFollowing(loggedInUser.uid, user.uid);
        setIsFollowing(following);
        setLoadingFollow(false);
      };
      checkFollowingStatus();
    }
  }, [loggedInUser, isCurrentUser, user.uid]);

  // Fetch all data related to the user profile (posts, showcases, badges).
  useEffect(() => {
    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [userPosts, userShowcases, userBadges] = await Promise.all([
                getPostsByUserId(user.uid),
                getShowcasesByUserId(user.uid),
                getBadgesForUser(user.uid)
            ]);
            setPosts(userPosts);
            setShowcases(userShowcases);
            setBadges(userBadges);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
            toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" });
        } finally {
            setLoadingData(false);
        }
    }
    fetchData();
  }, [user.uid, toast]);

  /**
   * Handles the follow or unfollow action.
   */
  const handleFollow = async () => {
    if (!loggedInUser) {
        toast({ title: "Login Required", description: "You must be logged in to follow users.", variant: "destructive" });
        return;
    };
    setLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowUser(loggedInUser.uid, user.uid);
        toast({ title: "Unfollowed", description: `You are no longer following ${user.name}.`});
      } else {
        await followUser(loggedInUser.uid, user.uid);
        toast({ title: "Followed", description: `You are now following ${user.name}.`});
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive"});
    } finally {
      setLoadingFollow(false);
    }
  };

  /**
   * Returns the appropriate Lucide icon based on the social media network name.
   * @param name The name of the social network (e.g., 'linkedin').
   */
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'github': return <Github className="h-4 w-4" />;
      default: return <LinkIcon className="h-4 w-4" />;
    }
  }

  return (
      <div className="space-y-8">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-secondary mb-4">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-headline text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.currentRole} at {user.currentCompany}</p>
              <p className="text-muted-foreground text-sm">{user.education}</p>
              <div className="mt-4 flex gap-2">
                {isCurrentUser ? (
                  <>
                    <Button size="sm" asChild>
                      <Link href="/profile/edit">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                      </Link>
                    </Button>
                  </>
                ) : (
                    <Button size="sm" onClick={handleFollow} disabled={loadingFollow || !loggedInUser}>
                        {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {loadingFollow ? '...' : (isFollowing ? 'Following' : 'Follow')}
                    </Button>
                )}
              </div>
            </div>
            <div className="md:w-3/4 space-y-4">
              <div>
                <h2 className="font-headline text-lg font-semibold">About Me</h2>
                <p className="text-muted-foreground">{user.bio || "This user hasn't written a bio yet."}</p>
              </div>
              <div>
                <h3 className="font-headline text-md font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? user.skills.map(skill => (
                    <UiBadge key={skill} variant="outline">{skill}</UiBadge>
                  )) : <p className="text-sm text-muted-foreground">No skills listed yet.</p>}
                </div>
              </div>
              <div>
                <h3 className="font-headline text-md font-semibold mb-2">Socials</h3>
                 <div className="flex gap-4">
                  {user.socials && user.socials.length > 0 ? user.socials?.map(social => (
                    <Button key={social.name} variant="ghost" size="icon" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">{getIcon(social.name)}</a>
                    </Button>
                  )) : <p className="text-sm text-muted-foreground">No social links provided.</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Badges Card */}
        <Card>
             <CardContent className="p-6">
                <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-primary"/> Achievements & Badges</h2>
                {badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg" title={badge.description}>
                                <p className="text-4xl mb-2">🏆</p>
                                <p className="font-semibold">{badge.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center p-4">No badges earned yet.</p>
                )}
            </CardContent>
        </Card>

        {/* Tabbed content for Portfolio and Discussions */}
        <Tabs defaultValue="portfolio">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio ({showcases.length})</TabsTrigger>
            <TabsTrigger value="posts">Discussions ({posts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="mt-6">
            {showcases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {showcases.map(showcase => (
                        <ShowcaseCard key={showcase.id} showcase={showcase} onUpvote={() => {}} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    This user hasn't showcased any projects yet.
                </div>
            )}
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map(post => (
                        <DiscussionCard key={post.id} post={post} />
                    ))}
                </div>
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    This user hasn't started any discussions yet.
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}
