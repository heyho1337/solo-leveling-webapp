'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { Loader2 } from 'lucide-react';
import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { getResourceId } from '@/lib/resourceUtils';
import { WorkoutFormProps } from '@/Interface/workout/WorkoutFormPropsInterface';

export function WorkoutForm({
  formData,
  setFormData,
  exerciseOptions,
  workoutCategoryOptions,
  exercises,
  isSubmitting,
  editingWorkout,
  handleSubmit,
}: WorkoutFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Workout Name
        </label>
        <Input
          required
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g. UPPER BODY STRENGTH"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <Autocomplete
            label="Category"
            placeholder="Search categories..."
            items={workoutCategoryOptions}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: String(value) })}
            multiple={false}
            required
          />
        </div>
      </div>
      
      {/*
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
            Calories
          </label>
          <NumberInput
            value={formData.calories}
            onChange={(value) => setFormData({ ...formData, calories: value })}
            min={0}
            step={10}
            max={5000}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
            Duration (Min)
          </label>
          <NumberInput
            value={formData.duration}
            onChange={(value) => setFormData({ ...formData, duration: value })}
            min={5}
            step={5}
            max={999}
          />
        </div>
      </div>
      */}

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Description
        </label>
        <textarea
          className="w-full bg-black/40 border border-white/10 text-white p-3 text-[10px] font-bold uppercase outline-none focus:border-[#38bdf8] min-h-[100px]"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Training details..."
        />
      </div>
      
      <div className="space-y-3">
        <Autocomplete
          label="Exercises"
          placeholder="Search and add exercises..."
          items={exerciseOptions}
          value={formData.selectedExerciseIds}
          onChange={(value) => setFormData({ ...formData, selectedExerciseIds: value as string[] })}
          multiple
          noResultsLabel="No exercises available"
        />
      
        {/*
        <div className="flex flex-wrap gap-2">
          {formData.selectedExerciseIds.length === 0 ? (
            <p className="text-[10px] text-white/40">No exercises selected yet.</p>
          ) : (
            formData.selectedExerciseIds.map((exerciseId: string) => {
              const exercise = exerciseOptions.find((opt: { id: string }) => opt.id === exerciseId);

              return exercise ? (
                <span
                  key={exerciseId}
                  className="inline-flex items-center gap-1 bg-[#38bdf8]/20 text-[#38bdf8] px-2 py-1 text-[8px] font-black uppercase border border-[#38bdf8]/30"
                >
                  {exercise.label}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        selectedExerciseIds: formData.selectedExerciseIds.filter(
                          (id: string) => id !== exerciseId,
                        ),
                      })
                    }
                    className="hover:text-red-400 ml-1"
                    aria-label={`Remove ${exercise.label}`}
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })
          )}
        </div>
        */}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-12">
        {isSubmitting ? (
          <Loader2 className="animate-spin h-5 w-5 mx-auto" />
        ) : editingWorkout ? (
          'Update workout'
        ) : (
          'New workout'
        )}
      </Button>
    </form>
  );
}
