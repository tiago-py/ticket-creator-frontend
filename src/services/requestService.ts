import type {
  PaginatedRequests,
  RequestFiltersValue,
  RequestInput,
  RequestStatus,
  ServiceRequest,
} from '../types';
import { httpClient } from './httpClient';
type ApiStatus = 'ABERTO' | 'EM_ATENDIMENTO' | 'CONCLUIDO';
type ApiRequest = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: ApiStatus;
  requesterId: string;
  requester: { id: string; name: string };
  category: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};
type ApiPage = { data: ApiRequest[]; page: number; total: number; totalPages: number };
const toStatus: Record<RequestStatus, ApiStatus> = {
  Aberto: 'ABERTO',
  'Em atendimento': 'EM_ATENDIMENTO',
  Concluído: 'CONCLUIDO',
};
const fromStatus: Record<ApiStatus, RequestStatus> = {
  ABERTO: 'Aberto',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
};
const mapRequest = (item: ApiRequest): ServiceRequest => ({
  id: item.id,
  code: item.code,
  title: item.title,
  description: item.description,
  status: fromStatus[item.status],
  requesterId: item.requesterId,
  requester: item.requester.name,
  category: item.category.name,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});
export const requestService = {
  async list(filters: RequestFiltersValue): Promise<PaginatedRequests> {
    const params = new URLSearchParams({ page: String(filters.page), size: '5' });
    if (filters.q) params.set('q', filters.q);
    if (filters.status) params.set('status', toStatus[filters.status as RequestStatus]);
    if (filters.category) params.set('category', filters.category);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    const page = await httpClient<ApiPage>(`/requests?${params}`);
    return { ...page, data: page.data.map(mapRequest) };
  },
  async get(id: string) {
    return mapRequest(await httpClient<ApiRequest>(`/requests/${id}`));
  },
  async create(input: RequestInput) {
    return mapRequest(
      await httpClient<ApiRequest>('/requests', { method: 'POST', body: JSON.stringify(input) }),
    );
  },
  async update(id: string, input: RequestInput) {
    return mapRequest(
      await httpClient<ApiRequest>(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    );
  },
  async remove(id: string) {
    await httpClient<void>(`/requests/${id}`, { method: 'DELETE' });
  },
  async updateStatus(id: string, status: RequestStatus) {
    return mapRequest(
      await httpClient<ApiRequest>(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: toStatus[status] }),
      }),
    );
  },
};
