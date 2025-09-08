import React, { useState } from "react";
import { DQProject, DQRun, DQInsights } from "./lib/types";

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
    lastRun: new Date(1615790520000 + Math.random() * (Date.now() - 1615790520000)),
    published: true,
    createdAt: new Date(1615790520000) // 2021-03-15T10:22:00Z
  },
  {
    id: "proj-012",
    name: "AI Customer Insights",
    status: "In-Active",
    createdBy: "Raj",
    totalRuns: 37,
    statusPercent: 76,
    lastRun: new Date(1718116860000 + Math.random() * (Date.now() - 1718116860000)),
    published: true,
    createdAt: new Date(1718116860000) // 2024-06-11T14:41:00Z
  },
  {
    id: "proj-013",
    name: "WeatherSense Platform",
    status: "active",
    createdBy: "Admin",
    totalRuns: 158,
    statusPercent: 34,
    lastRun: new Date(1606128540000 + Math.random() * (Date.now() - 1606128540000)),
    published: false,
    createdAt: new Date(1606128540000) // 2020-11-23T08:09:00Z
  },
  {
    id: "proj-014",
    name: "Quantum Logistics Tracker",
    status: "active",
    createdBy: "Raj",
    totalRuns: 71,
    statusPercent: 40,
    lastRun: new Date(1685441700000 + Math.random() * (Date.now() - 1685441700000)),
    published: false,
    createdAt: new Date(1685441700000) // 2023-05-30T12:55:00Z
  },
  {
    id: "proj-015",
    name: "VisionGuard AI",
    status: "In-Active",
    createdBy: "Siddhartha",
    totalRuns: 144,
    statusPercent: 58,
    lastRun: new Date(1663496220000 + Math.random() * (Date.now() - 1663496220000)),
    published: false,
    createdAt: new Date(1663496220000) // 2022-09-18T07:37:00Z
  },
  {
    id: "proj-016",
    name: "SmartMed Diagnostics",
    status: "active",
    createdBy: "Priya",
    totalRuns: 84,
    statusPercent: 59,
    lastRun: new Date(1638884940000 + Math.random() * (Date.now() - 1638884940000)),
    published: false,
    createdAt: new Date(1638884940000) // 2021-12-07T16:29:00Z
  },
  {
    id: "proj-017",
    name: "FinEdge Analyzer",
    status: "active",
    createdBy: "Admin",
    totalRuns: 187,
    statusPercent: 85,
    lastRun: new Date(1705921920000 + Math.random() * (Date.now() - 1705921920000)),
    published: true,
    createdAt: new Date(1705921920000) // 2024-01-22T11:12:00Z
  },
  {
    id: "proj-018",
    name: "EduStream Data Monitor",
    status: "In-Active",
    createdBy: "Aarav",
    totalRuns: 113,
    statusPercent: 96,
    lastRun: new Date(1585907100000 + Math.random() * (Date.now() - 1585907100000)),
    published: false,
    createdAt: new Date(1585907100000) // 2020-04-03T09:45:00Z
  },
  {
    id: "proj-019",
    name: "CyberDefense AI",
    status: "active",
    createdBy: "Raj",
    totalRuns: 26,
    statusPercent: 66,
    lastRun: new Date(1689343080000 + Math.random() * (Date.now() - 1689343080000)),
    published: false,
    createdAt: new Date(1689343080000) // 2023-07-14T13:58:00Z
  },
  {
    id: "proj-020",
    name: "AutoSense Vehicle Data",
    status: "In-Active",
    createdBy: "Aarav",
    totalRuns: 59,
    statusPercent: 99,
    lastRun: new Date(1648567500000 + Math.random() * (Date.now() - 1648567500000)),
    published: true,
    createdAt: new Date(1648567500000) // 2022-03-29T15:25:00Z
  },
  {
    id: "proj-021",
    name: "UrbanFlow Tracker",
    status: "active",
    createdBy: "Priya",
    totalRuns: 53,
    statusPercent: 48,
    lastRun: new Date(1739341980000 + Math.random() * (Date.now() - 1739341980000)),
    published: false,
    createdAt: new Date(1739341980000) // 2025-02-12T06:33:00Z
  },
  {
    id: "proj-022",
    name: "CropYield Predictor",
    status: "In-Active",
    createdBy: "Siddhartha",
    totalRuns: 32,
    statusPercent: 15,
    lastRun: new Date(1628187000000 + Math.random() * (Date.now() - 1628187000000)),
    published: false,
    createdAt: new Date(1628187000000) // 2021-08-05T18:10:00Z
  },
  {
    id: "proj-023",
    name: "Retail Dynamics Model",
    status: "active",
    createdBy: "Raj",
    totalRuns: 17,
    statusPercent: 71,
    lastRun: new Date(1603226820000 + Math.random() * (Date.now() - 1603226820000)),
    published: true,
    createdAt: new Date(1603226820000) // 2020-10-20T20:47:00Z
  },
  {
    id: "proj-024",
    name: "FlightOps Analyzer",
    status: "In-Active",
    createdBy: "Priya",
    totalRuns: 134,
    statusPercent: 61,
    lastRun: new Date(1693585260000 + Math.random() * (Date.now() - 1693585260000)),
    published: true,
    createdAt: new Date(1693585260000) // 2023-09-01T19:01:00Z
  },
  {
    id: "proj-025",
    name: "OceanWatch System",
    status: "active",
    createdBy: "Siddhartha",
    totalRuns: 42,
    statusPercent: 78,
    lastRun: new Date(1731141300000 + Math.random() * (Date.now() - 1731141300000)),
    published: true,
    createdAt: new Date(1731141300000) // 2024-11-09T05:55:00Z
  }
];


