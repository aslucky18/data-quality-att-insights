import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, Search, X } from "lucide-react";

// Self-contained Data Quality Rules component
// Provides an editable table with Condition (searchable), Columns (multi-select with badges),
// Threshold input, and row delete action.

const CONDITIONS = [
  "Uniqueness",
  "Staleness Check",
  "Null Check",
  "Format Validation",
  "Value Range",
  "Referential Integrity",
  "Row Count",
] as const;

const COLUMN_NAMES = [
  "id",
  "first_name",
  "last_name",
  "email",
  "phone_number",
  "order_id",
  "order_date",
  "product_id",
  "quantity",
  "price",
  "customer_id",
];

type Condition = typeof CONDITIONS[number];

type Rule = {
  id: string;
  condition: Condition | "";
  columns: string[];
  threshold: string; // keep as string for easy controlled input of decimals
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Single-select searchable dropdown (inline, non-transparent, high z-index)
function SearchableConditionSelect({
  value,
  onChange,
  options,
  placeholder = "Select condition",
}: {
  value: Condition | "";
  onChange: (val: Condition) => void;
  options: readonly Condition[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div ref={ref} className="relative w-full">
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("truncate text-left", !value && "text-muted-foreground")}
          >{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-md border border-input bg-popover text-popover-foreground shadow-lg",
            "p-2"
          )}
          role="listbox"
        >
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search condition..."
              className="pl-8"
            />
          </div>
          <div className="max-h-56 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">No results</div>
            ) : (
              <ul className="space-y-1">
                {filtered.map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                        value === opt && "bg-accent/60"
                      )}
                      onClick={() => {
                        onChange(opt);
                        setOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Multi-select dropdown with searchable list and checkboxes
function ColumnsMultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select columns...",
}: {
  value: string[];
  onChange: (vals: string[]) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (col: string) => {
    if (value.includes(col)) onChange(value.filter((v) => v !== col));
    else onChange([...value, col]);
  };

  const remove = (col: string) => onChange(value.filter((v) => v !== col));

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={cn(
          "min-h-10 w-full cursor-text rounded-md border border-input bg-background px-2 py-1",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-1">
          {value.length === 0 ? (
            <span className="px-2 py-1 text-sm text-muted-foreground">{placeholder}</span>
          ) : (
            value.map((v) => (
              <Badge key={v} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs font-medium">{v}</span>
                <button
                  type="button"
                  className="rounded-sm p-0.5 hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                  aria-label={`Remove ${v}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[min(28rem,calc(100vw-2rem))] rounded-md border border-input bg-popover text-popover-foreground shadow-lg",
            "p-2"
          )}
          role="dialog"
        >
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search columns..."
              className="pl-8"
            />
          </div>
          <div className="max-h-64 overflow-y-auto pr-1">
            <ul className="space-y-1">
              {filtered.map((col) => {
                const checked = value.includes(col);
                return (
                  <li key={col}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                        checked && "bg-accent/60"
                      )}
                      onClick={() => toggle(col)}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(col)} />
                      <span className="truncate">{col}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {filtered.length === 0 && (
            <div className="px-2 py-3 text-sm text-muted-foreground">No columns found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DataQualityRules() {
  const [rules, setRules] = useState<Rule[]>([
    { id: uid(), condition: "Uniqueness", columns: ["id", "email"], threshold: "99.5" },
    { id: uid(), condition: "Null Check", columns: ["order_date", "customer_id"], threshold: "99.9" },
  ]);

  const addRule = () => {
    setRules((r) => [
      ...r,
      { id: uid(), condition: "Uniqueness", columns: [], threshold: "99.0" },
    ]);
  };

  const updateRule = (id: string, patch: Partial<Rule>) => {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRule = (id: string) => setRules((rs) => rs.filter((r) => r.id !== id));

  return (
    <section aria-labelledby="dq-rules-title" className="w-full">
      <header className="mb-4 flex items-center justify-between">
        <h1 id="dq-rules-title" className="text-2xl font-bold tracking-tight">
          Data Quality Rules
        </h1>
        <Button onClick={addRule} className="gap-2">
          <Plus className="h-4 w-4" /> Add Rule
        </Button>
      </header>

      <article className="rounded-lg border bg-background p-2 md:p-4 shadow-sm">
        <div className="relative w-full overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Condition</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead className="w-56">Alerting Threshold (%)</TableHead>
                <TableHead className="w-16 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} className="transition-colors">
                  <TableCell>
                    <SearchableConditionSelect
                      value={rule.condition}
                      onChange={(val) => updateRule(rule.id, { condition: val })}
                      options={CONDITIONS}
                    />
                  </TableCell>
                  <TableCell>
                    <ColumnsMultiSelect
                      value={rule.columns}
                      onChange={(vals) => updateRule(rule.id, { columns: vals })}
                      options={COLUMN_NAMES}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      max="100"
                      value={rule.threshold}
                      onChange={(e) => updateRule(rule.id, { threshold: e.target.value })}
                      placeholder="e.g., 99.5"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeRule(rule.id)}
                      aria-label="Delete rule"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </article>
    </section>
  );
}
