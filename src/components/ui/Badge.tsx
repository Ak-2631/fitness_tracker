'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'secondary', 
  size = 'sm',
  className = ''
}: BadgeProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'secondary': return 'bg-white/5 text-white/60 border-white/10';
      case 'success': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'danger': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'ghost': return 'bg-transparent text-white/40 border-transparent';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'xs': return 'px-1.5 py-0.5 text-[8px]';
      case 'sm': return 'px-2 py-0.5 text-[10px]';
      case 'md': return 'px-3 py-1 text-xs';
      default: return 'px-2 py-0.5 text-[10px]';
    }
  };

  return (
    <span className={`inline-flex items-center font-black uppercase tracking-widest border rounded-md ${getVariantStyles()} ${getSizeStyles()} ${className}`}>
      {children}
    </span>
  );
}
