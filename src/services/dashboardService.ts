import type { DashboardSummary } from '../types';
import { httpClient } from './httpClient';
export const dashboardService = {
  summary: () => httpClient<DashboardSummary>('/dashboard/summary'),
};
