'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import GlassCard from './GlassCard';
import Badge from './Badge';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
}

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void;
}

export default function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/diet/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.foods);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-brand transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="w-full bg-white/[0.03] border border-white/10 rounded-none pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand focus:bg-white/[0.07] transition-all placeholder:text-white/20"
          placeholder="Search USDA Food Library..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 size={18} className="animate-spin text-brand/50" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 z-[200] max-h-[400px] overflow-y-auto rounded-none border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl p-2 scrollbar-premium"
          >
            {results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {results.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      onSelect(food);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="flex justify-between items-center p-3 rounded-none hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                  >
                    <div>
                      <div className="font-bold text-sm group-hover:text-brand transition-colors">{food.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{food.calories} KCAL</span>
                        <span className="text-[10px] text-white/10 opacity-50">•</span>
                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                          {food.protein}P • {food.carbs}C • {food.fats}F
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <Plus size={16} />
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="p-8 text-center bg-white/[0.01] rounded-none flex flex-col items-center gap-3">
                <Info size={24} className="text-white/10" />
                <p className="text-sm text-white/30 font-medium italic">No matches found in standard library.</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
