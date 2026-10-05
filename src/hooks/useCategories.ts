import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoryService.list()).map((category) => category.name),
  });
