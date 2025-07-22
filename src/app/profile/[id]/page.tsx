
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/user-service";
import type { User } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/app-layout";
import { ProfileClientPage } from "@/components/profile-client-page";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
        setLoading(true);
        const profile = await getUserProfile(params.id);
        if (profile) {
            setUser(profile);
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.uid === params.id) {
                setIsCurrentUser(true);
            }
        } else {
            // Handle user not found, maybe redirect
        }
        setLoading(false);
    };

    if (params.id) {
        fetchUser();
    }
  }, [params.id]);


  if (loading || !user) {
    return <AppLayout>
        <Card>
            <CardContent className="p-6 flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4 flex flex-col items-center text-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4"/>
                    <Skeleton className="h-8 w-3/4 mb-2"/>
                    <Skeleton className="h-4 w-1/2 mb-2"/>
                    <Skeleton className="h-4 w-1/3"/>
                </div>
                <div className="md:w-3/4 space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    </AppLayout>
  }

  return (
    <AppLayout>
      <ProfileClientPage user={user} isCurrentUser={isCurrentUser} />
    </AppLayout>
  );
}

// Dummy components to avoid breaking the code while refactoring
const Card = ({children}: {children: React.ReactNode}) => <div className="bg-card rounded-lg border">{children}</div>
const CardContent = ({children, className}: {children: React.ReactNode, className?: string}) => <div className={className}>{children}</div>
