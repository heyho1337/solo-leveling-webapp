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

    const questResponse = await api.get('/users/me/quests', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const questData = questResponse.data;

    console.log(questData);

    const workoutResponse = await api.get('/users/me/workout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const workoutData = workoutResponse.data;

    return <QuestContent quests={questData} workouts={workoutData} />;
  } catch (error: any) {
    if (error?.response?.status === 401) redirect("/login");
    redirect("/login");
  }
}