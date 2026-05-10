'use client';

import { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  sublabel?: string;
}

export default function InputField({ 
  label, 
  error, 
  sublabel,
  className = '', 
  ...props 
}: InputFieldProps) {
  return (
    <div className={`form-group flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-baseline">
        <label className="text-[10px] uppercase font-black tracking-widest text-white/50">{label}</label>
        {sublabel && <span className="text-[10px] text-white/30 uppercase">{sublabel}</span>}
      </div>
      <input
        className={`input-field w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:bg-white/10 transition-all placeholder:text-white/20 ${error ? 'border-red-500/50 ring-red-500/20' : ''}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-400 mt-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}
