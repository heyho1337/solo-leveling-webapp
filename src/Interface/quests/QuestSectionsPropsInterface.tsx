import type { RefObject } from "react";
import { Quest } from "./QuestInterface";

export interface QuestSectionsProps {
  isLoading: boolean;
  activeQuests: Quest[];
  completedQuests: Quest[];
  missedQuests: Quest[];
  visibleActiveQuests: Quest[];
  visibleCompletedQuests: Quest[];
  visibleMissedQuests: Quest[];
  activeSentinelRef: RefObject<HTMLDivElement> | null;
  completedSentinelRef: RefObject<HTMLDivElement> | null;
  missedSentinelRef: RefObject<HTMLDivElement> | null;
  onEdit: (quest: Quest) => void;
  onDelete: (quest: Quest | string) => void;
  handleOpenCreate: () => void;
}
