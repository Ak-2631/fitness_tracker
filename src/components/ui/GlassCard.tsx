'use client';

import { motion } from 'framer-motion';
import { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverLift?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function GlassCard({ 
  children, 
  hoverLift = true, 
  padding = 'md',
  className = '', 
  ...props 
}: GlassCardProps) {
  
  const getPaddingStyles = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-3';
      case 'md': return 'p-5';
      case 'lg': return 'p-8';
      default: return 'p-5';
    }
  };

  return (
    <motion.div
      whileHover={hoverLift ? { borderColor: '#444' } : {}}
      className={`card border border-white/5 bg-black ${getPaddingStyles()} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
