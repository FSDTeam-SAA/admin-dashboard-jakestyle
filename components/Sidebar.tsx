'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
   Briefcase, Settings, LogOut, 
  LayoutDashboard,
  Users,
  Grid3x3,
  FileText,
  Star
} from 'lucide-react';

const SIDEBAR_ITEMS = [

  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },

  { name: 'User Management', href: '/admin/users', icon: Users },

  { name: 'All Jobs', href: '/admin/jobs', icon: Briefcase },

  { name: 'Categories', href: '/admin/categories', icon: Grid3x3 },

  { name: 'Applications', href: '/admin/applications', icon: FileText },

  { name: 'Reviews', href: '/admin/reviews', icon: Star },

  { name: 'Settings', href: '/admin/settings', icon: Settings },

];

export function Sidebar({ isOpen, onClose, onLogout }: any) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);



  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#D1F3FF] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex justify-center pt-10 pb-12">
            <Image src="/logo.png" alt="Tradies Logo" width={160} height={50} priority />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all ${
                    isActive ? 'bg-black text-white shadow-md' : 'text-slate-700 hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Trigger */}
          <div className="p-6">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-md w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to log out of your account?</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}