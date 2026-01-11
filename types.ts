
export enum DeviceMode {
  OPERATOR = 'OPERATOR',
  DASHBOARD = 'DASHBOARD'
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SystemState {
  uncertainty: number; // 0.0 to 1.0
  throughput: number;
  alignmentScore: number;
  riskLevel: RiskLevel;
  lastHeartbeat: number;
}

export interface Alert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}
