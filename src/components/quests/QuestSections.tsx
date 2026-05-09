"use client";

import { ScrollText, CheckCircle2, Swords, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestCard } from "@/components/quests/QuestCard";
import { getResourceId } from "@/lib/resourceUtils";
import { QuestSectionsProps } from "@/Interface/quests/QuestSectionsPropsInterface";
import { Quest } from "@/Interface/quests/QuestInterface";

export function QuestSections({
  isLoading,
  activeQuests,
  completedQuests,
  visibleActiveQuests,
  visibleCompletedQuests,
  activeSentinelRef,
  completedSentinelRef,
  onEdit,
  onDelete,
  handleOpenCreate,
}: QuestSectionsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-[#38bdf8]">
            <ScrollText className="h-5 w-5" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Active Requirements
            </h3>
          </div>

          <div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse border border-white/5 bg-white/5"
                  />
                ))}
              </div>
            ) : activeQuests.length > 0 ? (
              <div className="space-y-4">
                {visibleActiveQuests.map((quest: Quest, idx) => {
                  const questId =
                    getResourceId(quest) ||
                    quest.id ||
                    `active-quest-${idx}`;

                  return (
                    <QuestCard
                      key={String(questId)}
                      quest={quest}
                      onEdit={() => onEdit(quest)}
                      onDelete={() => onDelete(quest)}
                      headerRight={
                        <span className="border border-[#38bdf8]/10 bg-[#38bdf8]/20 px-2 py-0.5 text-[10px] font-black text-[#38bdf8]">
                          ACTIVE
                        </span>
                      }
                    />
                  );
                })}
                <div ref={activeSentinelRef} className="h-1" />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-white/2 py-12 opacity-50 grayscale">
                <ScrollText className="h-8 w-8 text-white/20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  No active quests detected
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-[#4ade80]">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Completed Protocols
            </h3>
          </div>

          <div>
            {completedQuests.length > 0 ? (
              <div className="space-y-4">
                {visibleCompletedQuests.map((quest: Quest, idx) => {
                  const questId =
                    getResourceId(quest) ||
                    quest.id ||
                    `completed-quest-${idx}`;

                  return (
                    <QuestCard
                      key={String(questId)}
                      quest={quest}
                      onEdit={() => onEdit(quest)}
                      onDelete={() => onDelete(quest)}
                      className="opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
                      headerRight={
                        <span className="border border-[#4ade80]/20 bg-[#4ade80]/15 px-2 py-0.5 text-[10px] font-black text-[#4ade80]">
                          COMPLETED
                        </span>
                      }
                    />
                  );
                })}
                <div ref={completedSentinelRef} className="h-1" />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 border border-white/5 bg-white/2 py-12 opacity-50 grayscale">
                <CheckCircle2 className="h-8 w-8 text-white/20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  History is empty
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {!activeQuests.length && !completedQuests.length ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Swords className="h-8 w-8 text-white/30" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80">
              No quests available
            </h3>
            <p className="max-w-md text-[11px] uppercase tracking-[0.2em] text-white/40">
              Create your first quest or assign a workout-based protocol to begin
              tracking progress.
            </p>
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create First Quest
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}