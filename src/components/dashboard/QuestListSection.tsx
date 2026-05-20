"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getResourceId } from "@/lib/resourceUtils";
import { QuestCard } from "@/components/quests/QuestCard";
import { Quest } from "@/Interface/quests/QuestInterface";

interface QuestListSectionProps {
  quests: Quest[];
  activeQuestTab: "daily" | "weekly" | "bonus";
  bonusQuests: Quest[];
}

const QUESTS_PER_PAGE = 3;

export function QuestListSection({
  quests,
  activeQuestTab,
  bonusQuests,
}: QuestListSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingQuests, setIsLoadingQuests] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeQuestTab]);

  const visibleQuests = useMemo(() => {
    return quests.slice(0, currentPage * QUESTS_PER_PAGE);
  }, [quests, currentPage]);

  const hasMore = visibleQuests.length < quests.length;

  const sentinelRef = useInfiniteScroll({
    loading: isLoadingQuests,
    hasMore,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
  });

  const noQuestsTitle =
    activeQuestTab === "daily"
      ? "No Daily Active Quests"
      : activeQuestTab === "weekly"
        ? "No Weekly Active Quests"
        : "No Bonus Active Quests";

  return (
    <div className="space-y-6 lg:col-span-2 [grid-row:4]">
      {isLoadingQuests ? (
        <Card className="flex items-center justify-center py-20 grayscale brightness-50 border-white/20">
          <p className="animate-pulse text-xs font-black uppercase tracking-[0.4em]">
            Loading Active Quests...
          </p>
        </Card>
      ) : visibleQuests.length > 0 ? (
        <>
          {visibleQuests.map((quest, idx) => (
            <QuestCard
              key={getResourceId(quest) ?? quest.id ?? String(idx)}
              quest={quest}
            />
          ))}

          {hasMore ? (
            <div ref={sentinelRef} className="flex justify-center py-4">
              <p className="animate-pulse text-xs font-black uppercase tracking-[0.4em]">
                Loading more quests...
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <Card className="py-16 text-center grayscale border-white/20">
          <CardContent>
            <CardTitle className="font-black uppercase tracking-[0.5em] text-white/20">
              {noQuestsTitle}
            </CardTitle>
          </CardContent>
        </Card>
      )}

      {activeQuestTab !== "bonus" && bonusQuests.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/70">
              Bonus Quests
            </h3>
          </div>
          {bonusQuests.map((quest, idx) => (
            <QuestCard
              key={getResourceId(quest) ?? quest.id ?? `bonus-${idx}`}
              quest={quest}
              className="border-yellow-400/30"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
