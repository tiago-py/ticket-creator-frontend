import { useSearchParams } from 'react-router-dom';
import type { RequestFiltersValue } from '../types';
export function useRequestFilters() {
  const [params, setParams] = useSearchParams();
  const filters: RequestFiltersValue = {
    q: params.get('q') ?? '',
    status: params.get('status') ?? '',
    category: params.get('category') ?? '',
    priority: params.get('priority') ?? '',
    from: params.get('from') ?? '',
    to: params.get('to') ?? '',
    page: Number(params.get('page') ?? 1),
  };
  const update = (next: Partial<RequestFiltersValue>) => {
    const merged = { ...filters, ...next };
    const clean = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v && !(k === 'page' && v === 1)) clean.set(k, String(v));
    });
    setParams(clean);
  };
  const reset = () => setParams({});
  return { filters, update, reset };
}
