"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { Exercise } from '@/type/Exercise';

interface FormData {
  name: string;
  category: string;
  description: string;
  repCount: number;
  setCount: number;
  duration: number;
  distance: number;
  weightKg: number;
}

interface Option {
  id: string;
  label: string;
}

interface ExerciseFormProps {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  editingExercise: Exercise | null;
  isSubmitting: boolean;
  categoryOptions: Option[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ExerciseForm = ({
  formData,
  setFormData,
  editingExercise,
  isSubmitting,
  categoryOptions,
  handleSubmit,
}: ExerciseFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Name
        </label>
        <Input
          required
          value={formData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g. BARBELL BENCH PRESS"
        />
      </div>

      <div className="space-y-1">
        <Autocomplete
          label="Category"
          placeholder="Search categories..."
          items={categoryOptions}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: String(value) })}
          multiple={false}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Description
        </label>
        <Input
          value={formData.description}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description (optional)"
        />
      </div>

      {(formData.category === 'Weightlifting' || 
        formData.category === 'MartialArts' || 
        formData.category === 'Calisthenics' || 
        formData.category === 'Crossfit'
      ) && (

        <div className="grid grid-cols-[repeat(auto-fit,minmax(176px,1fr))] gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Sets
            </label>
            <NumberInput
              value={formData.setCount}
              onChange={(value) => setFormData({ ...formData, setCount: value })}
              min={0}
              step={0.5}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Reps
            </label>
            <NumberInput
              value={formData.repCount}
              onChange={(value) => setFormData({ ...formData, repCount: value })}
              min={1}
            />
          </div>
          {(formData.category === 'Weightlifting' || formData.category === 'Crossfit') && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
                Weight (kg)
              </label>
              <NumberInput
                value={formData.weightKg}
                onChange={(value) => setFormData({ ...formData, weightKg: value })}
                min={0}
                step={0.5}
              />
            </div>
          )}
        </div>
      )}

      {(formData.category === 'Running' || formData.category === 'Swimming' || formData.category === 'Riding' ) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Minutes
            </label>
            <NumberInput
              value={formData.duration}
              onChange={(value) => setFormData({ ...formData, duration: value })}
              min={1}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Distance (m)
            </label>
            <NumberInput
              value={formData.distance}
              onChange={(value) => setFormData({ ...formData, distance: value })}
              min={1}
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full h-12">
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : editingExercise ? 'Update Exercise' : 'Save Exercise'}
      </Button>
    </form>
  );
};
