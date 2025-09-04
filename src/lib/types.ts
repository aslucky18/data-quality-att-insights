export interface DQProject {
  id: string;
  name: string;
  status: 'active' | 'In-Active' ;
  createdBy: string;
  published: boolean;
  totalRuns: number | string;
  statusPercent: number;
  lastRun: string;
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
}