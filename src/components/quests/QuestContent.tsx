"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import api from "@/services/api";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getResourceId, resourceIri } from "@/lib/resourceUtils";
import { QuestHeader } from "@/components/quests/QuestHeader";
import { QuestModal } from "@/components/quests/QuestModal";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestSections } from "@/components/quests/QuestSections";
import { Quest } from "@/Interface/quests/QuestInterface";
import { QuestContentProps } from "@/Interface/quests/QuestContentPropsInterface";

const defaultFormData = {
  questName: "",
  description: "",
  scheduledFor: new Date().toISOString().split("T")[0],
  selectedWorkoutId: "",
};

export default function QuestContent({
  quests: initialQuests,
  workouts = [],
}: QuestContentProps) {
  // Local state for optimistic CRUD updates
  const [questsList, setQuestsList] = useState<Quest[]>(initialQuests);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  const [formData, setFormData] = useState(defaultFormData);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActivePage(1);
    setCompletedPage(1);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const activeQuests = useMemo(() => {
    const source = questsList.filter(
      (q) =>
        String(q.status ?? "").toLowerCase() === "active" &&
        !q.isHidden
    );

    if (!normalizedSearch) return source;

    return source.filter((item) =>
      [item.name, item.description, item.workout?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [questsList, normalizedSearch]);

  const completedQuests = useMemo(() => {
    const source = questsList.filter(
      (q) => String(q.status ?? "").toLowerCase() === "completed"
    );

    if (!normalizedSearch) return source;

    return source.filter((item) =>
      [item.name, item.description, item.workout?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [questsList, normalizedSearch]);

  const visibleActiveQuests = useMemo(
    () => activeQuests.slice(0, activePage * 6),
    [activeQuests, activePage]
  );

  const visibleCompletedQuests = useMemo(
    () => completedQuests.slice(0, completedPage * 6),
    [completedQuests, completedPage]
  );

  const activeSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: activeQuests.length > visibleActiveQuests.length,
    onLoadMore: () => setActivePage((prev) => prev + 1),
  });

  const completedSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: completedQuests.length > visibleCompletedQuests.length,
    onLoadMore: () => setCompletedPage((prev) => prev + 1),
  });

  const workoutOptions = useMemo(
    () =>
      workouts
        .map((workout) => ({
          id: String(getResourceId(workout) ?? workout.id ?? ""),
          label: workout.name,
          description: workout.description ?? "",
        }))
        .filter((item) => item.id.length > 0),
    [workouts]
  );

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingQuest(null);
  };

  const handleWorkoutSelection = (workoutId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedWorkoutId: workoutId,
    }));
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setFormData({
      questName: quest.name ?? "",
      description: quest.description ?? "",
      scheduledFor: quest.scheduledFor
        ? quest.scheduledFor.split("T")[0]
        : new Date().toISOString().split("T")[0],
      selectedWorkoutId: quest.workout
        ? String(getResourceId(quest.workout) ?? quest.workout.id ?? "")
        : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (quest: Quest | string) => {
    const questId = typeof quest === "string" ? quest : getResourceId(quest);

    if (!questId) return;

    // Optimistic removal
    setQuestsList((prev) => prev.filter((q) => getResourceId(q) !== questId));

    try {
      await api.delete(`/users/me/quests/${questId}`);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingQuest) {
        const questId = getResourceId(editingQuest) || editingQuest.id;

        if (!questId) throw new Error("Missing quest id");

        const payload: Record<string, unknown> = {
          name: formData.questName,
          description: formData.description.trim() || "No description provided.",
          scheduledFor: formData.scheduledFor,
        };

        if (formData.selectedWorkoutId) {
          payload.workout = resourceIri("workouts", formData.selectedWorkoutId);
        }

        await api.patch(`/users/me/quests/${questId}`, payload, {
          headers: { "Content-Type": "application/merge-patch+json" },
        });

        // Optimistic update
        setQuestsList((prev) =>
          prev.map((q) => {
            const qId = getResourceId(q) || q.id;
            if (qId === questId) {
              return {
                ...q,
                name: formData.questName,
                description: formData.description.trim() || "No description provided.",
                scheduledFor: formData.scheduledFor,
              };
            }
            return q;
          })
        );
      } else {
        const payload: Record<string, unknown> = {
          name: formData.questName,
          description: formData.description.trim() || "No description provided.",
          scheduledFor: formData.scheduledFor,
          status: "active",
        };

        if (formData.selectedWorkoutId) {
          payload.workout = resourceIri("workouts", formData.selectedWorkoutId);
        }

        const response = await api.post("/users/me/quests", payload);
        const newQuest = response.data as Quest;

        // Optimistic add
        setQuestsList((prev) => [...prev, newQuest]);
      }

      setIsModalOpen(false);
      resetForm();
      setActivePage(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Save failed", err.response?.data ?? err.message);
      } else {
        console.error("Save failed", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <QuestHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleOpenCreate}
      />

      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuest ? "Modify Requirement" : "Assign New Protocol"}
      >
        <QuestForm
          formData={formData}
          setFormData={setFormData}
          workoutOptions={workoutOptions}
          editingQuest={editingQuest}
          isSubmitting={isSubmitting}
          handleWorkoutSelection={handleWorkoutSelection}
          handleSubmit={handleSubmit}
        />
      </QuestModal>

      <QuestSections
        isLoading={isLoading}
        activeQuests={activeQuests}
        completedQuests={completedQuests}
        visibleActiveQuests={visibleActiveQuests}
        visibleCompletedQuests={visibleCompletedQuests}
        activeSentinelRef={activeSentinelRef}
        completedSentinelRef={completedSentinelRef}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleOpenCreate={handleOpenCreate}
      />
    </div>
  );
}