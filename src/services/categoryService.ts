import { httpClient } from './httpClient';
import type { CategoryItem } from '../types';
type ApiCategory = CategoryItem;
export const categoryService = {
  async list() {
    return (await httpClient<ApiCategory[]>('/categories')).filter((category) => category.active);
  },
  listAll: () => httpClient<ApiCategory[]>('/categories?all=true'),
  create: (name: string) =>
    httpClient<ApiCategory>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  update: (id: string, data: { name?: string; active?: boolean }) =>
    httpClient<ApiCategory>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
