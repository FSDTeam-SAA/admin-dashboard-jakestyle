'use client';

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner';
import { signOut, useSession } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = () => signOut({ callbackUrl: '/auth/login' });

  return (
    <div className="flex h-screen bg-[#D1F3FF]">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white lg:rounded-tl-[40px] shadow-2xl overflow-hidden mt-0 lg:my-0">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          user={session?.user} 
        />
        
        <main className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </main>
      </div>

    </div>
  );
}