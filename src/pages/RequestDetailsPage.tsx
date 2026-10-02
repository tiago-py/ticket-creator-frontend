import { ArrowLeft, CalendarDays, Check, Clock3, Pencil, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState, LoadingState } from '../components/Feedback';
import { StatusBadge } from '../features/requests/StatusBadge';
import { useRequest, useRequestMutations } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import type { RequestStatus } from '../types';
const fmt = (v: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(v));
export function RequestDetailsPage() {
  const { id = '' } = useParams(),
    query = useRequest(id),
    { remove, status } = useRequestMutations(),
    { user } = useAuth(),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState(''),
    navigate = useNavigate(),
    location = useLocation();
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState />;
  const item = query.data,
    isAuthor = item.requesterId === user?.id,
    isAttendant = user?.role === 'atendente',
    next: RequestStatus | null =
      item.status === 'Aberto'
        ? 'Em atendimento'
        : item.status === 'Em atendimento'
          ? 'Concluído'
          : null;
  const change = async () => {
    if (!next) return;
    try {
      setError('');
      await status.mutateAsync({ id, status: next });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível atualizar o status');
    }
  };
  const destroy = async () => {
    await remove.mutateAsync(id);
    navigate('/requests', { state: { notice: 'Solicitação excluída.' } });
  };
  return (
    <>
      <Link className="back-link" to="/requests">
        <ArrowLeft />
        Voltar para solicitações
      </Link>
      {(location.state as { notice?: string })?.notice && (
        <div className="toast">
          <Check />
          {(location.state as { notice: string }).notice}
        </div>
      )}
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <header className="detail-head">
        <div>
          <span className="eyebrow">{item.code}</span>
          <h1>{item.title}</h1>
          <StatusBadge status={item.status} />
        </div>
        {isAuthor && (
          <div className="detail-actions">
            <Link className="button secondary" to={`/requests/${id}/edit`}>
              <Pencil />
              Editar
            </Link>
            <button className="button ghost-danger" onClick={() => setConfirm(true)}>
              <Trash2 />
              Excluir
            </button>
          </div>
        )}
      </header>
      <div className="detail-grid">
        <section className="panel detail-main">
          <span className="eyebrow">Descrição</span>
          <p>{item.description}</p>
          <div className="detail-meta">
            <span>
              <UserRound />
              Solicitado por<strong>{item.requester}</strong>
            </span>
            <span>
              <CalendarDays />
              Criado em<strong>{fmt(item.createdAt)}</strong>
            </span>
            <span>
              <Clock3 />
              Última atualização<strong>{fmt(item.updatedAt)}</strong>
            </span>
          </div>
        </section>
        <aside className="panel status-panel">
          <span className="eyebrow">Andamento</span>
          <h2>Status da solicitação</h2>
          <StatusBadge status={item.status} />
          {isAttendant ? (
            <>
              {next ? (
                <>
                  <p>
                    A próxima etapa obrigatória é <strong>{next}</strong>.
                  </p>
                  <button
                    className="button primary full status-action"
                    onClick={change}
                    disabled={status.isPending}
                  >
                    {status.isPending ? 'Atualizando...' : `Mover para ${next}`}
                  </button>
                </>
              ) : (
                <p>Esta solicitação já foi concluída.</p>
              )}
            </>
          ) : (
            <p>O status é atualizado exclusivamente pela equipe de atendimento.</p>
          )}
          <hr />
          <span className="category-label">Categoria</span>
          <strong>{item.category}</strong>
        </aside>
      </div>
      <ConfirmDialog
        open={confirm}
        title="Excluir esta solicitação?"
        description="Esta ação é permanente e não poderá ser desfeita."
        onClose={() => setConfirm(false)}
        onConfirm={destroy}
      />
    </>
  );
}
