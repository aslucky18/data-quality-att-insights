import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  type?: string;
  description?: string;
}

interface MultiSelectSearchProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  maxHeight?: string;
}

export const MultiSelectSearch = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Search and select...",
  label,
  className,
  maxHeight = "200px"
}: MultiSelectSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOptions = options.filter(option => 
    selectedValues.includes(option.value)
  );

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const handleRemove = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="relative" ref={dropdownRef}>
        {/* Input Container */}
        <div
          className={cn(
            "min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "flex flex-wrap items-center gap-1 cursor-text",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            isOpen && "ring-2 ring-ring ring-offset-2"
          )}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          {/* Selected items as badges */}
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200"
            >
              <span className="text-xs font-medium">{option.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.value);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Search Input */}
          <Input
            ref={inputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            className="border-none shadow-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px]"
            onFocus={() => setIsOpen(true)}
          />
          
          {/* Dropdown Arrow */}
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-lg"
            style={{ maxHeight }}
          >
            <div className="max-h-full overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent/50"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <div className={cn(
                        "h-4 w-4 border border-primary rounded-sm flex items-center justify-center",
                        isSelected && "bg-primary text-primary-foreground"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.type && (
                          <div className="text-xs text-muted-foreground">
                            {option.type}
                            {option.description && ` - ${option.description}`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};