export const initialRuns: DQRun[] = [
  // Quantum Logistics Tracker (proj-014)
  {
    id: '16',
    projectId: 'proj-014',
    runId: 'run-016',
    runName: 'Run 16 - Validation',
    status: 'success',
    startTime: '2025-09-04 11:40',
    duration: '38m 22s',
    records: 134500,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '17',
    projectId: 'proj-014',
    runId: 'run-017',
    runName: 'Run 17 - QC',
    status: 'failed',
    startTime: '2025-09-04 10:50',
    duration: '21m 11s',
    records: 120300,
    errors: 12,
    alerts: '3/3'
  },
  {
    id: '18',
    projectId: 'proj-014',
    runId: 'run-018',
    runName: 'Run 18 - Audit',
    status: 'running',
    startTime: '2025-09-04 09:40',
    duration: '15m 40s',
    records: 118000,
    errors: 3,
    alerts: '2/3'
  },
  {
    id: '19',
    projectId: 'proj-014',
    runId: 'run-019',
    runName: 'Run 19 - Check',
    status: 'paused',
    startTime: '2025-09-04 08:30',
    duration: '19m 02s',
    records: 126700,
    errors: 5,
    alerts: '1/3'
  },
  {
    id: '20',
    projectId: 'proj-014',
    runId: 'run-020',
    runName: 'Run 20 - Sync',
    status: 'success',
    startTime: '2025-09-04 07:20',
    duration: '14m 58s',
    records: 133000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '21',
    projectId: 'proj-014',
    runId: 'run-021',
    runName: 'Run 21 - Training',
    status: 'success',
    startTime: '2025-09-04 06:40',
    duration: '45m 05s',
    records: 142000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '22',
    projectId: 'proj-014',
    runId: 'run-022',
    runName: 'Run 22 - Review',
    status: 'failed',
    startTime: '2025-09-04 06:00',
    duration: '22m 15s',
    records: 115800,
    errors: 8,
    alerts: '3/3'
  },

  // VisionGuard AI (proj-015)
  {
    id: '23',
    projectId: 'proj-015',
    runId: 'run-023',
    runName: 'Run 23 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:20',
    duration: '33m 19s',
    records: 165000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '24',
    projectId: 'proj-015',
    runId: 'run-024',
    runName: 'Run 24 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:05',
    duration: '29m 41s',
    records: 142300,
    errors: 15,
    alerts: '2/3'
  },
  {
    id: '25',
    projectId: 'proj-015',
    runId: 'run-025',
    runName: 'Run 25 - Audit',
    status: 'running',
    startTime: '2025-09-04 10:10',
    duration: '13m 22s',
    records: 152400,
    errors: 2,
    alerts: '2/3'
  },
  {
    id: '26',
    projectId: 'proj-015',
    runId: 'run-026',
    runName: 'Run 26 - Check',
    status: 'paused',
    startTime: '2025-09-04 09:15',
    duration: '18m 00s',
    records: 147000,
    errors: 6,
    alerts: '1/3'
  },
  {
    id: '27',
    projectId: 'proj-015',
    runId: 'run-027',
    runName: 'Run 27 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:30',
    duration: '25m 48s',
    records: 159000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '28',
    projectId: 'proj-015',
    runId: 'run-028',
    runName: 'Run 28 - Training',
    status: 'success',
    startTime: '2025-09-04 07:40',
    duration: '40m 33s',
    records: 161200,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '29',
    projectId: 'proj-015',
    runId: 'run-029',
    runName: 'Run 29 - Review',
    status: 'failed',
    startTime: '2025-09-04 07:00',
    duration: '19m 55s',
    records: 140500,
    errors: 10,
    alerts: '3/3'
  },

  // SmartMed Diagnostics (proj-016)
  {
    id: '30',
    projectId: 'proj-016',
    runId: 'run-030',
    runName: 'Run 30 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:40',
    duration: '36m 20s',
    records: 95000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '31',
    projectId: 'proj-016',
    runId: 'run-031',
    runName: 'Run 31 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:20',
    duration: '28m 40s',
    records: 88000,
    errors: 9,
    alerts: '2/3'
  },
  {
    id: '32',
    projectId: 'proj-016',
    runId: 'run-032',
    runName: 'Run 32 - Audit',
    status: 'running',
    startTime: '2025-09-04 10:30',
    duration: '12m 11s',
    records: 93000,
    errors: 2,
    alerts: '3/3'
  },
  {
    id: '33',
    projectId: 'proj-016',
    runId: 'run-033',
    runName: 'Run 33 - Check',
    status: 'paused',
    startTime: '2025-09-04 09:50',
    duration: '20m 05s',
    records: 91000,
    errors: 5,
    alerts: '1/3'
  },
  {
    id: '34',
    projectId: 'proj-016',
    runId: 'run-034',
    runName: 'Run 34 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:20',
    duration: '15m 18s',
    records: 96000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '35',
    projectId: 'proj-016',
    runId: 'run-035',
    runName: 'Run 35 - Training',
    status: 'success',
    startTime: '2025-09-04 07:50',
    duration: '38m 09s',
    records: 97500,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '36',
    projectId: 'proj-016',
    runId: 'run-036',
    runName: 'Run 36 - Review',
    status: 'failed',
    startTime: '2025-09-04 07:10',
    duration: '23m 14s',
    records: 89000,
    errors: 7,
    alerts: '3/3'
  },
  // DataHarmony (proj-017)
  {
    id: '37',
    projectId: 'proj-017',
    runId: 'run-037',
    runName: 'Run 37 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:15',
    duration: '32m 19s',
    records: 120500,
    errors: 3,
    alerts: '2/3'
  },
  {
    id: '38',
    projectId: 'proj-017',
    runId: 'run-038',
    runName: 'Run 38 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:00',
    duration: '25m 40s',
    records: 110200,
    errors: 17,
    alerts: '3/3'
  },
  {
    id: '39',
    projectId: 'proj-017',
    runId: 'run-039',
    runName: 'Run 39 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:10',
    duration: '19m 25s',
    records: 117000,
    errors: 5,
    alerts: '1/3'
  },
  {
    id: '40',
    projectId: 'proj-017',
    runId: 'run-040',
    runName: 'Run 40 - Check',
    status: 'running',
    startTime: '2025-09-04 09:30',
    duration: '15m 18s',
    records: 124000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '41',
    projectId: 'proj-017',
    runId: 'run-041',
    runName: 'Run 41 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:50',
    duration: '28m 14s',
    records: 129000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '42',
    projectId: 'proj-017',
    runId: 'run-042',
    runName: 'Run 42 - Training',
    status: 'paused',
    startTime: '2025-09-04 07:40',
    duration: '40m 00s',
    records: 115000,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '43',
    projectId: 'proj-017',
    runId: 'run-043',
    runName: 'Run 43 - Review',
    status: 'success',
    startTime: '2025-09-04 06:55',
    duration: '22m 33s',
    records: 118500,
    errors: 4,
    alerts: '2/3'
  },

  // AgriNext Analytics (proj-018)
  {
    id: '44',
    projectId: 'proj-018',
    runId: 'run-044',
    runName: 'Run 44 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:30',
    duration: '34m 45s',
    records: 103400,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '45',
    projectId: 'proj-018',
    runId: 'run-045',
    runName: 'Run 45 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:10',
    duration: '27m 10s',
    records: 96000,
    errors: 22,
    alerts: '3/3'
  },
  {
    id: '46',
    projectId: 'proj-018',
    runId: 'run-046',
    runName: 'Run 46 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:30',
    duration: '16m 22s',
    records: 101000,
    errors: 2,
    alerts: '1/3'
  },
  {
    id: '47',
    projectId: 'proj-018',
    runId: 'run-047',
    runName: 'Run 47 - Check',
    status: 'running',
    startTime: '2025-09-04 09:50',
    duration: '20m 05s',
    records: 99000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '48',
    projectId: 'proj-018',
    runId: 'run-048',
    runName: 'Run 48 - Sync',
    status: 'success',
    startTime: '2025-09-04 09:10',
    duration: '24m 40s',
    records: 102300,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '49',
    projectId: 'proj-018',
    runId: 'run-049',
    runName: 'Run 49 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:20',
    duration: '37m 00s',
    records: 97000,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '50',
    projectId: 'proj-018',
    runId: 'run-050',
    runName: 'Run 50 - Review',
    status: 'success',
    startTime: '2025-09-04 07:30',
    duration: '23m 11s',
    records: 101500,
    errors: 6,
    alerts: '2/3'
  },

  // BioStream Insights (proj-019)
  {
    id: '51',
    projectId: 'proj-019',
    runId: 'run-051',
    runName: 'Run 51 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:10',
    duration: '29m 15s',
    records: 84500,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '52',
    projectId: 'proj-019',
    runId: 'run-052',
    runName: 'Run 52 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:00',
    duration: '22m 40s',
    records: 80200,
    errors: 19,
    alerts: '3/3'
  },
  {
    id: '53',
    projectId: 'proj-019',
    runId: 'run-053',
    runName: 'Run 53 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:15',
    duration: '14m 18s',
    records: 83000,
    errors: 3,
    alerts: '1/3'
  },
  {
    id: '54',
    projectId: 'proj-019',
    runId: 'run-054',
    runName: 'Run 54 - Check',
    status: 'running',
    startTime: '2025-09-04 09:40',
    duration: '18m 40s',
    records: 82500,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '55',
    projectId: 'proj-019',
    runId: 'run-055',
    runName: 'Run 55 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:50',
    duration: '21m 22s',
    records: 84000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '56',
    projectId: 'proj-019',
    runId: 'run-056',
    runName: 'Run 56 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:10',
    duration: '39m 40s',
    records: 81500,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '57',
    projectId: 'proj-019',
    runId: 'run-057',
    runName: 'Run 57 - Review',
    status: 'success',
    startTime: '2025-09-04 07:25',
    duration: '20m 12s',
    records: 83500,
    errors: 5,
    alerts: '2/3'
  },
  // AutoSense Vehicle Data (proj-020)
  {
    id: '58',
    projectId: 'proj-020',
    runId: 'run-058',
    runName: 'Run 58 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:40',
    duration: '31m 22s',
    records: 91000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '59',
    projectId: 'proj-020',
    runId: 'run-059',
    runName: 'Run 59 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:20',
    duration: '26m 33s',
    records: 87500,
    errors: 15,
    alerts: '3/3'
  },
  {
    id: '60',
    projectId: 'proj-020',
    runId: 'run-060',
    runName: 'Run 60 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:40',
    duration: '18m 50s',
    records: 90500,
    errors: 2,
    alerts: '1/3'
  },
  {
    id: '61',
    projectId: 'proj-020',
    runId: 'run-061',
    runName: 'Run 61 - Check',
    status: 'running',
    startTime: '2025-09-04 09:55',
    duration: '15m 40s',
    records: 92000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '62',
    projectId: 'proj-020',
    runId: 'run-062',
    runName: 'Run 62 - Sync',
    status: 'success',
    startTime: '2025-09-04 09:05',
    duration: '20m 14s',
    records: 94000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '63',
    projectId: 'proj-020',
    runId: 'run-063',
    runName: 'Run 63 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:25',
    duration: '38m 30s',
    records: 89000,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '64',
    projectId: 'proj-020',
    runId: 'run-064',
    runName: 'Run 64 - Review',
    status: 'success',
    startTime: '2025-09-04 07:40',
    duration: '21m 12s',
    records: 93000,
    errors: 4,
    alerts: '2/3'
  },

  // UrbanFlow Tracker (proj-021)
  {
    id: '65',
    projectId: 'proj-021',
    runId: 'run-065',
    runName: 'Run 65 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:05',
    duration: '28m 14s',
    records: 78000,
    errors: 2,
    alerts: '2/3'
  },
  {
    id: '66',
    projectId: 'proj-021',
    runId: 'run-066',
    runName: 'Run 66 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:15',
    duration: '24m 22s',
    records: 76000,
    errors: 13,
    alerts: '3/3'
  },
  {
    id: '67',
    projectId: 'proj-021',
    runId: 'run-067',
    runName: 'Run 67 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:20',
    duration: '16m 33s',
    records: 77000,
    errors: 1,
    alerts: '1/3'
  },
  {
    id: '68',
    projectId: 'proj-021',
    runId: 'run-068',
    runName: 'Run 68 - Check',
    status: 'running',
    startTime: '2025-09-04 09:35',
    duration: '14m 10s',
    records: 78500,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '69',
    projectId: 'proj-021',
    runId: 'run-069',
    runName: 'Run 69 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:45',
    duration: '19m 20s',
    records: 79000,
    errors: 2,
    alerts: '2/3'
  },
  {
    id: '70',
    projectId: 'proj-021',
    runId: 'run-070',
    runName: 'Run 70 - Training',
    status: 'paused',
    startTime: '2025-09-04 07:55',
    duration: '35m 30s',
    records: 75000,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '71',
    projectId: 'proj-021',
    runId: 'run-071',
    runName: 'Run 71 - Review',
    status: 'success',
    startTime: '2025-09-04 07:15',
    duration: '22m 11s',
    records: 79500,
    errors: 5,
    alerts: '2/3'
  },

  // CropYield Predictor (proj-022)
  {
    id: '72',
    projectId: 'proj-022',
    runId: 'run-072',
    runName: 'Run 72 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:25',
    duration: '30m 05s',
    records: 65000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '73',
    projectId: 'proj-022',
    runId: 'run-073',
    runName: 'Run 73 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:10',
    duration: '26m 44s',
    records: 62000,
    errors: 18,
    alerts: '3/3'
  },
  {
    id: '74',
    projectId: 'proj-022',
    runId: 'run-074',
    runName: 'Run 74 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:25',
    duration: '17m 10s',
    records: 64000,
    errors: 3,
    alerts: '1/3'
  },
  {
    id: '75',
    projectId: 'proj-022',
    runId: 'run-075',
    runName: 'Run 75 - Check',
    status: 'running',
    startTime: '2025-09-04 09:40',
    duration: '14m 55s',
    records: 66000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '76',
    projectId: 'proj-022',
    runId: 'run-076',
    runName: 'Run 76 - Sync',
    status: 'success',
    startTime: '2025-09-04 08:55',
    duration: '21m 02s',
    records: 67000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '77',
    projectId: 'proj-022',
    runId: 'run-077',
    runName: 'Run 77 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:05',
    duration: '36m 40s',
    records: 61000,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '78',
    projectId: 'proj-022',
    runId: 'run-078',
    runName: 'Run 78 - Review',
    status: 'success',
    startTime: '2025-09-04 07:25',
    duration: '23m 14s',
    records: 66500,
    errors: 6,
    alerts: '2/3'
  },

  // Retail Dynamics Model (proj-023)
  {
    id: '79',
    projectId: 'proj-023',
    runId: 'run-079',
    runName: 'Run 79 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:50',
    duration: '29m 55s',
    records: 71000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '80',
    projectId: 'proj-023',
    runId: 'run-080',
    runName: 'Run 80 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:25',
    duration: '24m 44s',
    records: 69000,
    errors: 14,
    alerts: '3/3'
  },
  {
    id: '81',
    projectId: 'proj-023',
    runId: 'run-081',
    runName: 'Run 81 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:40',
    duration: '16m 15s',
    records: 70500,
    errors: 2,
    alerts: '1/3'
  },
  {
    id: '82',
    projectId: 'proj-023',
    runId: 'run-082',
    runName: 'Run 82 - Check',
    status: 'running',
    startTime: '2025-09-04 09:55',
    duration: '15m 20s',
    records: 72000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '83',
    projectId: 'proj-023',
    runId: 'run-083',
    runName: 'Run 83 - Sync',
    status: 'success',
    startTime: '2025-09-04 09:05',
    duration: '20m 33s',
    records: 73500,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '84',
    projectId: 'proj-023',
    runId: 'run-084',
    runName: 'Run 84 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:15',
    duration: '39m 00s',
    records: 68500,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '85',
    projectId: 'proj-023',
    runId: 'run-085',
    runName: 'Run 85 - Review',
    status: 'success',
    startTime: '2025-09-04 07:35',
    duration: '22m 25s',
    records: 74000,
    errors: 4,
    alerts: '2/3'
  },

  // FlightOps Analyzer (proj-024)
  {
    id: '86',
    projectId: 'proj-024',
    runId: 'run-086',
    runName: 'Run 86 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:15',
    duration: '28m 40s',
    records: 87000,
    errors: 2,
    alerts: '2/3'
  },
  {
    id: '87',
    projectId: 'proj-024',
    runId: 'run-087',
    runName: 'Run 87 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:30',
    duration: '23m 30s',
    records: 85000,
    errors: 19,
    alerts: '3/3'
  },
  {
    id: '88',
    projectId: 'proj-024',
    runId: 'run-088',
    runName: 'Run 88 - Audit',
    status: 'success',
    startTime: '2025-09-04 10:45',
    duration: '17m 15s',
    records: 86000,
    errors: 3,
    alerts: '1/3'
  },
  {
    id: '89',
    projectId: 'proj-024',
    runId: 'run-089',
    runName: 'Run 89 - Check',
    status: 'running',
    startTime: '2025-09-04 10:00',
    duration: '15m 40s',
    records: 88000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '90',
    projectId: 'proj-024',
    runId: 'run-090',
    runName: 'Run 90 - Sync',
    status: 'success',
    startTime: '2025-09-04 09:15',
    duration: '20m 10s',
    records: 89500,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '91',
    projectId: 'proj-024',
    runId: 'run-091',
    runName: 'Run 91 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:25',
    duration: '36m 20s',
    records: 84500,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '92',
    projectId: 'proj-024',
    runId: 'run-092',
    runName: 'Run 92 - Review',
    status: 'success',
    startTime: '2025-09-04 07:40',
    duration: '21m 55s',
    records: 90500,
    errors: 5,
    alerts: '2/3'
  },

  // OceanWatch System (proj-025)
  {
    id: '93',
    projectId: 'proj-025',
    runId: 'run-093',
    runName: 'Run 93 - Validation',
    status: 'success',
    startTime: '2025-09-04 12:35',
    duration: '30m 25s',
    records: 95000,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '94',
    projectId: 'proj-025',
    runId: 'run-094',
    runName: 'Run 94 - QC',
    status: 'failed',
    startTime: '2025-09-04 11:50',
    duration: '25m 15s',
    records: 92500,
    errors: 16,
    alerts: '3/3'
  },
  {
    id: '95',
    projectId: 'proj-025',
    runId: 'run-095',
    runName: 'Run 95 - Audit',
    status: 'success',
    startTime: '2025-09-04 11:05',
    duration: '19m 33s',
    records: 94000,
    errors: 2,
    alerts: '1/3'
  },
  {
    id: '96',
    projectId: 'proj-025',
    runId: 'run-096',
    runName: 'Run 96 - Check',
    status: 'running',
    startTime: '2025-09-04 10:20',
    duration: '16m 22s',
    records: 96000,
    errors: 0,
    alerts: '2/3'
  },
  {
    id: '97',
    projectId: 'proj-025',
    runId: 'run-097',
    runName: 'Run 97 - Sync',
    status: 'success',
    startTime: '2025-09-04 09:35',
    duration: '21m 40s',
    records: 97500,
    errors: 1,
    alerts: '2/3'
  },
  {
    id: '98',
    projectId: 'proj-025',
    runId: 'run-098',
    runName: 'Run 98 - Training',
    status: 'paused',
    startTime: '2025-09-04 08:45',
    duration: '37m 10s',
    records: 91500,
    errors: 0,
    alerts: '1/3'
  },
  {
    id: '99',
    projectId: 'proj-025',
    runId: 'run-099',
    runName: 'Run 99 - Review',
    status: 'success',
    startTime: '2025-09-04 08:00',
    duration: '22m 55s',
    records: 98500,
    errors: 4,
    alerts: '2/3'
  }

];

