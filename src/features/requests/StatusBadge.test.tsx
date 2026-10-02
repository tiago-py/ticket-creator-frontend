import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';
describe('StatusBadge', () => {
  it('representa o status recebido', () => {
    render(<StatusBadge status="Em atendimento" />);
    expect(screen.getByText('Em atendimento')).toHaveClass('badge-progress');
  });
});
