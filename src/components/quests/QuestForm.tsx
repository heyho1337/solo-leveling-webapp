"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { Loader2 } from "lucide-react";
import { QuestFormProps } from "@/Interface/quests/QuestFormPropsInterface";

export function QuestForm({
  formData,
  setFormData,
  workoutOptions,
  editingQuest,
  isSubmitting,
  handleWorkoutSelection,
  handleSubmit,
}: QuestFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Quest Name
        </label>
        <Input
          required
          value={formData.questName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              questName: e.target.value,
            }))
          }
          placeholder={
            formData.selectedWorkoutId
              ? "Workout selected automatically"
              : "e.g. MORNING MOBILITY RITUAL"
          }
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Description
        </label>
        <Input
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder={
            formData.selectedWorkoutId
              ? "Workout selection will assign the quest automatically"
              : "Optional objective details"
          }
        />
      </div>

      <div className="space-y-3">
        <Autocomplete
          label="Assign Workout"
          placeholder="Search workout templates..."
          items={workoutOptions}
          value={formData.selectedWorkoutId}
          onChange={(value) => handleWorkoutSelection(String(value))}
          multiple={false}
          noResultsLabel="No workouts found"
        />

        {formData.selectedWorkoutId ? (
          <div className="flex items-center justify-between gap-4 rounded border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80">
            <span>
              Selected workout:{" "}
              {workoutOptions.find(
                (item) => item.id === formData.selectedWorkoutId
              )?.label ?? formData.selectedWorkoutId}
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedWorkoutId: "",
                }))
              }
              className="text-[10px] font-black text-[#38bdf8] hover:text-white"
            >
              CLEAR
            </button>
          </div>
        ) : null}

        <p className="text-[10px] text-white/50">
          Optional: select a workout template to assign a quest automatically.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Scheduled Date
        </label>
        <Input
          type="date"
          required
          value={formData.scheduledFor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              scheduledFor: e.target.value,
            }))
          }
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
        {isSubmitting ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : editingQuest ? (
          "UPDATE QUEST"
        ) : (
          "INITIALIZE QUEST"
        )}
      </Button>
    </form>
  );
}