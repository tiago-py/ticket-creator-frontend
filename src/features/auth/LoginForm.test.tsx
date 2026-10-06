import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
describe('LoginForm', () => {
  it('valida os campos antes de enviar', async () => {
    const user = userEvent.setup(),
      submit = vi.fn();
    render(<LoginForm onSubmit={submit} />);
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText('Informe seu e-mail')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });
});
