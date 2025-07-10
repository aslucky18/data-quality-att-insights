
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Settings, Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const AlertManagement = () => {
  const [alerts] = useState([
    {
      id: 1,
      title: "High Anomaly Count",
      description: "Anomaly count exceeded threshold (>100)",
      severity: "high",
      threshold: 100,
      currentValue: 142,
      status: "active"
    },
    {
      id: 2,
      title: "Data Quality Score Low",
      description: "Overall data quality score below 90%",
      severity: "medium",
      threshold: 90,
      currentValue: 87.5,
      status: "active"
    },
    {
      id: 3,
      title: "Duplicate Rows Detected",
      description: "Number of duplicate rows exceeded acceptable limit",
      severity: "low",
      threshold: 0,
      currentValue: 0,
      status: "resolved"
    }
  ]);

  const [correctiveActions] = useState([
    {
      id: 1,
      type: "update_cell",
      description: "Update invalid email format in record ID 12345",
      targetTable: "customers",
      targetColumn: "email",
      targetRow: "12345",
      newValue: "corrected@email.com",
      status: "pending"
    },
    {
      id: 2,
      type: "remove_duplicate",
      description: "Remove duplicate record with same customer ID",
      targetTable: "customers",
      targetRow: "67890",
      status: "completed"
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'resolved': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const handleExecuteAction = (actionId: number) => {
    toast({
      title: "Action Executed",
      description: `Corrective action ${actionId} has been executed successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Alert Configuration</span>
          </CardTitle>
          <CardDescription>
            Set up thresholds and notifications for data quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Metric</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anomaly_count">Anomaly Count</SelectItem>
                  <SelectItem value="quality_score">Data Quality Score</SelectItem>
                  <SelectItem value="completeness">Completeness %</SelectItem>
                  <SelectItem value="duplicate_rows">Duplicate Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold Value</Label>
              <Input type="number" placeholder="Enter threshold" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                  <SelectItem value="equal_to">Equal to</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create Alert Rule
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Active Alerts</span>
          </CardTitle>
          <CardDescription>
            Current alerts triggered by data quality threshold breaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(alert.status)}>
                      {alert.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="text-xs text-gray-500">
                    Threshold: {alert.threshold} | Current: {alert.currentValue}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Corrective Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Corrective Actions</span>
          </CardTitle>
          <CardDescription>
            Recommended and executed corrective actions for data quality issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correctiveActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{action.type.replace('_', ' ').toUpperCase()}</h4>
                    <Badge variant={getStatusColor(action.status)}>
                      {action.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                  <div className="text-xs text-gray-500">
                    Table: {action.targetTable} 
                    {action.targetColumn && ` | Column: ${action.targetColumn}`}
                    {action.targetRow && ` | Row: ${action.targetRow}`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {action.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleExecuteAction(action.id)}
                    >
                      Execute
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
