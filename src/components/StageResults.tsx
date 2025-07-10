
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileJson, Table } from "lucide-react";

interface StageResultsProps {
  title: string;
  description: string;
  data: any;
  stageNumber: number;
}

export const StageResults = ({ title, description, data, stageNumber }: StageResultsProps) => {
  const downloadJson = () => {
    const dataStr = JSON.stringify(data.kpis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stage${stageNumber}_kpis.json`;
    link.click();
  };

  const getChartData = () => {
    if (stageNumber === 1) {
      return [
        { name: 'Integer', value: data.kpis.num_integer_columns },
        { name: 'Float', value: data.kpis.num_float_columns },
        { name: 'String', value: data.kpis.num_string_columns },
        { name: 'Boolean', value: data.kpis.num_boolean_columns },
        { name: 'Date', value: data.kpis.num_date_columns },
        { name: 'Other', value: data.kpis.num_other_columns }
      ];
    } else if (stageNumber === 2) {
      return [
        { name: 'Completeness', value: data.kpis.completeness },
        { name: 'Consistency', value: data.kpis.consistency },
        { name: 'Accuracy', value: data.kpis.accuracy }
      ];
    } else {
      return [
        { name: 'High', value: data.kpis.severity_high, color: '#ef4444' },
        { name: 'Medium', value: data.kpis.severity_medium, color: '#f97316' },
        { name: 'Low', value: data.kpis.severity_low, color: '#eab308' }
      ];
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={downloadJson}>
                <FileJson className="w-4 h-4 mr-2" />
                Download KPIs
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.kpis).slice(0, 8).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={typeof value === 'boolean' ? (value ? 'default' : 'destructive') : 'secondary'}>
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value?.toString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualization Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {stageNumber === 1 ? (
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={getChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Table className="w-5 h-5" />
            <span>Data Summary Table</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Polars DataFrame Summary:</p>
            <code className="text-sm bg-white p-2 rounded border block">
              {data.summary_table}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
