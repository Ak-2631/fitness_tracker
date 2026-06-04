'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Activity, 
  Box, 
  Settings,
  Bell,
  Trophy,
  User,
  LogOut,
  HelpCircle,
  Crosshair,
  Radar
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
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
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Training', href: '/workouts', icon: <Activity size={20} /> },
    { label: 'Nutrition', href: '/diet', icon: <Box size={20} /> },
    { label: 'Intel', href: '/monitoring', icon: <Radar size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0B0F19] border-r border-[#1a1e2b] z-50 flex flex-col pt-6 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Sector Identity */}
      <div className="px-8 mb-8">
        <h1 className="text-3xl font-black text-[#9b5de5] tracking-tighter uppercase mb-8 drop-shadow-[0_0_10px_rgba(217,166,255,0.4)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          APEX TACTICAL
        </h1>
        <div className="mb-2">
          <p className="text-[14px] font-bold text-white tracking-widest uppercase">COMMAND</p>
          <p className="text-[14px] font-bold text-white tracking-widest uppercase mb-1">CENTER</p>
          <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">LEVEL {session?.user?.level || 42} OPERATOR</p>
        </div>
      </div>

      {/* Navigation Protocols */}
      <nav className="flex-1">
        <div className="px-4 space-y-2 mb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 py-3 px-4 transition-all rounded-sm ${isActive ? 'bg-[#111520] border-l-4 border-l-[#9b5de5] text-white shadow-[inset_0_0_20px_rgba(217,166,255,0.05)]' : 'text-[#a0a5b5] hover:text-white hover:bg-[#111520]/50'}`}
              >
                <div className={isActive ? 'text-[#9b5de5]' : ''}>
                  {item.icon}
                </div>
                <span className="text-[12px] font-bold tracking-[0.1em] uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
      </nav>

      {/* Footer Nav */}
      <div className="px-4 space-y-2">
        <Link href="/settings" className="flex items-center gap-4 py-3 px-4 text-[#a0a5b5] hover:text-white transition-all rounded-sm hover:bg-[#111520]/50">
          <Settings size={20} />
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase">Settings</span>
        </Link>
        <button className="w-full flex items-center gap-4 py-3 px-4 text-[#a0a5b5] hover:text-white transition-all rounded-sm hover:bg-[#111520]/50">
          <HelpCircle size={20} />
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase">Support</span>
        </button>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 py-3 px-4 text-red-400 hover:text-red-300 transition-all rounded-sm hover:bg-red-400/10 mt-4 border-t border-[#1a1e2b] pt-4"
        >
          <LogOut size={20} />
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!session || !mounted) return null;

  return (
    <header className="fixed top-0 left-[280px] right-0 h-20 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1a1e2b] z-40 flex items-center justify-between px-10">
      
      {/* Center Nav */}
      <nav className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
        <Link href="/dashboard" className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all ${pathname === '/dashboard' ? 'text-[#9b5de5]' : 'text-[#a0a5b5] hover:text-white'}`}>
          DASHBOARD
        </Link>
        <Link href="/operations" className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all ${pathname === '/operations' ? 'text-[#9b5de5]' : 'text-[#a0a5b5] hover:text-white'}`}>
          OPERATIONS
        </Link>
        <Link href="/workouts" className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all ${pathname === '/workouts' ? 'text-[#9b5de5]' : 'text-[#a0a5b5] hover:text-white'}`}>
          ARMORY
        </Link>
      </nav>

      <div className="flex-1" />

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="text-[#a0a5b5] hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#9b5de5] rounded-full animate-pulse"></span>
        </button>
        <button className="text-[#a0a5b5] hover:text-white transition-colors">
          <Trophy size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#111520] border border-[#1a1e2b] flex items-center justify-center overflow-hidden ml-2 cursor-pointer hover:border-[#9b5de5] transition-all">
          <User size={16} className="text-[#a0a5b5]" />
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (status === 'unauthenticated' && !isAuthPage) {
      router.push('/login');
    }
  }, [status, isAuthPage, router]);

  // On auth pages, just render children directly (no sidebar, no loading block)
  if (isAuthPage) {
    return <div className="min-h-screen bg-[#0B0F19]">{children}</div>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[12px] font-black text-[#9b5de5] tracking-[0.5em] uppercase"
        >
          CONNECTING TO SECURE SERVER...
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0e111a] flex">
      <Sidebar />
      <Topbar />
      <main className="flex-1 ml-[280px] mt-20 p-10 relative">
        {children}
        
        {/* Floating Add Task Button */}
        {pathname !== '/operations' && (
          <div className="fixed bottom-10 right-10 z-50">
            <Link 
              href="/operations"
              className="flex items-center justify-center w-16 h-16 bg-[#9b5de5] hover:bg-[#f3a6ff] rounded-full shadow-[0_0_20px_rgba(217,166,255,0.4)] hover:shadow-[0_0_30px_rgba(217,166,255,0.6)] text-[#0B0F19] transition-all transform hover:scale-110"
            >
              <span className="text-3xl font-light mb-1">+</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
