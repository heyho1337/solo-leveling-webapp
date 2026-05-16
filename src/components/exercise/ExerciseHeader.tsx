"use client";

import type { ChangeEvent } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ExerciseHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export const ExerciseHeader = ({
  searchQuery,
  onSearchChange,
  onAddClick,
}: ExerciseHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Exercises</h2>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="SEARCH EXERCISES"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-10 bg-black/60 border-white/20 text-white tracking-widest text-[10px] h-12 uppercase font-bold focus:border-[#38bdf8]/60"
          />
        </div>
        <Button variant="primary" onClick={onAddClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Add New Exercise</span>
        </Button>
      </div>
    </div>
  );
};
