export type RequestStatus = 'Aberto' | 'Em atendimento' | 'Concluído';
export type UserRole = 'solicitante' | 'atendente';
export type Category = string;
export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
}
export interface ServiceRequest {
  id: string;
  code: string;
  title: string;
  description: string;
  category: Category;
  status: RequestStatus;
  requester: string;
  requesterId: string;
  createdAt: string;
  updatedAt: string;
}
export interface RequestFiltersValue {
  q: string;
  status: string;
  category: string;
  from: string;
  to: string;
  page: number;
}
export interface PaginatedRequests {
  data: ServiceRequest[];
  page: number;
  total: number;
  totalPages: number;
}
export interface DashboardSummary {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
}
export interface RequestInput {
  title: string;
  description: string;
  category: Category;
}
