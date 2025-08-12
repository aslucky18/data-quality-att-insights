import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Check, X, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Column {
  name: string;
  type: string;
  description: string;
}

interface ColumnConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  selectedColumns: string[];
  onColumnSelectionChange: (selectedColumns: string[]) => void;
  onSaveConfiguration: () => void;
}

export const ColumnConfigurationModal = ({
  isOpen,
  onClose,
  columns,
  selectedColumns,
  onColumnSelectionChange,
  onSaveConfiguration
}: ColumnConfigurationModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [configFile, setConfigFile] = useState<File | null>(null);

  const filteredColumns = columns.filter(column =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      onColumnSelectionChange([]);
    } else {
      onColumnSelectionChange(columns.map(col => col.name));
    }
  };

  const handleColumnToggle = (columnName: string) => {
    const newSelection = selectedColumns.includes(columnName)
      ? selectedColumns.filter(name => name !== columnName)
      : [...selectedColumns, columnName];
    onColumnSelectionChange(newSelection);
  };

  const handleConfigFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let config;
      
      if (file.name.endsWith('.json')) {
        config = JSON.parse(text);
      } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        // Simple YAML parsing - in a real app, you'd use a proper YAML parser
        const lines = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        config = { columns: lines.map(line => line.trim().replace(/^-\s*/, '')) };
      } else {
        throw new Error('Unsupported file format');
      }

      if (!config.columns || !Array.isArray(config.columns)) {
        throw new Error('Configuration file must contain a "columns" array');
      }

      // Validate that all columns in config exist in the source
      const availableColumnNames = columns.map(col => col.name);
      const invalidColumns = config.columns.filter(col => !availableColumnNames.includes(col));
      
      if (invalidColumns.length > 0) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: `The following columns are not available in the source data: ${invalidColumns.join(', ')}. Please update your configuration file.`,
        });
        return;
      }

      onColumnSelectionChange(config.columns);
      setConfigFile(file);
      toast({
        title: "Configuration Loaded",
        description: `Successfully loaded ${config.columns.length} columns from configuration file.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File Error",
        description: `Failed to parse configuration file: ${error.message}`,
      });
    }
  };

  const handleSave = () => {
    if (selectedColumns.length === 0) {
      toast({
        variant: "destructive",
        title: "No Columns Selected",
        description: "Please select at least one column to focus on.",
      });
      return;
    }
    
    onSaveConfiguration();
    onClose();
    toast({
      title: "Focus Columns Configured",
      description: `Successfully configured ${selectedColumns.length} focus columns.`,
    });
  };

  // Arrange columns in 3x4 grid (12 columns per view)
  const columnsPerPage = 12;
  const totalPages = Math.ceil(filteredColumns.length / columnsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  
  const startIndex = currentPage * columnsPerPage;
  const endIndex = startIndex + columnsPerPage;
  const currentColumns = filteredColumns.slice(startIndex, endIndex);
  
  // Arrange in 3 columns, 4 rows
  const columnGrid = [];
  for (let i = 0; i < currentColumns.length; i += 3) {
    columnGrid.push(currentColumns.slice(i, i + 3));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-blue-600" />
            Configure Focus Columns
          </DialogTitle>
          <DialogDescription>
            Select the columns you want to focus on for data quality analysis. You can also upload a configuration file to automatically select columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Configuration File */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Configuration File
              </CardTitle>
              <CardDescription>
                Upload a JSON or YAML file with column names to automatically configure focus columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label htmlFor="config-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </div>
                </Label>
                <input
                  id="config-upload"
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleConfigFileUpload}
                  className="hidden"
                />
                {configFile && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {configFile.name}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                {selectedColumns.length === columns.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Badge variant="secondary">
                {selectedColumns.length} of {columns.length} selected
              </Badge>
            </div>
          </div>

          {/* Columns Grid (3x4) */}
          <div className="space-y-4">
            {columnGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-4">
                {row.map((column) => (
                  <Card key={column.name} className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedColumns.includes(column.name) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}>
                    <CardContent className="p-4" onClick={() => handleColumnToggle(column.name)}>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedColumns.includes(column.name)}
                          onChange={() => handleColumnToggle(column.name)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{column.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{column.description}</p>
                          <Badge variant="outline" className="text-xs mt-2">
                            {column.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedColumns.length === 0}>
              Save Focus Columns ({selectedColumns.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};