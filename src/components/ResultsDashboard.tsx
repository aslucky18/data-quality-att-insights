
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import { StageResults } from "./StageResults";
import { AlertManagement } from "./AlertManagement";

interface ResultsDashboardProps {
  results: any;
  onBack: () => void;
}

export const ResultsDashboard = ({ results, onBack }: ResultsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("stage1");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h2>
          <p className="text-gray-600">Data Quality Assessment completed successfully</p>
        </div>
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Dashboard</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87.5%</div>
            <p className="text-xs text-muted-foreground">Data Quality Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">142</div>
            <p className="text-xs text-muted-foreground">Anomalies detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-muted-foreground">Overall assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Stage Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stage1">Stage 1: Basic Checks</TabsTrigger>
          <TabsTrigger value="stage2">Stage 2: Quality Metrics</TabsTrigger>
          <TabsTrigger value="stage3">Stage 3: Anomaly Detection</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
        </TabsList>

        <TabsContent value="stage1">
          <StageResults
            title="Basic Data Checks"
            description="Fundamental data structure and integrity analysis"
            data={results.stage1}
            stageNumber={1}
          />
        </TabsContent>

        <TabsContent value="stage2">
          <StageResults
            title="Data Quality Metrics"
            description="Comprehensive quality assessment including completeness, consistency, and accuracy"
            data={results.stage2}
            stageNumber={2}
          />
        </TabsContent>

        <TabsContent value="stage3">
          <StageResults
            title="Anomaly Detection Results"
            description="AI/ML-powered anomaly detection and classification"
            data={results.stage3}
            stageNumber={3}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
