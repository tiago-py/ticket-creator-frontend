import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { LoginForm } from '../features/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import type { LoginData } from '../schemas';
export function LoginPage() {
  const [error, setError] = useState(''),
    { login } = useAuth(),
    navigate = useNavigate(),
    location = useLocation();
  const submit = async (data: LoginData) => {
    try {
      setError('');
      await login(data);
      const to =
        (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/dashboard';
      navigate(to, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível entrar');
    }
  };
  return (
    <main className="login-page">
      <section className="login-brand">
        <Logo light />
        <div className="brand-message">
          <span className="eyebrow light">Portal de solicitações internas</span>
          <h1>
            Seu trabalho flui.
            <br />A gente cuida do resto.
          </h1>
          <p>
            Centralize pedidos, acompanhe cada etapa e mantenha tudo sob controle em um só lugar.
          </p>
          <ul>
            <li>
              <CheckCircle2 />
              Acompanhamento em tempo real
            </li>
            <li>
              <ShieldCheck />
              Dados seguros e centralizados
            </li>
            <li>
              <Sparkles />
              Atendimento simples e transparente
            </li>
          </ul>
        </div>
        <small>© 2026 Atende. Feito para times que avançam.</small>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <span className="mobile-logo">
            <Logo />
          </span>
          <span className="eyebrow">Bem-vindo de volta</span>
          <h2>Acesse sua conta</h2>
          <p>Use seu e-mail corporativo para continuar.</p>
          <LoginForm onSubmit={submit} error={error} />
          <div className="demo-accounts">
            <strong>Contas de demonstração</strong>
            <span>Solicitante: marina@empresa.com</span>
            <span>Atendente: tiago@empresa.com</span>
            <span>Senha: 123456</span>
          </div>
          <div className="login-help">
            Ainda não possui conta? <Link to="/register">Cadastre-se</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
