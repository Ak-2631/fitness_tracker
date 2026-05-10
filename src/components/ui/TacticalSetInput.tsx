'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Zap, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TacticalSetInputProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  isPR?: boolean;
  isCompleted?: boolean;
  step?: number;
  min?: number;
}

export default function TacticalSetInput({ 
  value, 
  onChange, 
  label, 
  isPR, 
  isCompleted, 
  step = 1,
  min = 0 
}: TacticalSetInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const numValue = parseFloat(value) || 0;

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(String(Math.max(min, numValue + step)));
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(String(Math.max(min, numValue - step)));
  };

  return (
    <div className={`relative group flex flex-col items-center gap-1 w-full`}>
      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{label}</span>
      
      <div className={`
        relative flex items-center w-full rounded-xl overflow-hidden border transition-all duration-500
        ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/[0.03] border-white/10'}
        ${isPR ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''}
        ${isFocused ? 'ring-1 ring-blue-500/50 border-blue-500/50' : ''}
      `}>
        <button 
          onClick={decrement}
          className="p-3 hover:bg-white/10 text-white/30 hover:text-white transition-all active:scale-90 shrink-0"
        >
          <Minus size={14} />
        </button>

        <div className="relative flex-1">
          <input
            type="number"
            className={`
              w-full bg-transparent text-center font-black text-lg py-3 focus:outline-none 
              ${isCompleted ? 'text-emerald-400' : 'text-white'}
              ${isPR ? 'text-amber-400' : ''}
            `}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
          />
          <AnimatePresence>
            {isPR && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Zap size={10} className="text-amber-400 fill-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={increment}
          className="p-3 hover:bg-white/10 text-white/30 hover:text-white transition-all active:scale-90 shrink-0"
        >
          <Plus size={14} />
        </button>
      </div>
      
      {/* Dynamic Underline or Pulse */}
      {isPR && (
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -bottom-1 left-4 right-4 h-[1px] bg-amber-500/30 blur-[2px]" 
        />
      )}
    </div>
  );
}
