import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from "recharts";
import { Download, FileJson, BarChart3, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

interface StageResultsProps {
  title: string;
  description: string;
  data: any;
  stageNumber: number;
}

export const StageResults = ({ title, description, data, stageNumber }: StageResultsProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['null_percentage']);

  const downloadJson = () => {
    const dataStr = JSON.stringify(data.kpis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stage${stageNumber}_kpis.json`;
    link.click();
  };

  const downloadCheckOutput = (checkName: string) => {
    const checkData = data.checks?.find((check: any) => check.name === checkName);
    if (checkData) {
      const dataStr = JSON.stringify(checkData.output, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${checkName}_output.json`;
      link.click();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status.toLowerCase() === 'passed' ? 'default' : 
                    status.toLowerCase() === 'failed' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (stageNumber === 1) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl">{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Key Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Key Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(data.kpis).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-sm text-muted-foreground mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-3xl font-bold">{value?.toString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expandable Sections */}
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="columns">
            <AccordionTrigger className="bg-muted/50 px-4 rounded-lg">
              📋 Column Names List
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {data.columns?.map((column: string, index: number) => (
                  <Badge key={index} variant="outline">{column}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dates">
            <AccordionTrigger className="bg-muted/50 px-4 rounded-lg">
              📅 Date Columns List
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {data.dateColumns?.map((column: string, index: number) => (
                  <Badge key={index} variant="outline">{column}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Distribution Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Distribution Charts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">datatype Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.datatypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.datatypeDistribution?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">is_constant Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.constantDistribution || [{ name: 'false', value: 100, color: '#3b82f6' }]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.constantDistribution?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stageNumber === 2) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl">{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overall Findings</TabsTrigger>
            <TabsTrigger value="charts">Check Distribution Charts</TabsTrigger>
            <TabsTrigger value="insights">Per-Check Insights</TabsTrigger>
            <TabsTrigger value="metrics">Visualize Numerical Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Overall Findings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Overall Status</p>
                    <p className="text-3xl font-bold text-red-600">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Checks Run</p>
                    <p className="text-3xl font-bold">7</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Passed Checks</p>
                    <p className="text-3xl font-bold text-green-600">2</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Failed Checks</p>
                    <p className="text-3xl font-bold text-red-600">2</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Errored Checks</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Skipped Checks</p>
                    <p className="text-3xl font-bold text-yellow-600">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Check Distribution Charts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">check_type</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.checkTypeDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.checkTypeDistribution?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">status</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.statusDistribution?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Summary Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>name</TableHead>
                        <TableHead>check_type</TableHead>
                        <TableHead>status</TableHead>
                        <TableHead>rows_scanned</TableHead>
                        <TableHead>breaching_rows</TableHead>
                        <TableHead>percentage_breached</TableHead>
                        <TableHead>details</TableHead>
                        <TableHead>columns_checked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.summaryTable?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{row.check_type}</TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                          <TableCell>{row.rows_scanned}</TableCell>
                          <TableCell>{row.breaching_rows}</TableCell>
                          <TableCell>{row.percentage_breached}</TableCell>
                          <TableCell className="max-w-xs truncate">{row.details}</TableCell>
                          <TableCell>{row.columns_checked}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Breach Percentage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Breach Percentage by Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium">Percentage Breached by Check</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.breachPercentageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis label={{ value: '% Breached', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>📝 Per-Check Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.checks?.map((check: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(check.status)}
                            <CardTitle className="text-lg">{check.name}</CardTitle>
                          </div>
                          {check.hasOutput && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadCheckOutput(check.name)}
                            >
                              📁 Download Output for {check.name}
                            </Button>
                          )}
                        </div>
                        {!check.hasOutput && (
                          <p className="text-sm text-muted-foreground">No output file generated.</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Check Type</p>
                            <p className="font-medium">{check.check_type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {getStatusBadge(check.status)}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Rows Scanned</p>
                            <p className="font-medium">{check.rows_scanned}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Breaching Rows</p>
                            <p className="font-medium">{check.breaching_rows}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Percentage Breached</p>
                            <p className="font-medium">{check.percentage_breached}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Compound Check</p>
                            <p className="font-medium">{check.compound_check}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>📊 Visualize Numerical Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select metrics to visualize:</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metrics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null_percentage">null_percentage</SelectItem>
                        <SelectItem value="unique_percentage">unique_percentage</SelectItem>
                        <SelectItem value="negative_percentage">negative_percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <Badge variant="destructive" className="mr-2">null_percentage ✕</Badge>
                    <Badge variant="outline">unique_percentage</Badge>
                    <Badge variant="outline">negative_percentage</Badge>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="column" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                      />
                      <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="null_percentage" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Special Character Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>special_character_presence Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[{ name: 'false', value: 100, color: '#3b82f6' }]}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary Table for Stage 2 */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Summary Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>column_name</TableHead>
                        <TableHead>datatype</TableHead>
                        <TableHead>null_count</TableHead>
                        <TableHead>not_null_count</TableHead>
                        <TableHead>null_percentage</TableHead>
                        <TableHead>unique_count</TableHead>
                        <TableHead>unique_percentage</TableHead>
                        <TableHead>is_constant</TableHead>
                        <TableHead>zero_count</TableHead>
                        <TableHead>zero_percentage</TableHead>
                        <TableHead>negative_count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.detailedSummaryTable?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.column_name}</TableCell>
                          <TableCell>{row.datatype}</TableCell>
                          <TableCell>{row.null_count}</TableCell>
                          <TableCell>{row.not_null_count}</TableCell>
                          <TableCell>{row.null_percentage}</TableCell>
                          <TableCell>{row.unique_count}</TableCell>
                          <TableCell>{row.unique_percentage}</TableCell>
                          <TableCell>{row.is_constant}</TableCell>
                          <TableCell>{row.zero_count}</TableCell>
                          <TableCell>{row.zero_percentage}</TableCell>
                          <TableCell>{row.negative_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (stageNumber === 3) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl">{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Anomaly Detection KPIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Anomaly Detection KPIs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Model Type</p>
                <p className="text-2xl font-bold">Anomaly Detection</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Model Name</p>
                <p className="text-2xl font-bold">Isolation Forest</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number Of Features Used</p>
                <p className="text-2xl font-bold">9</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number Of Anomalies Found</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Anomaly Score Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium">Anomaly Score Histogram</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-red-600 mr-2">Threshold (0)</span>
                <div className="w-4 h-0.5 bg-red-600"></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.anomalyScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="frequency" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PCA Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Anomaly vs Normal Data Scatter Plot (PCA)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium">PCA Projection of Anomalies</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-sm">Normal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-sm">Anomaly</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={data.pcaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pca1" label={{ value: 'PCA1', position: 'insideBottom', offset: -5 }} />
                <YAxis dataKey="pca2" label={{ value: 'PCA2', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Scatter dataKey="pca2" fill="#10b981" />
                <Scatter dataKey="pca2" fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anomaly Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Anomaly Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.anomalyTableColumns?.map((column: string, index: number) => (
                      <TableHead key={index}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.anomalyEntries?.map((row: any, index: number) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, cellIndex: number) => (
                        <TableCell key={cellIndex}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    </div>
  );
};