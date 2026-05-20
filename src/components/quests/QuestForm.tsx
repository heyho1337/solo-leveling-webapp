"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { Loader2 } from "lucide-react";
import { QuestFormProps } from "@/Interface/quests/QuestFormPropsInterface";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function QuestForm({
  formData,
  setFormData,
  workoutOptions,
  editingQuest,
  isSubmitting,
  handleWorkoutSelection,
  handleSubmit,
}: QuestFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

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
              : "e.g. MORNING RUN"
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
          placeholder="Select a workout"
          items={workoutOptions}
          value={formData.selectedWorkoutId}
          onChange={(value) => handleWorkoutSelection(String(value))}
          multiple={false}
          noResultsLabel="No workouts found"
        />

        {/*
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
        */}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          Scheduled Date
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-required="true"
              className="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-3 text-left text-sm text-white uppercase tracking-widest font-bold transition hover:border-[#38bdf8]"
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#38bdf8]" />
                {formData.scheduledFor
                  ? format(new Date(formData.scheduledFor), "PPP")
                  : "Choose scheduled date"}
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              selected={
                formData.scheduledFor
                  ? new Date(formData.scheduledFor)
                  : undefined
              }
              onSelect={(date: any) => {
                setFormData((prev) => ({
                  ...prev,
                  scheduledFor: date ? format(date, "yyyy-MM-dd") : "",
                }));
                if (date) setCalendarOpen(false);
              }}
              className="bg-transparent"
            />
          </PopoverContent>
        </Popover>
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