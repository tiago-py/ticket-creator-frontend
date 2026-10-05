import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

export const useAttendants = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['attendants'],
    queryFn: userService.attendants,
    enabled: user?.role === 'atendente',
  });
};
