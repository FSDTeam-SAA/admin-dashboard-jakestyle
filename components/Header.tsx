'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';

export function Header({ onMenuClick, user }: any) {
  return (
    <header className="flex items-center justify-between lg:justify-end px-8 py-4 bg-[#D1F3FF]">
      <button onClick={onMenuClick} className="lg:hidden p-2">
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">{user?.name || "Mr. Raja"}</p>
          <p className="text-xs text-slate-500">{user?.email || "@admin"}</p>
        </div>
        <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
          <Image 
            src="/avatar.png" // The profile picture from the design
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}