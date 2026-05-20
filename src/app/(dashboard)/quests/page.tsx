import { redirect } from "next/navigation";
import QuestContent from "@/components/quests/QuestContent";
import { getCurrentUser } from "@/app/actions/utils";
import { getActiveQuests, getCompletedQuests, getMissedQuests } from "@/app/actions/quests";
import { getWorkouts } from "@/app/actions/workouts";

export default async function QuestsPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success) {
    redirect("/login");
  }

  const userData = userResult.data;
  if (!userData.hasCompletedQuestionnaire) {
    redirect("/onboarding");
  }

  const [activeRes, completedRes, missedRes, workoutRes] = await Promise.all([
    getActiveQuests(),
    getCompletedQuests(),
    getMissedQuests(),
    getWorkouts(),
  ]);

  return (
    <QuestContent
      activeQuests={activeRes.success ? activeRes.data : []}
      completedQuests={completedRes.success ? completedRes.data : []}
      missedQuests={missedRes.success ? missedRes.data : []}
      workouts={workoutRes.success ? workoutRes.data : []}
    />
  );
}
