import type { ReactNode } from 'react';
import { MainSidebar } from "@/components/main-sidebar";
import { AppHeader } from "@/components/app-header";
import { RightSidebar } from '@/components/right-sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] gap-4 p-4 items-start">
        <MainSidebar />
        <main>
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
