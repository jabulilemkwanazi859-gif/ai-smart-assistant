import { Loader2, ListChecks } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeetingNotes } from "@/lib/productivity-ai.functions";

import { EditableOutput } from "./EditableOutput";
import { FeatureLayout } from "./FeatureLayout";

export function MeetingNotesPage() {
  const summarize = useServerFn(summarizeMeetingNotes);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);
    try {
      const result = await summarize({ data: { notes } });
      if (result.ok) {
        setOutput(result.text);
      } else {
        setError(result.message);
      }
    } catch {
      setError("The meeting summary could not be generated. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const input = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meeting-notes">Raw meeting notes</Label>
        <Textarea
          id="meeting-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Paste transcript notes, bullet points, or rough meeting minutes here."
          className="min-h-[26rem] bg-background leading-6 shadow-inner-soft"
        />
      </div>

      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <Button type="button" className="w-full sm:w-auto" onClick={handleGenerate} disabled={isGenerating || !notes.trim()}>
        {isGenerating ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ListChecks aria-hidden="true" />}
        {isGenerating ? "Summarizing" : "Summarize notes"}
      </Button>
    </div>
  );

  const outputPanel = (
    <EditableOutput
      value={output}
      onChange={setOutput}
      placeholder="Key discussion points, decisions, and action items will appear here. You can edit everything before use."
      minHeightClass="min-h-[26rem]"
    />
  );

  return (
    <FeatureLayout
      eyebrow="Meeting Notes Summarizer"
      title="Convert rough notes into clear follow-ups."
      description="Paste raw notes and get a structured summary with decisions and action items where details are available."
      input={input}
      output={outputPanel}
    />
  );
}
