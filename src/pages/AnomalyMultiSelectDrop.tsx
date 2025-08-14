"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Define the shape of our options
type Option = {
  value: string;
  label: string;
};

// Define the options for the multi-select
const ANOMALY_DETECTION_OPTIONS: Option[] = [
  { value: "isolation-forest", label: "Isolation Forest" },
  { value: "kmeans", label: "KMeans" },
];

export default function AnomalyDetectionMultiSelect() {
  const [open, setOpen] = React.useState(false);
  // Use a Set for more efficient lookups and modifications
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(new Set());

  const toggleOption = (value: string) => {
    setSelectedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const handleUnselect = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    e.stopPropagation(); // Prevent the popover from opening
    toggleOption(value);
  };
  
  // Convert the Set to an array of full option objects for display
  const selectedOptions = ANOMALY_DETECTION_OPTIONS.filter((option) =>
    selectedValues.has(option.value)
  );

  return (
    <div className="space-y-2">
      <Label>Anomaly Detection Techniques</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
          >
            <div className="flex flex-wrap gap-1">
              {selectedOptions.length === 0 && (
                <span className="text-muted-foreground font-normal">
                  Select anomaly detection methods...
                </span>
              )}
              {selectedOptions.map((option) => (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="rounded-sm px-2 py-1"
                >
                  {option.label}
                  <button
                    aria-label={`Remove ${option.label} option`}
                    onClick={(e) => handleUnselect(e, option.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleUnselect(e as any, option.value);
                      }
                    }}
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search techniques..." />
            <CommandList>
              <CommandEmpty>No technique found.</CommandEmpty>
              <CommandGroup>
                {ANOMALY_DETECTION_OPTIONS.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    value={option.label} // Value for search filtering
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.has(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}