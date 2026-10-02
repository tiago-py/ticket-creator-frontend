import { httpClient } from './httpClient';
type ApiCategory = { id: string; name: string };
export const categoryService = {
  async list() {
    return (await httpClient<ApiCategory[]>('/categories')).map((category) => category.name);
  },
};
