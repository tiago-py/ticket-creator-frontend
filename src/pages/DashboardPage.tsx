import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { DashboardCards } from '../features/dashboard/DashboardCards';
import { RequestTable } from '../features/requests/RequestTable';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { useRequests } from '../hooks/useRequests';
export function DashboardPage() {
  const { user } = useAuth(),
    summary = useDashboard(),
    recent = useRequests({ q: '', status: '', category: '', from: '', to: '', page: 1 }),
    canCreate = user?.role === 'solicitante';
  if (summary.isLoading) return <LoadingState />;
  if (summary.isError || !summary.data) return <ErrorState retry={() => summary.refetch()} />;
  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title={`Olá, ${user?.name.split(' ')[0]}!`}
        description={
          canCreate
            ? 'Aqui está o resumo das solicitações que você criou.'
            : 'Aqui está o resumo de todas as solicitações do sistema.'
        }
        action={
          canCreate ? (
            <Link to="/requests/new" className="button primary">
              <Plus />
              Nova solicitação
            </Link>
          ) : undefined
        }
      />
      <DashboardCards summary={summary.data} />
      <section className="panel recent">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Atividade recente</span>
            <h2>Últimas solicitações</h2>
          </div>
          <Link to="/requests" className="text-link">
            Ver todas <ArrowRight />
          </Link>
        </div>
        {recent.data && <RequestTable rows={recent.data.data.slice(0, 4)} />}
      </section>
    </>
  );
}
