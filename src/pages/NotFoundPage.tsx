import { Link } from 'react-router-dom';
export function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="eyebrow">Erro 404</span>
      <h1>Página não encontrada.</h1>
      <p>O endereço informado não existe ou foi movido.</p>
      <Link className="button primary" to="/dashboard">
        Voltar ao início
      </Link>
    </main>
  );
}
