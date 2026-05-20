import { getCurrentUser } from '@/app/actions/utils';
import { getDailyQuests, getWeeklyQuests, getBonusQuests, getHiddenQuests } from '@/app/actions/quests';
import { getInventory, getEquipment } from '@/app/actions/user';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DashboardTitle } from '@/components/dashboard/DashboardTitle';
import { QuestSection } from '@/components/dashboard/QuestSection';
import { GateWarningCard } from '@/components/dashboard/GateWarningCard';
import { StatusSection } from '@/components/dashboard/StatusSection';
import { EquippedGearSection } from '@/components/dashboard/EquippedGearSection';

export default async function DashboardPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success) {
    redirect('/login');
  }

  const userData = userResult.data;

  if (!userData.hasCompletedQuestionnaire) {
    redirect('/onboarding');
  }

  const [dailyRes, weeklyRes, bonusRes, hiddenRes, inventoryRes, equipmentRes] = await Promise.all([
    getDailyQuests(),
    getWeeklyQuests(),
    getBonusQuests(),
    getHiddenQuests(),
    getInventory(),
    getEquipment(),
  ]);

  const dailyQuests = dailyRes.success ? dailyRes.data : [];
  const weeklyQuests = weeklyRes.success ? weeklyRes.data : [];
  const bonusQuests = bonusRes.success ? bonusRes.data : [];
  const hiddenQuest = hiddenRes.success && !Array.isArray(hiddenRes.data) ? hiddenRes.data : null;
  const inventory = inventoryRes.success ? inventoryRes.data : [];
  const equipment = equipmentRes.success ? equipmentRes.data : [];

  return (
    <div className="space-y-8 grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-8">
      <div className="questSection flex flex-col gap-8 [grid-column:1]">
        <DashboardTitle username={userData?.username} />

        <QuestSection
          dailyQuests={dailyQuests}
          weeklyQuests={weeklyQuests}
          bonusQuests={bonusQuests}
        />

        <GateWarningCard />
      </div>

      <div className="InfoBar space-y-6 [grid-column:2]">
        {hiddenQuest ? (
          <Card className="border-yellow-300/20 bg-yellow-300/10">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-yellow-300">
                Hidden Quest Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">{hiddenQuest.name}</p>
              {hiddenQuest.description ? (
                <p className="mt-3 text-[10px] text-white/60 leading-relaxed">{hiddenQuest.description}</p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <StatusSection stats={userData?.stats} />

        <EquippedGearSection equipment={equipment} />
      </div>
    </div>
  );
}
