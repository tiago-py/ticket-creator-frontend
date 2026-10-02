import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginData } from '../../schemas';
export function LoginForm({
  onSubmit,
  error,
}: {
  onSubmit: (data: LoginData) => Promise<void>;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'marina@empresa.com', password: '123456' },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="email">E-mail corporativo</label>
        <div className="input-icon">
          <Mail />
          <input id="email" type="email" autoComplete="email" {...register('email')} />
        </div>
        {errors.email && <small role="alert">{errors.email.message}</small>}
      </div>
      <div className="field">
        <div className="label-row">
          <label htmlFor="password">Senha</label>
          <button type="button" className="text-button">
            Esqueci minha senha
          </button>
        </div>
        <div className="input-icon">
          <LockKeyhole />
          <input
            id="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setShow((v) => !v)}
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && <small role="alert">{errors.password.message}</small>}
      </div>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <button className="button primary full" disabled={isSubmitting}>
        {isSubmitting ? (
          'Entrando...'
        ) : (
          <>
            Entrar <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
