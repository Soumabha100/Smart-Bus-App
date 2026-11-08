import type { SystemStatus } from '../types/system';

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const response = await fetch('/api/v1/system/status', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch system status: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

