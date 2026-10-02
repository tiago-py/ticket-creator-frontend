import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from './useAuth';
export const useDashboard = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: dashboardService.summary,
    enabled: !!user,
  });
};
