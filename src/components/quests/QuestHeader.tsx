import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";
import { QuestHeaderProps } from "@/Interface/quests/QuestHeaderPropsInterface";

export function QuestHeader({
  searchQuery,
  onSearchChange,
  onAddClick,
}: QuestHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Quest Log
        </h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
          Your path to awakening
        </p>
      </div>

      <div className="flex w-full items-center gap-4 md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="SEARCH QUESTS..."
            value={searchQuery}
            onChange={onSearchChange}
            className="h-12 border-white/20 bg-black/60 pl-10 text-[10px] font-bold uppercase tracking-widest text-white focus:border-[#38bdf8]/60"
          />
        </div>

        <Button
          variant="primary"
          onClick={onAddClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Add New Quest</span>
        </Button>
      </div>
    </div>
  );
}