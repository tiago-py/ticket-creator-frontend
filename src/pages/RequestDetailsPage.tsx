import { ArrowLeft, CalendarDays, Check, Clock3, Pencil, Trash2, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState, LoadingState } from '../components/Feedback';
import { StatusBadge } from '../features/requests/StatusBadge';
import { useRequest, useRequestMutations } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import { useAttendants } from '../hooks/useAttendants';
import type { RequestStatus } from '../types';
const fmt = (v: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(v));
export function RequestDetailsPage() {
  const { id = '' } = useParams(),
    query = useRequest(id),
    { remove, status, assign, comment } = useRequestMutations(),
    attendants = useAttendants(),
    { user } = useAuth(),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
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
  const addComment = async (event: FormEvent) => {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    await comment.mutateAsync({ id, message: value });
    setMessage('');
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
          <span className={`priority priority-${item.priority.toLowerCase()}`}>
            {item.priority}
          </span>
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
          <span className="category-label" id="request-category-label">
            Categoria
          </span>
          <strong aria-labelledby="request-category-label">{item.category}</strong>
          <hr />
          <span className="category-label">Responsável</span>
          {isAttendant ? (
            <select
              aria-label="Responsável pelo atendimento"
              value={item.assignee?.id ?? ''}
              disabled={assign.isPending || attendants.isLoading}
              onChange={(event) => assign.mutate({ id, assigneeId: event.target.value || null })}
            >
              <option value="">Não atribuída</option>
              {attendants.data?.map((attendant) => (
                <option key={attendant.id} value={attendant.id}>
                  {attendant.name}
                </option>
              ))}
            </select>
          ) : (
            <strong>{item.assignee?.name ?? 'Aguardando atribuição'}</strong>
          )}
        </aside>
      </div>
      <div className="detail-grid detail-secondary">
        <section className="panel conversation">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Colaboração</span>
              <h2>Comentários</h2>
            </div>
          </div>
          <div className="comment-list">
            {item.comments.length ? (
              item.comments.map((entry) => (
                <article key={entry.id}>
                  <strong>{entry.author.name}</strong>
                  <time>{fmt(entry.createdAt)}</time>
                  <p>{entry.message}</p>
                </article>
              ))
            ) : (
              <p className="muted">Nenhum comentário ainda.</p>
            )}
          </div>
          <form onSubmit={addComment} className="comment-form">
            <label htmlFor="comment">Adicionar comentário</label>
            <textarea
              id="comment"
              rows={3}
              maxLength={1000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button className="button primary" disabled={!message.trim() || comment.isPending}>
              {comment.isPending ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        </section>
        <aside className="panel timeline">
          <span className="eyebrow">Histórico</span>
          <h2>Linha do tempo</h2>
          <ol>
            {item.history.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.action}</strong>
                {entry.details && <p>{entry.details}</p>}
                <small>
                  {entry.actor.name} · {fmt(entry.createdAt)}
                </small>
              </li>
            ))}
          </ol>
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
