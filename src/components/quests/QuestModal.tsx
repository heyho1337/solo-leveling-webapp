import { ManagementModal } from "@/components/ui/ManagementModal";
import { QuestModalProps } from "@/Interface/quests/QuestModalPropsInterface";

export function QuestModal({
  isOpen,
  onClose,
  title,
  children,
}: QuestModalProps) {
  return (
    <ManagementModal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </ManagementModal>
  );
}