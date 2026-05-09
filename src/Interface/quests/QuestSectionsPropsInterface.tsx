import type { RefObject } from "react";
import { Quest } from "./QuestInterface";

export interface QuestSectionsProps {
  isLoading: boolean;
  activeQuests: Quest[];
  completedQuests: Quest[];
  visibleActiveQuests: Quest[];
  visibleCompletedQuests: Quest[];
  activeSentinelRef: RefObject<HTMLDivElement> | null;
  completedSentinelRef: RefObject<HTMLDivElement> | null;
  onEdit: (quest: Quest) => void;
  onDelete: (quest: Quest | string) => void;
  handleOpenCreate: () => void;
}
