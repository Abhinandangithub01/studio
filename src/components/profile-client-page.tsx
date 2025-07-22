
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { DiscussionCard } from "@/components/discussion-card";
import { mockProjects, mockPosts, mockBadges, type User } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Twitter, Link as LinkIcon, Edit, Award, Coffee, Youtube, Github, UserPlus, UserCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { followUser, unfollowUser, checkIfFollowing } from "@/lib/user-service";
import { useToast } from "@/hooks/use-toast";

type ProfileClientPageProps = {
    user: User;
    isCurrentUser: boolean;
};

export function ProfileClientPage({ user, isCurrentUser }: ProfileClientPageProps) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setLoggedInUser);
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (loggedInUser && !isCurrentUser) {
      const checkFollowingStatus = async () => {
        setLoadingFollow(true);
        const following = await checkIfFollowing(loggedInUser.uid, user.id);
        setIsFollowing(following);
        setLoadingFollow(false);
      };
      checkFollowingStatus();
    }
  }, [loggedInUser, isCurrentUser, user.id]);

  const handleFollow = async () => {
    if (!loggedInUser) return;
    setLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowUser(loggedInUser.uid, user.id);
        toast({ title: "Unfollowed", description: `You are no longer following ${user.name}.`});
      } else {
        await followUser(loggedInUser.uid, user.id);
        toast({ title: "Followed", description: `You are now following ${user.name}.`});
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive"});
    } finally {
      setLoadingFollow(false);
    }
  };

  const featuredProjects = mockProjects.filter(p => p.featured);
  const otherProjects = mockProjects.filter(p => !p.featured);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'github': return <Github className="h-4 w-4" />;
      default: return <LinkIcon className="h-4 w-4" />;
    }
  }

  return (
      <div className="space-y-8">
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
                    <Button size="sm" variant="secondary">
                        <Coffee className="mr-2 h-4 w-4" /> Sponsor
                    </Button>
                  </>
                ) : (
                    <Button size="sm" onClick={handleFollow} disabled={loadingFollow}>
                        {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {loadingFollow ? '...' : (isFollowing ? 'Following' : 'Follow')}
                    </Button>
                )}
              </div>
            </div>
            <div className="md:w-3/4 space-y-4">
              <div>
                <h2 className="font-headline text-lg font-semibold">About Me</h2>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
              <div>
                <h3 className="font-headline text-md font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-headline text-md font-semibold mb-2">Socials</h3>
                <div className="flex gap-4">
                  {user.socials?.map(social => (
                    <Button key={social.name} variant="ghost" size="icon" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">{getIcon(social.name)}</a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Award className="text-secondary"/> Achievements & Badges</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockBadges.map(badge => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                            <p className="text-4xl mb-2">🏆</p>
                            <p className="font-semibold">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Tabs defaultValue="portfolio">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="posts">Discussions</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="mt-6">
            <div className="space-y-8">
              <div>
                  <h2 className="font-headline text-2xl font-bold mb-4">Featured Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredProjects.map(project => (
                          <ProjectCard key={project.id} project={project} />
                      ))}
                  </div>
              </div>
              <div>
                  <h2 className="font-headline text-2xl font-bold mb-4">Other Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherProjects.map(project => (
                          <ProjectCard key={project.id} project={project} />
                      ))}
                  </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
                {mockPosts.map(post => (
                    <DiscussionCard key={post.id} post={post} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
