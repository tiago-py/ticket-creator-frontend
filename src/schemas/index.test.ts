import { describe, expect, it } from 'vitest';
import { loginSchema, requestSchema } from '.';
describe('schemas', () => {
  it('rejeita credenciais inválidas', () => {
    expect(loginSchema.safeParse({ email: 'inválido', password: '123' }).success).toBe(false);
  });
  it('aceita uma solicitação completa', () => {
    expect(
      requestSchema.safeParse({
        title: 'Novo acesso',
        category: 'Acesso e permissões',
        priority: 'Média',
        description: 'Preciso acessar o painel comercial.',
      }).success,
    ).toBe(true);
  });
});