// Generate mock insights data for runs
export const generateInsightsForRun = (run: DQRun, project: DQProject): DQInsights => {
  const baseData = {
    id: `insights-${run.id}`,
    runId: run.id,
    projectId: run.projectId,
    createdAt: run.startTime
  };

  // Generate data based on project and run characteristics
  const seed = parseInt(run.id) + parseInt(project.id.replace('proj-', ''));

  return {
    ...baseData,
    dataOverview: {
      columns: 6 + (seed % 8),
      rows: run.records || (15000 + (seed * 1000) % 50000),
      integerColumns: 1 + (seed % 4),
      booleanColumns: 2 + (seed % 6)
    },
    dataTypeDistribution: [
      { name: 'Int64', value: 30 + (seed % 20) },
      { name: 'Float64', value: 25 + (seed % 15) },
      { name: 'String', value: 20 + (seed % 25) },
      { name: 'Boolean', value: 15 + (seed % 10) }
    ].map(item => ({
      ...item,
      value: Math.round((item.value /
        [30 + (seed % 20), 25 + (seed % 15), 20 + (seed % 25), 15 + (seed % 10)]
          .reduce((sum, val) => sum + val, 0)) * 100 * 100) / 100
    })),
    anomalies: [
      { name: '0.05', value: 100 + (seed % 100) },
      { name: '0.1', value: 150 + (seed % 150) },
      { name: '0.2', value: 80 + (seed % 120) },
      { name: '0.3', value: 120 + (seed % 180) }
    ]
  };
};

