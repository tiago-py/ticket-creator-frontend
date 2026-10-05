import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
});
export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo'),
  email: z.string().min(1, 'Informe seu e-mail').email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
  role: z.enum(['solicitante', 'atendente']),
});
export const requestSchema = z.object({
  title: z.string().trim().min(4, 'Use ao menos 4 caracteres').max(100),
  category: z.string().trim().min(2, 'Informe uma categoria').max(50),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Urgente']),
  description: z
    .string()
    .trim()
    .min(10, 'Descreva a solicitação em ao menos 10 caracteres')
    .max(1000),
});
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;
