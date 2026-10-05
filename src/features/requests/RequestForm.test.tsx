import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RequestForm } from './RequestForm';

describe('RequestForm', () => {
  it('lista categorias do backend e envia prioridade', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryRouter>
        <RequestForm categories={['TI', 'Financeiro']} onSubmit={submit} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Título da solicitação'), 'Novo acesso');
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Financeiro');
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'Alta');
    await user.type(screen.getByLabelText('Descrição'), 'Preciso acessar o sistema financeiro.');
    await user.click(screen.getByRole('button', { name: /criar solicitação/i }));

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Financeiro', priority: 'Alta' }),
      expect.anything(),
    );
  });
});
