import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EditableOutput({
  value,
  onChange,
  placeholder,
  minHeightClass = "min-h-96",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeightClass?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyOutput() {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  return (
    <div className="space-y-3">
      <Textarea
        aria-label="Editable AI output"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${minHeightClass} resize-y bg-background text-sm leading-6 shadow-inner-soft`}
      />
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={copyOutput} disabled={!value.trim()}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
