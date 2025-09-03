import React, { useState } from "react";
import { DQProject, DQRun } from "./lib/types";

export const searchBarColor = "#a1a7b2";
export const searchBarTextColor = "#ffffff";
export const TitleHeaderColor = "#0383d3";

export const initialTitleHeader = "Dashboard";

export const initialProjects: DQProject[] = [
  {
    "id": "proj-001",
    "name": "AT&T CleanStream",
    "status": "active",
    "createdBy": "Siddhartha",
    "totalRuns": 25,
    "statusPercent": 65,
    "lastRun": "11:34 am, Today"
  },
  {
    "id": "proj-002",
    "name": "Verizon DataVerify",
    "status": "active",
    "createdBy": "Priya",
    "totalRuns": 18,
    "statusPercent": 88,
    "lastRun": "10:04 am, Today"
  },
  {
    "id": "proj-003",
    "name": "T-Mobile PurePath",
    "status": "active",
    "createdBy": "Siddhartha",
    "totalRuns": "07",
    "statusPercent": 39,
    "lastRun": "09:39 am, Today"
  },
  {
    "id": "proj-004",
    "name": "Internal DQ Forge",
    "status": "In-Active",
    "createdBy": "Admin",
    "totalRuns": 10,
    "statusPercent": 44,
    "lastRun": "08:34 am, Today"
  },
  {
    "id": "proj-005",
    "name": "Project Phoenix",
    "status": "active",
    "createdBy": "Raj",
    "totalRuns": 152,
    "statusPercent": 95,
    "lastRun": "03:15 pm, Yesterday"
  },
  {
    "id": "proj-006",
    "name": "Customer Insights Hub",
    "status": "In-Active",
    "createdBy": "Priya",
    "totalRuns": 4,
    "statusPercent": 20,
    "lastRun": "09:00 am, 24 Aug 2025"
  },
  {
    "id": "proj-007",
    "name": "Logistics Optimizer",
    "status": "active",
    "createdBy": "Siddhartha",
    "totalRuns": 89,
    "statusPercent": 72,
    "lastRun": "05:50 pm, Today"
  },
  {
    "id": "proj-008",
    "name": "Retail Analytics Engine",
    "status": "active",
    "createdBy": "Aarav",
    "totalRuns": "31",
    "statusPercent": 100,
    "lastRun": "01:22 pm, Today"
  },
  {
    "id": "proj-009",
    "name": "Legacy System Bridge",
    "status": "In-Active",
    "createdBy": "Admin",
    "totalRuns": 2,
    "statusPercent": 15,
    "lastRun": "11:00 pm, 22 Aug 2025"
  },
  {
    "id": "proj-010",
    "name": "Marketing Funnel Analysis",
    "status": "active",
    "createdBy": "Priya",
    "totalRuns": 56,
    "statusPercent": 81,
    "lastRun": "04:30 pm, Today"
  }
];

