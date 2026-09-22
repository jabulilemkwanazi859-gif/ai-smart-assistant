import { Loader2, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmailDraft } from "@/lib/productivity-ai.functions";

import { EditableOutput } from "./EditableOutput";
import { FeatureLayout } from "./FeatureLayout";

type Tone = "formal" | "friendly" | "persuasive";

export function SmartEmailPage() {
  const generate = useServerFn(generateEmailDraft);
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);
    try {
      const result = await generate({ data: { recipient, context, tone } });
      if (result.ok) {
        setOutput(result.text);
      } else {
        setError(result.message);
      }
    } catch {
      setError("The email draft could not be generated. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const input = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Input
          id="recipient"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="e.g. Jordan from Finance"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Desired tone</Label>
        <Select value={tone} onValueChange={(value: Tone) => setTone(value)}>
          <SelectTrigger id="tone" aria-label="Desired tone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="persuasive">Persuasive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-context">Purpose / context</Label>
        <Textarea
          id="email-context"
          value={context}
          onChange={(event) => setContext(event.target.value)}
          placeholder="Describe what the email should achieve, any important facts, and what response you want."
          className="min-h-56 bg-background leading-6 shadow-inner-soft"
        />
      </div>

      {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <Button type="button" className="w-full sm:w-auto" onClick={handleGenerate} disabled={isGenerating || !recipient.trim() || !context.trim()}>
        {isGenerating ? <Loader2 className="animate-spin" aria-hidden="true" /> : <WandSparkles aria-hidden="true" />}
        {isGenerating ? "Generating" : "Generate email"}
      </Button>
    </div>
  );

  const outputPanel = (
    <EditableOutput
      value={output}
      onChange={setOutput}
      placeholder="Generated email draft will appear here. You can edit it before copying."
    />
  );

  return (
    <FeatureLayout
      eyebrow="Smart Email Generator"
      title="Draft workplace emails with the right tone."
      description="Turn a short brief into a polished email you can refine before sending."
      input={input}
      output={outputPanel}
    />
  );
}
