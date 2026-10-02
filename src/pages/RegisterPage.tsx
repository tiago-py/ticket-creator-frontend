import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { RegisterForm } from '../features/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import type { RegisterData } from '../schemas';
export function RegisterPage() {
  const [error, setError] = useState(''),
    { register } = useAuth(),
    navigate = useNavigate();
  const submit = async (data: RegisterData) => {
    try {
      setError('');
      await register(data);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível criar a conta');
    }
  };
  return (
    <main className="login-page">
      <section className="login-brand">
        <Logo light />
        <div className="brand-message">
          <span className="eyebrow light">Comece agora</span>
          <h1>
            Atendimento claro,
            <br />
            do início ao fim.
          </h1>
          <p>Crie seu acesso para registrar solicitações ou atuar no atendimento.</p>
        </div>
        <small>© 2026 Atende.</small>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <span className="mobile-logo">
            <Logo />
          </span>
          <span className="eyebrow">Cadastro</span>
          <h2>Crie sua conta</h2>
          <p>Preencha seus dados e escolha o perfil de acesso.</p>
          <RegisterForm onSubmit={submit} error={error} />
          <div className="login-help">
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
