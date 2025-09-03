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
  {
    id: '1',
    projectId: '1',
    runId: 'run-001',
    runName: 'Customer Data Validation Run',
    status: 'success',
    startTime: '2025-01-22 14:30',
    duration: '15m 32s',
    records: 125000,
    errors: 0
  },
  {
    id: '2',
    projectId: '2',
    runId: 'run-002',
    runName: 'Financial Records QC Run',
    status: 'failed',
    startTime: '2025-01-22 13:15',
    duration: '3m 12s',
    records: 8450,
    errors: 45
  },
  {
    id: '3',
    projectId: '3',
    runId: 'run-003',
    runName: 'Inventory Data Check Run',
    status: 'running',
    startTime: '2025-01-22 15:00',
    duration: '5m 20s',
    records: 45000,
    errors: 2
  },
  {
    id: '4',
    projectId: '1',
    runId: 'run-004',
    runName: 'Customer Data Validation Run',
    status: 'paused',
    startTime: '2025-01-22 12:30',
    duration: '8m 45s',
    records: 67000,
    errors: 1
  }
];
