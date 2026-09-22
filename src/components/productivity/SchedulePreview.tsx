import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function parseMarkdownTable(markdown: string) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  if (lines.length < 2) return undefined;

  const cells = lines.map((line) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim()),
  );

  const header = cells[0];
  if (!header) return undefined;

  const body = cells.slice(2).filter((row) => row.some((cell) => cell && !/^[-:]+$/.test(cell)));
  if (body.length === 0) return undefined;

  return { header, body };
}

export function SchedulePreview({ value }: { value: string }) {
  const table = parseMarkdownTable(value);

  if (!table) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
        A clean schedule table will appear here after generation. Edit the text above to refine it.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background shadow-soft">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {table.header.map((heading) => (
              <TableHead key={heading} className="min-w-28 bg-muted/70 font-semibold text-foreground first:min-w-24">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.body.map((row, rowIndex) => (
            <TableRow key={`${row.join("-")}-${rowIndex}`}>
              {table.header.map((heading, cellIndex) => (
                <TableCell key={`${heading}-${cellIndex}`} className="align-top text-muted-foreground first:font-medium first:text-foreground">
                  {row[cellIndex] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
