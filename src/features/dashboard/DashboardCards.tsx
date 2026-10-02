import { CheckCircle2, Clock3, FolderOpen, Layers3 } from 'lucide-react';
import type { DashboardSummary } from '../../types';
const items = [
  ['Total de solicitações', 'total', Layers3],
  ['Solicitações abertas', 'open', FolderOpen],
  ['Em atendimento', 'inProgress', Clock3],
  ['Concluídas', 'completed', CheckCircle2],
] as const;
export function DashboardCards({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="metric-grid">
      {items.map(([label, key, Icon], i) => (
        <article className={`metric-card ${i === 0 ? 'metric-dark' : ''}`} key={key}>
          <div className="metric-top">
            <span>{label}</span>
            <Icon size={20} />
          </div>
          <strong>{summary[key]}</strong>
          <small>
            {i === 0
              ? 'Todas as solicitações registradas'
              : i === 1
                ? 'Aguardando atendimento'
                : i === 2
                  ? 'Sendo tratadas pelo time'
                  : 'Finalizadas com sucesso'}
          </small>
        </article>
      ))}
    </div>
  );
}
