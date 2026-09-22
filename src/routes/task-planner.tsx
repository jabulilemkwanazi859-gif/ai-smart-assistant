import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/productivity/DashboardShell";
import { TaskPlannerPage } from "@/components/productivity/TaskPlannerPage";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Generate an editable daily or weekly workplace schedule ordered by priority and deadlines.",
      },
      { property: "og:title", content: "AI Task Planner — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Generate an editable daily or weekly workplace schedule ordered by priority and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskPlannerRoute,
});

function TaskPlannerRoute() {
  return (
    <DashboardShell>
      <TaskPlannerPage />
    </DashboardShell>
  );
}
