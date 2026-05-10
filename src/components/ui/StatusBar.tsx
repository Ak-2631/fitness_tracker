'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  showLabels?: boolean;
}

export function ProgressBar({ 
  value, 
  max, 
  label, 
  unit = '', 
  color = 'var(--primary-accent)',
  showLabels = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">{label}</span>
        {showLabels && (
          <span className="text-[10px] font-black text-white/60 tracking-wider">
            {value.toLocaleString()} / {max.toLocaleString()} {unit}
          </span>
        )}
      </div>
      <div className="progress-rail">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="progress-fill"
          style={{ background: color }}
        >
          {percentage > 10 && `${Math.round(percentage)}%`}
        </motion.div>
      </div>
    </div>
  );
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 160, strokeWidth = 12 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center p-4 border border-white/5 bg-black" style={{ width: size, height: size }}>
      <svg width={size - 40} height={size - 40} className="transform -rotate-90">
        <circle
          cx={(size - 40) / 2}
          cy={(size - 40) / 2}
          r={radius - 20}
          stroke="#111"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={(size - 40) / 2}
          cy={(size - 40) / 2}
          r={radius - 20}
          stroke="var(--primary-accent)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={radius * 2 * Math.PI} // Note: radius here is original, need to fix
          initial={{ strokeDashoffset: radius * 2 * Math.PI }}
          animate={{ strokeDashoffset: (radius - 20) * 2 * Math.PI - (score / 100) * (radius - 20) * 2 * Math.PI }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white leading-none">{score}</span>
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-2">NOMINAL</span>
      </div>
    </div>
  );
}
