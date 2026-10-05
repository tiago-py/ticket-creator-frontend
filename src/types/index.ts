export type RequestStatus = 'Aberto' | 'Em atendimento' | 'Concluído';
export type UserRole = 'solicitante' | 'atendente';
export type Category = string;
export type RequestPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
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
  priority: RequestPriority;
  assignee: Pick<User, 'id' | 'name'> | null;
  comments: RequestComment[];
  history: RequestHistory[];
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
  priority: string;
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
  priority: RequestPriority;
}
export interface RequestComment {
  id: string;
  message: string;
  author: Pick<User, 'id' | 'name'>;
  createdAt: string;
}
export interface RequestHistory {
  id: string;
  action: string;
  details: string | null;
  actor: Pick<User, 'id' | 'name'>;
  createdAt: string;
}
export interface CategoryItem {
  id: string;
  name: string;
  active: boolean;
}