export const userdata = [
  {
    id: 'aslucky0143@gmail.com',
    name: 'Alice Johnson',
    email: 'aslucky0143@gmail.com',
    role: 'Admin',
  },];

export const runKey = 'dq-runs';
export const projectKey = 'dq-projects';

{/* User Profiles */ }
export interface User {
  id: string;
  name: string;
  email: string;
  // Using a union type for 'role' makes the type safer,
  // allowing only specific string values.
  role: "Admin" | "User";
  avatarURL: string;
}
const allUsers: User[] = [

  {
    id: "mb065b",
    name: "Michael Brown",
    email: "aslucky0143@gmail.com",
    role: "Admin",
    avatarURL: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    id: "mb065a",
    name: "Michael Ross",
    email: "pemmani.anjaneyulu@accenture.com",
    role: "User",
    avatarURL: "https://randomuser.me/api/portraits/men/75.jpg"
  }
];

{/* Alerts Data */}

export const alertsData = [
  {
    title: 'AT&T CleanStream: Missing Value Percentage Exceeded (the given threshold)',
    description: 'Data quality check failed: 23% of values are missing in the latest run. The threshold requires at least 90% completeness for reliable processing.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T VeriSure: Accuracy Below Requirement',
    description: 'The accuracy rate dropped to 78%, below the target of 85%. Re-examine transformation logic and rule mappings to regain proper quality levels.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T DataPulse: Data Freshness SLA Outstanding',
    description: 'Last refresh occurred 14 hours ago, exceeding our 6-hour freshness SLA. Please check the ingestion pipeline to ensure timely data delivery.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T IntegrityCheck: Duplicate Records Detected',
    description: 'Duplicate entries found in the \'Customer_Profiles\' dataset. Deduplication is required to avoid skewed downstream reporting.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T SchemaGuard: Schema Drift Identified',
    description: 'New columns or types detected compared to expected schema—source sync is out of date. Please align with target schema specifications to prevent data mismatches.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T InsightIQ: Anomaly Detection Threshold Exceeded',
    description: 'Anomaly score has surged above acceptable levels in Run-4152. Investigate the data spike—potential outliers or operational irregularities detected.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T QualityBeacon: High Null Values in Key Fields',
    description: 'Critical field \'billing_amount\' shows 25% nulls—target is under 5%. Review upstream data sources to restore value consistency.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
  {
    title: 'AT&T PurePath: Data Transformation Error Count Elevated',
    description: 'Transformational error rate currently at 4%, exceeding the 1% threshold. Examine recent script changes or ETL logic for faults.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
    {
    title: 'AT&T DQ Forge: Data Duplication Causing Violations',
    description: 'Duplicate transaction IDs detected beyond the 0.1% tolerance level. Enforce stricter key constraints to maintain deduplication compliance.',
    timestamp: '15th April, 2025, 10:32 AM',
  },
];