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
  durationMinutes: number;
  distanceMeters: number;
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
          Movement Name
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
          placeholder="Movement details (optional)"
        />
      </div>

      {(formData.category === 'Strength' || formData.category === 'Full Body') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Sets
            </label>
            <NumberInput
              value={formData.setCount}
              onChange={(value) => setFormData({ ...formData, setCount: value })}
              min={1}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Reps
            </label>
            <NumberInput
              value={formData.repCount}
              onChange={(value) => setFormData({ ...formData, repCount: value })}
              min={0}
              step={0.5}
            />
          </div>
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
        </div>
      )}

      {formData.category === 'Cardio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Minutes
            </label>
            <NumberInput
              value={formData.durationMinutes}
              onChange={(value) => setFormData({ ...formData, durationMinutes: value })}
              min={1}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
              Distance (m)
            </label>
            <NumberInput
              value={formData.distanceMeters}
              onChange={(value) => setFormData({ ...formData, distanceMeters: value })}
              min={1}
            />
          </div>
        </div>
      )}

      {(formData.category === 'Combat' || formData.category === 'Flexibility' || formData.category === 'Bodyweight') && (
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
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full h-12">
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : editingExercise ? 'CONFIRM UPDATE' : 'REGISTER TO ARCHIVE'}
      </Button>
    </form>
  );
};
