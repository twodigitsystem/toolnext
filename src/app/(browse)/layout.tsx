import type { ReactNode } from "react";
import { BrowseSidebar } from "./_components/sidebar";
import { MobileSidebar } from "./_components/sidebar-mobile";

export default function BrowseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] mt-16">
      <BrowseSidebar />
      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border/60">
          <MobileSidebar />
        </div>
        <main className="min-w-0 flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
