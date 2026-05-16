import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/services/api";
import QuestContent from "@/components/quests/QuestContent";
import type { User } from "@/Interface/dashboard/UserInterface";

export default async function QuestsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const userRes = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = userRes.data as User;
    if (!userData.hasCompletedQuestionnaire) redirect("/onboarding");

    const activeQuests = await api.get('/users/me/quests/active', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const activeQuestData = activeQuests.data;
    console.log(activeQuestData);

    const completedQuests = await api.get('/users/me/quests/completed', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const completedQuestData = completedQuests.data;
    console.log(completedQuestData);
    
    const missedQuests = await api.get('/users/me/quests/missed', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const missedQuestData = missedQuests.data;
    console.log(missedQuestData);

    const workoutResponse = await api.get('/users/me/workout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const workoutData = workoutResponse.data;

    return <QuestContent 
      activeQuests={activeQuestData}
      completedQuests={completedQuestData}
      missedQuests={missedQuestData}
      workouts={workoutData} />;
  } catch (error: any) {
    if (error?.response?.status === 401) redirect("/login");
    redirect("/login");
  }
}