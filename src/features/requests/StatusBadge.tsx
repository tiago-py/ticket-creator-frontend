import type { RequestStatus } from '../../types';
export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`badge badge-${status === 'Aberto' ? 'open' : status === 'Em atendimento' ? 'progress' : 'done'}`}
    >
      <i />
      {status}
    </span>
  );
}
