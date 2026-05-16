"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface EquippedGearSectionProps {
  equipment?: any[];
}

export const EquippedGearSection = ({ equipment = [] }: EquippedGearSectionProps) => {
  const equippedBySlot = equipment.reduce((acc: any, inv: any) => {
    acc[inv.item.equipmentSlot] = inv;
    return acc;
  }, {});

  const equipmentLayout = [
    { slot: "helmet", label: "HEAD" },
    { slot: "necklace", label: "NECK" },
    { slot: "main_hand", label: "MAIN WEAPON" },
    { slot: "armor", label: "BODY" },
    { slot: "bracelet", label: "ARMS" },
    { slot: "off_hand", label: "OFFHAND WEAPON" },
    { slot: "gloves", label: "HANDS" },
    { slot: "ring", label: "RING" },
    { slot: "shoes", label: "FEET" },
  ];

  return (
    <section className="equippedGear">
      <CardHeader>
        <CardTitle className="mt-[20px] text-[20px] font-black uppercase tracking-widest text-white/60">
          Items
        </CardTitle>
      </CardHeader>
      <CardContent className="Inventory grid grid-cols-3 gap-3">
        {equipmentLayout.map(({ slot, label }) => {
          const equippedItem = equippedBySlot[slot];

          if (equippedItem) {
            const item = equippedItem.item;

            return (
              <Card
                key={slot}
                className="group relative overflow-hidden border border-white/20 bg-black/60 transition-all hover:border-[#38bdf8]/30 hover:bg-[#38bdf8]/10 p-3"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10 space-y-2">
                  {/* Icon */}
                  {item.icon && (
                    <div className="flex items-center justify-center gap-2 bg-black/41 p-1">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-8 h-8 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/80 system-text-glow-strong">
                        {label}
                      </span>
                    </div>
                  )}

                  {/* Item Name */}
                  <div className="text-center">
                    <span
                      className={`text-[14px] font-black uppercase tracking-widest truncate ${
                        item.rarity === "Rare"
                          ? "text-yellow-400"
                          : item.rarity === "Uncommon"
                            ? "text-green-400"
                            : item.rarity === "Epic"
                              ? "text-purple-400"
                              : "text-gray-400"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Stat Boosts */}
                  {item.statBoosts && Object.keys(item.statBoosts).length > 0 && (
                    <div className="text-center flex flex-wrap justify-center gap-2">
                      {Object.entries(item.statBoosts).map(([stat, value], index, arr) => (
                        <span
                          key={stat}
                          className="pt-1 pb-1 pl-2 pr-2 border-white/40 border-[1px] text-[12px] text-white system-text-glow-strong font-medium"
                        >
                          {stat.toUpperCase()}: +{value}
                          {index < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <div className="text-center">
                    <p className="text-[12px] text-white/40 leading-tight line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          }

          // Empty slot
          return (
            <Card
              key={slot}
              className="grayscale group flex flex-col items-center justify-center border border-white/10 bg-black/40 transition-all hover:border-[#38bdf8]/20 hover:bg-[#38bdf8]/5 p-3"
            >
              <div className="text-center space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                  {label}
                </span>
                <div className="w-8 h-8 border border-white/10 rounded flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-white/20" />
                </div>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </section>
  );
};
