'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import Button from '@/components/ui/Button';

export function EndDayButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEndDay = async () => {
    if (!confirm('Initiate End of Day Evaluation? This actions locks today\'s metrics and generates AI Feedback.')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/daily-summary', {
        method: 'POST'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      alert('Day locked. AI Evaluation complete. Check History tab.');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleEndDay} 
      disabled={loading || disabled}
      variant={disabled ? "outline" : "danger"} 
      className="w-full mt-8"
      isLoading={loading}
    >
      <BrainCircuit size={20} />
      {disabled ? 'Analysis Completed' : 'Initiate End of Day Analysis'}
    </Button>
  );
}
