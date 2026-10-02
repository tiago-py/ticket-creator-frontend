import { AlertCircle, Inbox } from 'lucide-react';
export function LoadingState() {
  return (
    <div className="state">
      <span className="spinner" />
      <p>Carregando informações...</p>
    </div>
  );
}
export function ErrorState({ retry }: { retry?: () => void }) {
  return (
    <div className="state">
      <AlertCircle />
      <h3>Algo não saiu como esperado</h3>
      <p>Não foi possível carregar os dados.</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
export function EmptyState() {
  return (
    <div className="state">
      <Inbox />
      <h3>Nenhuma solicitação encontrada</h3>
      <p>Ajuste os filtros ou crie uma nova solicitação.</p>
    </div>
  );
}
