'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('urgut_admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('urgut_admin_token');
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Boshqaruv Paneli', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Yangiliklar Boshqaruvi', href: '/admin/news', icon: Newspaper },
    { label: 'Kategoriyalar', href: '/admin/categories', icon: FolderTree },
    { label: 'Sayt Sozlamalari', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-red-700 text-white flex items-center justify-center font-bold text-xs">
            UT
          </div>
          <span className="font-extrabold text-sm tracking-wider">ADMIN PANEL</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-slate-300">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 border-r border-slate-800`}
      >
        <div className="space-y-6">
          <div className="hidden md:flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-red-700 text-white flex items-center justify-center font-black text-lg">
              UT
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm leading-none">URGUT TODAY</h2>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Super Admin</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-red-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-red-500" />
            Saytni Ko'rish
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:bg-red-950/40 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
