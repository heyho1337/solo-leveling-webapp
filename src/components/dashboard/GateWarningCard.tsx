"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const GateWarningCard = () => {
  return (
    <Card className="gates border-white/20">
      <CardHeader>
        <CardTitle className="text-xs font-black uppercase tracking-widest text-white/60 system-text-glow-strong">
          Gate Warning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[10px] font-black uppercase leading-tight tracking-widest text-white/80 system-text-glow">
          No red gates detected in your vicinity.
        </p>
      </CardContent>
    </Card>
  );
};
