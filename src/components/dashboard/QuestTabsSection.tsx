"use client";

import { Button } from "@/components/ui/Button";

interface QuestTabsSectionProps {
  activeTab: string;
  onTabChange: (tab: "daily" | "weekly" | "bonus") => void;
}

export const QuestTabsSection = ({ activeTab, onTabChange }: QuestTabsSectionProps) => {
  return (
    <div className="tabs flex flex-wrap items-center gap-2 [grid-row:2]">
      {[
        { id: "daily", label: "Daily quests" },
        { id: "weekly", label: "Weekly quests" },
        { id: "bonus", label: "Bonus quests" },
      ].map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "primary" : "ghost"}
          className="h-9 text-[10px] tracking-widest"
          onClick={() => onTabChange(tab.id as "daily" | "weekly" | "bonus")}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
