
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserProfile } from "@/lib/user-service";
import type { User } from "@/lib/types";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(300, "Bio cannot be longer than 300 characters.").optional(),
  currentRole: z.string().optional(),
  currentCompany: z.string().optional(),
  education: z.string().optional(),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  linkedinUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  youtubeUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUser(profile);
        setSkills(profile?.skills || []);
      }
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            fetchUser();
        } else {
            router.push('/login');
        }
    });

    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      currentRole: "",
      currentCompany: "",
      education: "",
      avatarUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      githubUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        bio: user.bio,
        currentRole: user.currentRole,
        currentCompany: user.currentCompany,
        education: user.education,
        avatarUrl: user.avatarUrl,
        linkedinUrl: user.socials?.find(s => s.name.toLowerCase() === 'linkedin')?.url || '',
        youtubeUrl: user.socials?.find(s => s.name.toLowerCase() === 'youtube')?.url || '',
        githubUrl: user.socials?.find(s => s.name.toLowerCase() === 'github')?.url || '',
      });
    }
  }, [user, form]);
  
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      setSkills([...new Set([...skills, skillInput.trim()])]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };


  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!auth.currentUser) return;
    setLoading(true);

    const socials = [
        { name: 'LinkedIn', url: values.linkedinUrl || '' },
        { name: 'YouTube', url: values.youtubeUrl || '' },
        { name: 'GitHub', url: values.githubUrl || '' },
    ].filter(s => s.url);

    try {
      await updateUserProfile(auth.currentUser.uid, { ...values, socials, skills });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      router.push(`/profile/${auth.currentUser.uid}`);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-20 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
  }


  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Edit Profile</CardTitle>
            <CardDescription>Update your public profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                       <FormDescription>
                        A direct link to your profile picture.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us a little about yourself" {...field} className="min-h-[120px]"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="currentRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Role</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Product Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Company</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Nebbulon, Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                 <div className="space-y-2">
                    <FormLabel>Skills</FormLabel>
                    <div className="flex items-center gap-2">
                        <Input
                        id="skills"
                        placeholder="Type a skill and press Enter"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillInputKeyDown}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="ml-2">
                            <X className="h-3 w-3" />
                            </button>
                        </Badge>
                        ))}
                    </div>
                </div>

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardTitle className="font-headline text-2xl pt-4 border-t">Social Links</CardTitle>
                
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Channel URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/c/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
