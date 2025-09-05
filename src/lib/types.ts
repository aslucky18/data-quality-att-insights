export interface DQProject {
  id: string;
  name: string;
  status: 'active' | 'In-Active' ;
  createdBy: string;
  published: boolean;
  totalRuns: number | string;
  statusPercent: number;
  lastRun: Date;
  createdAt: Date; 
}
export interface DQRun {
  id: string;
  projectId: string;
  runId: string;
  runName: string;
  status: 'success' | 'failed' | 'running' | 'paused';
  startTime: string;
  duration: string;
  records: number;
  errors: number;
  alerts: string; // added alerts property
  isSelected?: boolean; // added optional property for selection state
}

export interface DQInsights {
  id: string;
  runId: string; // primary foreign key
  projectId: string; // secondary foreign key
  dataOverview: {
    columns: number;
    rows: number;
    integerColumns: number;
    booleanColumns: number;
  };
  dataTypeDistribution: Array<{
    name: string;
    value: number;
  }>;
  anomalies: Array<{
    name: string;
    value: number;
  }>;
  createdAt: string;
}