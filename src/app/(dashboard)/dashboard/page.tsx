import api from '@/services/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/Interface/dashboard/UserInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DashboardTitle } from '@/components/dashboard/DashboardTitle';
import { QuestSection } from '@/components/dashboard/QuestSection';
import { GateWarningCard } from '@/components/dashboard/GateWarningCard';
import { StatusSection } from '@/components/dashboard/StatusSection';
import { EquippedGearSection } from '@/components/dashboard/EquippedGearSection';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const requestConfig = {
      headers,
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
    };

    const [userResponse, dailyResponse, weeklyResponse, bonusResponse, hiddenResponse, inventoryResponse, equipmentResponse] = await Promise.all([
      api.get('/users/me', requestConfig),
      api.get('/users/me/quests/daily', requestConfig),
      api.get('/users/me/quests/weekly', requestConfig),
      api.get('/users/me/quests/bonus', requestConfig),
      api.get('/users/me/quests/hidden', requestConfig),
      api.get('/user_inventories', requestConfig),
      api.get('/user_equipment', requestConfig),
    ]);

    const userData = userResponse.data as User;

    if (!userData || !userData.hasCompletedQuestionnaire) {
      redirect(userData ? '/onboarding' : '/login');
    }

    const dailyQuests = dailyResponse.status === 404 ? [] : dailyResponse.data ?? [];
    const weeklyQuests = weeklyResponse.status === 404 ? [] : weeklyResponse.data ?? [];
    const bonusQuests = bonusResponse.status === 404 ? [] : bonusResponse.data ?? [];
    const hiddenQuest =
      hiddenResponse.status === 404 || Array.isArray(hiddenResponse.data)
        ? null
        : hiddenResponse.data ?? null;
    const inventory = inventoryResponse.status === 404 ? [] : inventoryResponse.data ?? [];
    const equipment = equipmentResponse.status === 404 ? [] : equipmentResponse.data ?? [];

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
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirect('/login');
    }

    redirect('/login');
  }
}
