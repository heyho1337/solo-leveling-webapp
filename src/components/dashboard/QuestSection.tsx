"use client";

import { useState } from "react";
import { Quest } from "@/type/Quest";
import { QuestTabsSection } from "./QuestTabsSection";
import { QuestListSection } from "./QuestListSection";

interface QuestSectionProps {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  bonusQuests: Quest[];
}

export function QuestSection({
  dailyQuests,
  weeklyQuests,
  bonusQuests,
}: QuestSectionProps) {
  const [activeQuestTab, setActiveQuestTab] = useState<"daily" | "weekly" | "bonus">("daily");

  const filteredQuests =
    activeQuestTab === "daily"
      ? dailyQuests
      : activeQuestTab === "weekly"
        ? weeklyQuests
        : bonusQuests;

  return (
    <>
      <QuestTabsSection activeTab={activeQuestTab} onTabChange={setActiveQuestTab} />
      <QuestListSection
        quests={filteredQuests}
        activeQuestTab={activeQuestTab}
        bonusQuests={bonusQuests}
      />
    </>
  );
}
