import React, { useState } from "react";
import { DQProject, DQRun } from "./lib/types";

export const searchBarColor = "#a1a7b2";
export const searchBarTextColor = "#ffffff";
export const TitleHeaderColor = "#0383d3";

export const initialTitleHeader = "Dashboard";

export const initialProjects: DQProject[] = [
  {
    id: "proj-011",
    name: "Neural Metrics Engine",
    status: "active",
    createdBy: "Aarav",
    totalRuns: 122,
    statusPercent: 91,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-012",
    name: "AI Customer Insights",
    status: "In-Active",
    createdBy: "Raj",
    totalRuns: 37,
    statusPercent: 76,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-013",
    name: "WeatherSense Platform",
    status: "active",
    createdBy: "Admin",
    totalRuns: 158,
    statusPercent: 34,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-014",
    name: "Quantum Logistics Tracker",
    status: "active",
    createdBy: "Raj",
    totalRuns: 71,
    statusPercent: 40,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-015",
    name: "VisionGuard AI",
    status: "In-Active",
    createdBy: "Siddhartha",
    totalRuns: 144,
    statusPercent: 58,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-016",
    name: "SmartMed Diagnostics",
    status: "active",
    createdBy: "Priya",
    totalRuns: 84,
    statusPercent: 59,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-017",
    name: "FinEdge Analyzer",
    status: "active",
    createdBy: "Admin",
    totalRuns: 187,
    statusPercent: 85,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-018",
    name: "EduStream Data Monitor",
    status: "In-Active",
    createdBy: "Aarav",
    totalRuns: 113,
    statusPercent: 96,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-019",
    name: "CyberDefense AI",
    status: "active",
    createdBy: "Raj",
    totalRuns: 26,
    statusPercent: 66,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-020",
    name: "AutoSense Vehicle Data",
    status: "In-Active",
    createdBy: "Aarav",
    totalRuns: 59,
    statusPercent: 99,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-021",
    name: "UrbanFlow Tracker",
    status: "active",
    createdBy: "Priya",
    totalRuns: 53,
    statusPercent: 48,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-022",
    name: "CropYield Predictor",
    status: "In-Active",
    createdBy: "Siddhartha",
    totalRuns: 32,
    statusPercent: 15,
    lastRun: "01:43 PM, Today",
    published: false
  },
  {
    id: "proj-023",
    name: "Retail Dynamics Model",
    status: "active",
    createdBy: "Raj",
    totalRuns: 17,
    statusPercent: 71,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-024",
    name: "FlightOps Analyzer",
    status: "In-Active",
    createdBy: "Priya",
    totalRuns: 134,
    statusPercent: 61,
    lastRun: "01:43 PM, Today",
    published: true
  },
  {
    id: "proj-025",
    name: "OceanWatch System",
    status: "active",
    createdBy: "Siddhartha",
    totalRuns: 42,
    statusPercent: 78,
    lastRun: "01:43 PM, Today",
    published: true
  }
];

export const initialRuns: DQRun[] = [
  // Neural Metrics Engine (proj-011)
  {
    id: '1',
    projectId: 'proj-011',
    runId: 'run-001',
    runName: 'Run 1 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:13',
    duration: '42m 12s',
    records: 202345,
    errors: 0,
    alerts: 'No alerts'
  },
  {
    id: '2',
    projectId: 'proj-011',
    runId: 'run-002',
    runName: 'Run 2 - QC',
    status: 'failed',
    startTime: '2025-09-04 10:44',
    duration: '35m 47s',
    records: 151238,
    errors: 27,
    alerts: 'Connection timeout'
  },
  {
    id: '3',
    projectId: 'proj-011',
    runId: 'run-003',
    runName: 'Run 3 - Audit',
    status: 'running',
    startTime: '2025-09-04 09:50',
    duration: '12m 10s',
    records: 78412,
    errors: 3,
    alerts: 'Low throughput'
  },
  {
    id: '4',
    projectId: 'proj-011',
    runId: 'run-004',
    runName: 'Run 4 - Check',
    status: 'paused',
    startTime: '2025-09-04 08:33',
    duration: '25m 00s',
    records: 118733,
    errors: 7,
    alerts: 'Paused manually'
  },
  {
    id: '5',
    projectId: 'proj-011',
    runId: 'run-005',
    runName: 'Run 5 - Sync',
    status: 'success',
    startTime: '2025-09-04 07:20',
    duration: '18m 29s',
    records: 164000,
    errors: 0,
    alerts: 'No alerts'
  },

  // AI Customer Insights (proj-012)
  {
    id: '6',
    projectId: 'proj-012',
    runId: 'run-006',
    runName: 'Run 6 - Validation',
    status: 'success',
    startTime: '2025-09-04 11:15',
    duration: '22m 40s',
    records: 123456,
    errors: 0,
    alerts: 'No alerts'
  },
  {
    id: '7',
    projectId: 'proj-012',
    runId: 'run-007',
    runName: 'Run 7 - QC',
    status: 'failed',
    startTime: '2025-09-04 10:05',
    duration: '30m 19s',
    records: 98000,
    errors: 14,
    alerts: 'Schema mismatch'
  },
  {
    id: '8',
    projectId: 'proj-012',
    runId: 'run-008',
    runName: 'Run 8 - Audit',
    status: 'success',
    startTime: '2025-09-04 09:00',
    duration: '25m 44s',
    records: 110000,
    errors: 0,
    alerts: 'No alerts'
  },
  {
    id: '9',
    projectId: 'proj-012',
    runId: 'run-009',
    runName: 'Run 9 - Check',
    status: 'paused',
    startTime: '2025-09-04 08:20',
    duration: '16m 02s',
    records: 93000,
    errors: 5,
    alerts: 'Paused manually'
  },
  {
    id: '10',
    projectId: 'proj-012',
    runId: 'run-010',
    runName: 'Run 10 - Sync',
    status: 'running',
    startTime: '2025-09-04 07:00',
    duration: '10m 10s',
    records: 107000,
    errors: 1,
    alerts: 'Low throughput'
  },

  // WeatherSense Platform (proj-013)
  {
    id: '11',
    projectId: 'proj-013',
    runId: 'run-011',
    runName: 'Run 11 - Validation',
    status: 'success',
    startTime: '2025-09-04 10:45',
    duration: '40m 10s',
    records: 223400,
    errors: 0,
    alerts: 'No alerts'
  },
  {
    id: '12',
    projectId: 'proj-013',
    runId: 'run-012',
    runName: 'Run 12 - QC',
    status: 'failed',
    startTime: '2025-09-04 09:30',
    duration: '17m 08s',
    records: 102000,
    errors: 32,
    alerts: 'Incomplete input'
  },
  {
    id: '13',
    projectId: 'proj-013',
    runId: 'run-013',
    runName: 'Run 13 - Audit',
    status: 'running',
    startTime: '2025-09-04 08:20',
    duration: '12m 44s',
    records: 89000,
    errors: 4,
    alerts: 'Low throughput'
  },
  {
    id: '14',
    projectId: 'proj-013',
    runId: 'run-014',
    runName: 'Run 14 - Check',
    status: 'paused',
    startTime: '2025-09-04 07:30',
    duration: '15m 22s',
    records: 100000,
    errors: 6,
    alerts: 'Paused manually'
  },
  {
    id: '15',
    projectId: 'proj-013',
    runId: 'run-015',
    runName: 'Run 15 - Sync',
    status: 'success',
    startTime: '2025-09-04 06:45',
    duration: '20m 11s',
    records: 178000,
    errors: 0,
    alerts: 'No alerts'
  },

  // The rest (proj-014 to proj-025) continues below...
];