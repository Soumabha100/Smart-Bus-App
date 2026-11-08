export interface SystemStatus {
  backendStatus: string;
  databaseStatus: string;
  databaseLatencyMs: number;
  databaseService: string;
  timestamp: string;
}

