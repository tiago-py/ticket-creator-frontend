import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../services/requestService';
import type { RequestFiltersValue, RequestInput, RequestStatus } from '../types';
import { useAuth } from './useAuth';
export const useRequests = (filters: RequestFiltersValue) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['requests', user?.id, filters],
    queryFn: () => requestService.list(filters),
    enabled: !!user,
  });
};
export const useRequest = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['request', user?.id, id],
    queryFn: () => requestService.get(id),
    enabled: !!id && !!user,
  });
};
export function useRequestMutations() {
  const qc = useQueryClient(),
    { user } = useAuth(),
    refresh = () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    };
  return {
    create: useMutation({
      mutationFn: (data: RequestInput) => requestService.create(data),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: RequestInput }) =>
        requestService.update(id, data),
      onSuccess: async (item) => {
        await qc.invalidateQueries({ queryKey: ['request', user?.id, item.id] });
        refresh();
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => requestService.remove(id),
      onSuccess: refresh,
    }),
    status: useMutation({
      mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
        requestService.updateStatus(id, status),
      onSuccess: (_, v) => {
        qc.invalidateQueries({ queryKey: ['request', user?.id, v.id] });
        refresh();
      },
    }),
  };
}
