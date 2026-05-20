"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getResourceId, resourceIri } from "@/lib/resourceUtils";
import { QuestHeader } from "@/components/quests/QuestHeader";
import { QuestModal } from "@/components/quests/QuestModal";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestSections } from "@/components/quests/QuestSections";
import { Quest } from "@/Interface/quests/QuestInterface";
import { QuestContentProps } from "@/Interface/quests/QuestContentPropsInterface";
import { submitQuestForm, deleteQuest } from "@/app/actions/quests";

const defaultFormData = {
  questName: "",
  description: "",
  scheduledFor: new Date().toISOString().split("T")[0],
  selectedWorkoutId: "",
};

export default function QuestContent({
  activeQuests: initialActiveQuests = [],
  workouts = [],
  completedQuests: initialCompletedQuests = [],
  missedQuests: initialMissedQuests = [], 
}: QuestContentProps) {
  // Local state for optimistic CRUD updates - initialize from props once
  const [activeQuestsList, setActiveQuestsList] = useState<Quest[]>(initialActiveQuests);
  const [completedQuestsList, setCompletedQuestsList] = useState<Quest[]>(initialCompletedQuests);
  const [missedQuestsList, setMissedQuestsList] = useState<Quest[]>(initialMissedQuests);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [editingQuestId, setEditingQuestId] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [missedPage, setMissedPage] = useState(1);

  const [formData, setFormData] = useState(defaultFormData);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActivePage(1);
    setCompletedPage(1);
    setMissedPage(1);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  // Derive filtered quests from state, not props
  const filteredActiveQuests = useMemo(() => {
    if (!normalizedSearch) return activeQuestsList;

    return activeQuestsList.filter((item) =>
      [item.name, item.description, item.workout?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [activeQuestsList, normalizedSearch]);

  const filteredCompletedQuests = useMemo(() => {
    if (!normalizedSearch) return completedQuestsList;

    return completedQuestsList.filter((item) =>
      [item.name, item.description, item.workout?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [completedQuestsList, normalizedSearch]);

  const filteredMissedQuests = useMemo(() => {
    if (!normalizedSearch) return missedQuestsList;

    return missedQuestsList.filter((item) =>
      [item.name, item.description, item.workout?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [missedQuestsList, normalizedSearch]);

  const visibleActiveQuests = useMemo(
    () => filteredActiveQuests.slice(0, activePage * 6),
    [filteredActiveQuests, activePage]
  );

  const visibleCompletedQuests = useMemo(
    () => filteredCompletedQuests.slice(0, completedPage * 6),
    [filteredCompletedQuests, completedPage]
  );

  const visibleMissedQuests = useMemo(
    () => filteredMissedQuests.slice(0, missedPage * 6),
    [filteredMissedQuests, missedPage]
  );

  const activeSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: filteredActiveQuests.length > visibleActiveQuests.length,
    onLoadMore: () => setActivePage((prev) => prev + 1),
  });

  const completedSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: filteredCompletedQuests.length > visibleCompletedQuests.length,
    onLoadMore: () => setCompletedPage((prev) => prev + 1),
  });

  const missedSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: filteredMissedQuests.length > visibleMissedQuests.length,
    onLoadMore: () => setMissedPage((prev) => prev + 1),
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

  const getQuestId = (quest: Quest | string | null | undefined): string => {
    if (typeof quest === "string") return quest;
    if (!quest) return "";

    const directId = (quest as Quest).id;
    if (directId) return String(directId);

    const resourceId = getResourceId(quest);
    if (resourceId) return resourceId;

    const atId = (quest as any)["@id"];
    if (typeof atId === "string") return getResourceId(atId);

    return "";
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingQuest(null);
    setEditingQuestId("");
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
    setEditingQuestId(getQuestId(quest));
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
    const questId = getQuestId(quest);

    if (!questId) {
      console.error("Delete failed: no quest id", { quest });
      return;
    }

    // Keep original quest for rollback
    const originalList = activeQuestsList;

    // Optimistic removal
    setActiveQuestsList((prev) => prev.filter((q) => getQuestId(q) !== questId));

    try {
      const result = await deleteQuest(questId);
      if (!result.success) throw new Error(result.error);
    } catch (err) {
      console.error("Delete failed", err);
      // Rollback on error
      setActiveQuestsList(originalList);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingQuest) {
        const questId = getQuestId(editingQuestId || editingQuest);

        if (!questId) {
          console.error("Edit failed: quest has no id or @id", {
            editingQuest,
            editingQuestId,
            resourceId: getResourceId(editingQuest),
            directId: editingQuest.id,
          });
          throw new Error("Missing quest id");
        }

        const payload: Record<string, unknown> = {
          name: formData.questName,
          description: formData.description.trim() || "No description provided.",
          scheduledFor: formData.scheduledFor,
        };

        if (formData.selectedWorkoutId) {
          payload.workout = resourceIri("workouts", formData.selectedWorkoutId);
        }

        const result = await submitQuestForm(payload, questId);
        if (!result.success) throw new Error(result.error);

        const updatedQuest = result.data as Quest;

        setActiveQuestsList((prev) =>
          prev.map((q) => {
            const qId = getQuestId(q);
            return qId === questId ? updatedQuest : q;
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

        const result = await submitQuestForm(payload);
        if (!result.success) throw new Error(result.error);

        const newQuest = result.data as Quest;

        // Optimistic add
        setActiveQuestsList((prev) => [...prev, newQuest]);
      }

      setIsModalOpen(false);
      resetForm();
      setActivePage(1);
    } catch (err) {
      console.error("Save failed", err);
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
        title={editingQuest ? "Update quest" : "Create new quest"}
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
        activeQuests={filteredActiveQuests}
        completedQuests={filteredCompletedQuests}
        missedQuests={filteredMissedQuests}
        visibleActiveQuests={visibleActiveQuests}
        visibleCompletedQuests={visibleCompletedQuests}
        visibleMissedQuests={visibleMissedQuests}
        activeSentinelRef={activeSentinelRef as any}
        completedSentinelRef={completedSentinelRef as any}
        missedSentinelRef={missedSentinelRef as any}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleOpenCreate={handleOpenCreate}
      />
    </div>
  );
}