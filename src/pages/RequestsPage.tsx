import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { RequestFilters } from '../features/requests/RequestFilters';
import { RequestTable } from '../features/requests/RequestTable';
import { useRequestFilters } from '../hooks/useRequestFilters';
import { useRequests } from '../hooks/useRequests';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
export function RequestsPage() {
  const { filters, update, reset } = useRequestFilters(),
    query = useRequests(filters),
    categories = useCategories(),
    { user } = useAuth();
  const canCreate = user?.role === 'solicitante';
  return (
    <>
      <PageHeader
        eyebrow="Atendimento"
        title={canCreate ? 'Minhas solicitações' : 'Todas as solicitações'}
        description={
          canCreate
            ? 'Consulte e acompanhe os pedidos que você criou.'
            : 'Consulte, filtre e acompanhe todos os pedidos do sistema.'
        }
        action={
          canCreate ? (
            <Link className="button primary" to="/requests/new">
              <Plus />
              Nova solicitação
            </Link>
          ) : undefined
        }
      />
      <RequestFilters
        value={filters}
        categories={categories.data}
        categoriesLoading={categories.isLoading}
        categoriesError={categories.isError}
        onChange={update}
        onReset={reset}
      />
      <section className="panel list-panel">
        <div className="results-head">
          <strong>{query.data?.total ?? 0} solicitações</strong>
          <span>Resultados encontrados</span>
        </div>
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState retry={() => query.refetch()} />
        ) : !query.data?.data.length ? (
          <EmptyState />
        ) : (
          <>
            <RequestTable rows={query.data.data} />
            <div className="pagination">
              <span>
                Página {query.data.page} de {query.data.totalPages}
              </span>
              <div>
                <button
                  aria-label="Página anterior"
                  className="icon-button"
                  disabled={query.data.page === 1}
                  onClick={() => update({ page: query.data!.page - 1 })}
                >
                  <ChevronLeft />
                </button>
                <strong>{query.data.page}</strong>
                <button
                  aria-label="Próxima página"
                  className="icon-button"
                  disabled={query.data.page === query.data.totalPages}
                  onClick={() => update({ page: query.data!.page + 1 })}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
