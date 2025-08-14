import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rule {
  id: string;
  condition: string;
  columns: string[];
  threshold: number;
}

interface DataQualityConfigurationProps {
  onAddRule?: (rule: Omit<Rule, 'id'>) => void;
  onDeleteRule?: (ruleId: string) => void;
  focusColumns?: string[];
}

const conditionOptions = [
  { value: "uniqueness", label: "Uniqueness" },
  { value: "null_check", label: "Null Check" },
  { value: "data_type", label: "Data Type" },
  { value: "range_check", label: "Range Check" },
  { value: "format_check", label: "Format Check" },
];

// Default columns if no focus columns are provided
const defaultColumnOptions = [
  { value: "id", label: "id" },
  { value: "email", label: "email" },
  { value: "order_date", label: "order_date" },
  { value: "customer_id", label: "customer_id" },
  { value: "product_name", label: "product_name" },
  { value: "quantity", label: "quantity" },
  { value: "price", label: "price" },
  { value: "status", label: "status" },
];

const Chip = ({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) => (
  <div className="inline-flex items-center gap-1 px-2 py-1 bg-chip border border-chip-border text-chip-foreground text-sm rounded-md">
    {children}
    <X
      className="h-3 w-3 cursor-pointer hover:text-destructive"
      onClick={onRemove}
    />
  </div>
);

const MultiSelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select columns..."
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeChip = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map(val => {
                const option = options.find(opt => opt.value === val);
                return option ? (
                  <Chip key={val} onRemove={() => removeChip(val)}>
                    {option.label}
                  </Chip>
                ) : null;
              })
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search columns..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No columns found.</CommandEmpty>
          <CommandGroup className="max-h-48 overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select condition..."
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search conditions..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No conditions found.</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const DataQualityConfiguration = ({
  onAddRule,
  onDeleteRule,
  focusColumns = []
}: DataQualityConfigurationProps) => {
  // Use focus columns if provided, otherwise use default columns
  const columnOptions = focusColumns.length > 0 
    ? focusColumns.map(col => ({ value: col, label: col }))
    : defaultColumnOptions;
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      condition: "uniqueness",
      columns: ["id", "email"],
      threshold: 99.5,
    },
    {
      id: "2",
      condition: "null_check",
      columns: ["order_date", "customer_id"],
      threshold: 99.9,
    },
  ]);

  const addNewRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      condition: "",
      columns: [],
      threshold: 95.0,
    };
    setRules([...rules, newRule]);
    if (onAddRule) {
      onAddRule({ condition: newRule.condition, columns: newRule.columns, threshold: newRule.threshold });
    }
  };

  const updateRule = (id: string, field: keyof Omit<Rule, 'id'>, value: any) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    if (onDeleteRule) {
      onDeleteRule(id);
    }
  };

  return (
    <div className="p-6 bg-background">
      {/* Header */}
<div className="flex items-center justify-between mb-6">
  {/* Left side - Title and subtitle */}
  <div>
    <h1 className="text-2xl font-semibold text-foreground">Data Quality Configuration</h1>
    <p className="text-muted-foreground mt-1">Define rules to monitor your data source.</p>
  </div>

  {/* Right side - Buttons */}
  <div className="flex items-center gap-2">
    <Button
      onClick={addNewRule}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
    >
      <Plus className="h-4 w-4" />
      Add Rule
    </Button>

    <input
      type="file"
      accept=".json"
      id="jsonUpload"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const jsonData = JSON.parse(event.target.result.toString());
              console.log("Uploaded JSON:", jsonData);
            } catch (err) {
              console.error("Invalid JSON file", err);
            }
          };
          reader.readAsText(file);
        }
      }}
    />
    <Button
      onClick={() => document.getElementById("jsonUpload").click()}
      className="flex items-center gap-2 bg-white-500 hover:bg-white-600 text-black border border-gray-500"
    >
      <Plus className="h-4 w-4" />
      Upload JSON
    </Button>
  </div>
</div>

      {/* Table Header */}
      <div className="bg-muted/50 rounded-t-lg border-b">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-3">CONDITION</div>
          <div className="col-span-4">COLUMNS</div>
          <div className="col-span-3">ALERTING THRESHOLD (%)</div>
          <div className="col-span-2">ACTIONS</div>
        </div>
      </div>

      {/* Rules */}
      <div className="border-x border-b rounded-b-lg">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className={cn(
              "grid grid-cols-12 gap-4 p-4 items-start",
              index !== rules.length - 1 && "border-b"
            )}
          >
            {/* Condition Dropdown */}
            <div className="col-span-3">
              <SearchableSelect
                options={conditionOptions}
                value={rule.condition}
                onChange={(value) => updateRule(rule.id, 'condition', value)}
                placeholder="Select condition..."
              />
            </div>

            {/* Columns Multi-Select */}
            <div className="col-span-4">
              <MultiSelectDropdown
                options={columnOptions}
                value={rule.columns}
                onChange={(value) => updateRule(rule.id, 'columns', value)}
                placeholder="Select columns..."
              />
            </div>

            {/* Threshold Input */}
            <div className="col-span-3">
              <Input
                type="number"
                step="0.1"
                
                max="100"
                value={rule.threshold}
                onChange={(e) => updateRule(rule.id, 'threshold', parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteRule(rule.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-x border-b rounded-b-lg">
          No rules configured. Click "Add Rule" to get started.
        </div>
      )}
    </div>
  );
};

export default DataQualityConfiguration;