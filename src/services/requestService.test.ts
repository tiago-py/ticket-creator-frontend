import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestService } from './requestService';
const apiRequest = {
  id: 'req-1',
  code: 'SOL-0001',
  title: 'Novo pedido',
  description: 'Descrição suficientemente completa.',
  status: 'ABERTO',
  requesterId: 'usr-1',
  requester: { id: 'usr-1', name: 'Marina Costa' },
  category: { id: 'cat-1', name: 'TI' },
  priority: 'MEDIA',
  assignee: null,
  createdAt: '2026-10-01T12:00:00.000Z',
  updatedAt: '2026-10-01T12:00:00.000Z',
};
describe('requestService HTTP', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });
  it('converte a página e o status retornados pela API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [apiRequest], page: 1, total: 1, totalPages: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const result = await requestService.list({
      q: 'pedido',
      status: 'Aberto',
      category: 'TI',
      priority: '',
      from: '',
      to: '',
      page: 1,
    });
    expect(result.data[0]).toMatchObject({
      status: 'Aberto',
      category: 'TI',
      requester: 'Marina Costa',
    });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('status=ABERTO'), expect.anything());
  });
  it('converte o status enviado ao backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...apiRequest, status: 'EM_ATENDIMENTO' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const item = await requestService.updateStatus('req-1', 'Em atendimento');
    expect(item.status).toBe('Em atendimento');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/requests/req-1/status'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'EM_ATENDIMENTO' }),
      }),
    );
  });
});
