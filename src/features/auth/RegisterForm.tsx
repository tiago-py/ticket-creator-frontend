import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterData } from '../../schemas';
export function RegisterForm({
  onSubmit,
  error,
}: {
  onSubmit: (data: RegisterData) => Promise<void>;
  error?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'solicitante' },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="name">Nome completo</label>
        <div className="input-icon">
          <UserRound />
          <input id="name" autoComplete="name" {...register('name')} />
        </div>
        {errors.name && <small role="alert">{errors.name.message}</small>}
      </div>
      <div className="field">
        <label htmlFor="register-email">E-mail corporativo</label>
        <div className="input-icon">
          <Mail />
          <input id="register-email" type="email" autoComplete="email" {...register('email')} />
        </div>
        {errors.email && <small role="alert">{errors.email.message}</small>}
      </div>
      <div className="field">
        <label htmlFor="register-password">Senha</label>
        <div className="input-icon">
          <LockKeyhole />
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
        </div>
        {errors.password && <small role="alert">{errors.password.message}</small>}
      </div>
      <div className="field">
        <label htmlFor="role">Tipo de usuário</label>
        <select id="role" {...register('role')}>
          <option value="solicitante">Solicitante</option>
          <option value="atendente">Atendente</option>
        </select>
        <span className="hint">
          Solicitantes criam pedidos; atendentes acompanham e atualizam o status.
        </span>
      </div>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <button className="button primary full" disabled={isSubmitting}>
        {isSubmitting ? (
          'Criando conta...'
        ) : (
          <>
            Criar conta <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
