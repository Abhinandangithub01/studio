
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { AppLayout } from "@/components/app-layout";
import { getUserProfile } from "@/lib/user-service";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileClientPage } from "@/components/profile-client-page";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setLoading(true);
        const profile = await getUserProfile(userAuth.uid);
        setUser(profile);
        setLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="space-y-8">
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
        </div>
      </AppLayout>
    )
  }

  return <AppLayout><ProfileClientPage user={user} isCurrentUser={true} /></AppLayout>;
}
