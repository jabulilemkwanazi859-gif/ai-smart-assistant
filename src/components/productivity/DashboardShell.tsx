import { Link } from "@tanstack/react-router";
import { CalendarClock, FileText, Mail, Sparkles, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Email", fullLabel: "Smart Email Generator", to: "/", icon: Mail, exact: true },
  { label: "Notes", fullLabel: "Meeting Notes Summarizer", to: "/meeting-notes", icon: FileText },
  { label: "Planner", fullLabel: "AI Task Planner", to: "/task-planner", icon: CalendarClock },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-shell-gradient text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col lg:flex-row">
        <aside className="border-sidebar-border bg-sidebar/90 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="AI Workplace Productivity Assistant home">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                  AI Workplace
                </span>
                <span className="block truncate text-xs text-sidebar-foreground/65">
                  Productivity Assistant
                </span>
              </span>
            </Link>
            <div className="hidden rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium text-sidebar-accent-foreground sm:block lg:mt-6 lg:inline-flex">
              Workflows
            </div>
          </div>

          <nav aria-label="Assistant tools" className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="group flex min-w-fit items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:min-w-0"
                  activeProps={{
                    className:
                      "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground shadow-nav",
                  }}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="lg:hidden">{item.label}</span>
                  <span className="hidden truncate lg:inline">{item.fullLabel}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden pt-8 lg:block">
            <ResponsibleAiNote compact />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</div>
          <footer className="px-4 pb-5 sm:px-6 lg:hidden">
            <ResponsibleAiNote />
          </footer>
        </main>
      </div>
    </div>
  );
}

function ResponsibleAiNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/70 bg-card/80 text-muted-foreground shadow-soft backdrop-blur",
        compact ? "p-3 text-xs" : "p-4 text-sm",
      )}
    >
      <div className="flex gap-2">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          <span className="font-medium text-foreground">Responsible AI:</span> AI-generated content may contain errors. Please review before use.
        </p>
      </div>
    </div>
  );
}
