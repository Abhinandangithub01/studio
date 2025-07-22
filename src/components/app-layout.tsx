import type { ReactNode } from 'react';
import { MainSidebar } from "@/components/main-sidebar";
import { AppHeader } from "@/components/app-header";
import { RightSidebar } from '@/components/right-sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] gap-6 p-4 md:p-6 items-start max-w-screen-2xl mx-auto">
        <MainSidebar />
        <main className="min-w-0">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