export const initialRuns: DQRun[] = [
  // AT&T CleanStream runs (proj-001)
  {
    id: '1',
    projectId: 'proj-001',
    runId: 'run-001',
    runName: 'AT&T CleanStream Daily Check',
    status: 'success',
    startTime: '2025-01-23 11:34',
    duration: '15m 32s',
    records: 125000,
    errors: 0
  },
  {
    id: '2',
    projectId: 'proj-001',
    runId: 'run-002',
    runName: 'AT&T CleanStream Validation',
    status: 'success',
    startTime: '2025-01-22 14:20',
    duration: '12m 45s',
    records: 118000,
    errors: 3
  },
  {
    id: '3',
    projectId: 'proj-001',
    runId: 'run-003',
    runName: 'AT&T CleanStream QC Run',
    status: 'failed',
    startTime: '2025-01-21 16:15',
    duration: '8m 30s',
    records: 95000,
    errors: 45
  },

  // Verizon DataVerify runs (proj-002)
  {
    id: '4',
    projectId: 'proj-002',
    runId: 'run-004',
    runName: 'Verizon DataVerify Scan',
    status: 'success',
    startTime: '2025-01-23 10:04',
    duration: '18m 12s',
    records: 89000,
    errors: 1
  },
  {
    id: '5',
    projectId: 'proj-002',
    runId: 'run-005',
    runName: 'Verizon DataVerify Check',
    status: 'success',
    startTime: '2025-01-22 09:30',
    duration: '22m 05s',
    records: 92000,
    errors: 0
  },
  {
    id: '6',
    projectId: 'proj-002',
    runId: 'run-006',
    runName: 'Verizon DataVerify Weekly',
    status: 'running',
    startTime: '2025-01-21 13:45',
    duration: '5m 20s',
    records: 45000,
    errors: 2
  },

  // T-Mobile PurePath runs (proj-003)
  {
    id: '7',
    projectId: 'proj-003',
    runId: 'run-007',
    runName: 'T-Mobile PurePath Analysis',
    status: 'success',
    startTime: '2025-01-23 09:39',
    duration: '25m 18s',
    records: 156000,
    errors: 5
  },
  {
    id: '8',
    projectId: 'proj-003',
    runId: 'run-008',
    runName: 'T-Mobile PurePath Validation',
    status: 'failed',
    startTime: '2025-01-22 11:22',
    duration: '6m 42s',
    records: 78000,
    errors: 89
  },

  // Project Phoenix runs (proj-005)
  {
    id: '9',
    projectId: 'proj-005',
    runId: 'run-009',
    runName: 'Project Phoenix Data Audit',
    status: 'success',
    startTime: '2025-01-22 15:15',
    duration: '45m 33s',
    records: 445000,
    errors: 2
  },
  {
    id: '10',
    projectId: 'proj-005',
    runId: 'run-010',
    runName: 'Project Phoenix Quality Check',
    status: 'success',
    startTime: '2025-01-22 08:30',
    duration: '38m 20s',
    records: 389000,
    errors: 0
  },
  {
    id: '11',
    projectId: 'proj-005',
    runId: 'run-011',
    runName: 'Project Phoenix Comprehensive Scan',
    status: 'success',
    startTime: '2025-01-21 14:45',
    duration: '52m 15s',
    records: 512000,
    errors: 1
  },

  // Logistics Optimizer runs (proj-007)
  {
    id: '12',
    projectId: 'proj-007',
    runId: 'run-012',
    runName: 'Logistics Optimizer Daily Run',
    status: 'success',
    startTime: '2025-01-23 17:50',
    duration: '28m 45s',
    records: 234000,
    errors: 8
  },
  {
    id: '13',
    projectId: 'proj-007',
    runId: 'run-013',
    runName: 'Logistics Optimizer QC',
    status: 'failed',
    startTime: '2025-01-22 16:20',
    duration: '15m 30s',
    records: 145000,
    errors: 67
  },

  // Retail Analytics Engine runs (proj-008)
  {
    id: '14',
    projectId: 'proj-008',
    runId: 'run-014',
    runName: 'Retail Analytics Engine Check',
    status: 'success',
    startTime: '2025-01-23 13:22',
    duration: '35m 18s',
    records: 298000,
    errors: 0
  },
  {
    id: '15',
    projectId: 'proj-008',
    runId: 'run-015',
    runName: 'Retail Analytics Full Scan',
    status: 'success',
    startTime: '2025-01-22 10:15',
    duration: '42m 12s',
    records: 356000,
    errors: 0
  },

  // Marketing Funnel Analysis runs (proj-010)
  {
    id: '16',
    projectId: 'proj-010',
    runId: 'run-016',
    runName: 'Marketing Funnel Analysis Run',
    status: 'running',
    startTime: '2025-01-23 16:30',
    duration: '12m 30s',
    records: 189000,
    errors: 3
  },
  {
    id: '17',
    projectId: 'proj-010',
    runId: 'run-017',
    runName: 'Marketing Funnel Weekly Check',
    status: 'success',
    startTime: '2025-01-22 14:45',
    duration: '31m 25s',
    records: 267000,
    errors: 2
  },

  // Internal DQ Forge runs (proj-004)
  {
    id: '18',
    projectId: 'proj-004',
    runId: 'run-018',
    runName: 'Internal DQ Forge Validation',
    status: 'paused',
    startTime: '2025-01-23 08:34',
    duration: '8m 45s',
    records: 67000,
    errors: 12
  }
];
