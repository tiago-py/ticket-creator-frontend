import type {
  PaginatedRequests,
  RequestFiltersValue,
  RequestInput,
  RequestPriority,
  RequestStatus,
  ServiceRequest,
} from '../types';
import { httpClient } from './httpClient';
type ApiStatus = 'ABERTO' | 'EM_ATENDIMENTO' | 'CONCLUIDO';
type ApiPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
type ApiRequest = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: ApiStatus;
  requesterId: string;
  requester: { id: string; name: string };
  category: { id: string; name: string };
  priority: ApiPriority;
  assignee: { id: string; name: string } | null;
  comments?: Array<{
    id: string;
    message: string;
    author: { id: string; name: string };
    createdAt: string;
  }>;
  history?: Array<{
    id: string;
    action: string;
    details: string | null;
    actor: { id: string; name: string };
    createdAt: string;
  }>;
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
const toPriority: Record<RequestPriority, ApiPriority> = {
  Baixa: 'BAIXA',
  Média: 'MEDIA',
  Alta: 'ALTA',
  Urgente: 'URGENTE',
};
const fromPriority: Record<ApiPriority, RequestPriority> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
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
  priority: fromPriority[item.priority],
  assignee: item.assignee,
  comments: item.comments ?? [],
  history: item.history ?? [],
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});
export const requestService = {
  async list(filters: RequestFiltersValue): Promise<PaginatedRequests> {
    const params = new URLSearchParams({ page: String(filters.page), size: '5' });
    if (filters.q) params.set('q', filters.q);
    if (filters.status) params.set('status', toStatus[filters.status as RequestStatus]);
    if (filters.category) params.set('category', filters.category);
    if (filters.priority) params.set('priority', toPriority[filters.priority as RequestPriority]);
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
      await httpClient<ApiRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify({ ...input, priority: toPriority[input.priority] }),
      }),
    );
  },
  async update(id: string, input: RequestInput) {
    return mapRequest(
      await httpClient<ApiRequest>(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...input, priority: toPriority[input.priority] }),
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
  async assign(id: string, assigneeId: string | null) {
    return mapRequest(
      await httpClient<ApiRequest>(`/requests/${id}/assignee`, {
        method: 'PATCH',
        body: JSON.stringify({ assigneeId }),
      }),
    );
  },
  async comment(id: string, message: string) {
    return httpClient(`/requests/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
