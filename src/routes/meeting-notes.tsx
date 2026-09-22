import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/productivity/DashboardShell";
import { MeetingNotesPage } from "@/components/productivity/MeetingNotesPage";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Summarize raw meeting notes into editable discussion points, decisions, and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Summarize raw meeting notes into editable discussion points, decisions, and action items.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingNotesRoute,
});

function MeetingNotesRoute() {
  return (
    <DashboardShell>
      <MeetingNotesPage />
    </DashboardShell>
  );
}
