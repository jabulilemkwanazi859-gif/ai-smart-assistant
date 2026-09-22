import { CalendarRange, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateTaskSchedule } from "@/lib/productivity-ai.functions";

import { EditableOutput } from "./EditableOutput";
import { FeatureLayout } from "./FeatureLayout";
import { SchedulePreview } from "./SchedulePreview";

type Horizon = "daily" | "weekly";

export function TaskPlannerPage() {
  const planTasks = useServerFn(generateTaskSchedule);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("daily");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);
    try {
      const result = await planTasks({ data: { tasks, horizon } });
      if (result.ok) {
        setOutput(result.text);
      } else {
        setError(result.message);
      }
    } catch {
      setError("The schedule could not be generated. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const input = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="schedule-horizon">Schedule type</Label>
        <Select value={horizon} onValueChange={(value: Horizon) => setHorizon(value)}>
          <SelectTrigger id="schedule-horizon" aria-label="Schedule type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-list">Tasks, deadlines, and priority</Label>
        <Textarea
          id="task-list"
          value={tasks}
          onChange={(event) => setTasks(event.target.value)}
          placeholder="Example: Prepare client proposal — high priority — due Thursday\nReview analytics report — medium priority\nSend budget update — due today"
          className="min-h-72 bg-background leading-6 shadow-inner-soft"
        />
      </div>

      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <Button type="button" className="w-full sm:w-auto" onClick={handleGenerate} disabled={isGenerating || !tasks.trim()}>
        {isGenerating ? <Loader2 className="animate-spin" aria-hidden="true" /> : <CalendarRange aria-hidden="true" />}
        {isGenerating ? "Planning" : "Generate schedule"}
      </Button>
    </div>
  );

  const outputPanel = (
    <div className="space-y-5">
      <EditableOutput
        value={output}
        onChange={setOutput}
        placeholder="Generated schedule will appear here as editable text."
        minHeightClass="min-h-64"
      />
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Schedule preview</h3>
        <SchedulePreview value={output} />
      </div>
    </div>
  );

  return (
    <FeatureLayout
      eyebrow="AI Task Planner / Scheduler"
      title="Prioritize tasks into a practical schedule."
      description="Create a daily or weekly plan ordered by priority and deadlines, then edit the result before using it."
      input={input}
      output={outputPanel}
    />
  );
}
