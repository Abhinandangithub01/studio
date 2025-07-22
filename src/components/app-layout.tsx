/**
 * @fileoverview This component defines the main layout structure for the authenticated part of the application.
 * It includes the main header, a left sidebar for navigation, the main content area, and a right sidebar
 * for supplementary information like trending posts.
 */

import type { ReactNode } from 'react';
import { MainSidebar } from "@/components/main-sidebar";
import { AppHeader } from "@/components/app-header";
import { RightSidebar } from '@/components/right-sidebar';

type AppLayoutProps = {
  children: ReactNode; // The main content to be rendered within the layout.
};

export function AppLayout({ children }: AppLayoutProps) {
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
