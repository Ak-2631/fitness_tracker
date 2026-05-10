'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BarChart3, 
  Share2, 
  Box, 
  Settings,
  Activity
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!session || !mounted) return null;

  const navItems = [
    { label: 'OVERVIEW', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'ANALYTICS', href: '/monitoring', icon: <BarChart3 size={20} /> },
    { label: 'TRAINING', href: '/workouts', icon: <Activity size={20} /> },
    { label: 'DIET', href: '/diet', icon: <Box size={20} /> },
    { label: 'SETTINGS', href: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-black border-r border-white/5 z-50 flex flex-col p-8">
      {/* Sector Identity */}
      <div className="mb-16">
        <p className="text-[10px] font-black text-brand tracking-[0.2em] mb-1">COMMAND</p>
        <p className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase">SECTOR-01</p>
      </div>

      {/* Navigation Protocols */}
      <nav className="flex-1 space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 py-4 px-2 transition-all ${isActive ? 'bg-white/5 border-l-4 border-l-brand text-white' : 'text-white/40 hover:text-white'}`}
            >
              <div className={isActive ? 'text-brand' : ''}>
                {item.icon}
              </div>
              <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* System Exit */}
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-[10px] font-black text-white/20 hover:text-brand tracking-[0.3em] uppercase text-left pt-8 border-t border-white/5"
      >
        TERMINATE_LINK
      </button>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === 'loading' || !mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-black text-brand tracking-[0.5em] uppercase"
        >
          INITIATING_SECTOR_01_LINK...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-16">
        {children}
      </main>
    </div>
  );
}
