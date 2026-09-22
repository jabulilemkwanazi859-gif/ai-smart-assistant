import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/productivity/DashboardShell";
import { SmartEmailPage } from "@/components/productivity/SmartEmailPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Draft professional workplace emails with editable AI-generated output.",
      },
      { property: "og:title", content: "Smart Email Generator — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft professional workplace emails with editable AI-generated output.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DashboardShell>
      <SmartEmailPage />
    </DashboardShell>
  );
}
