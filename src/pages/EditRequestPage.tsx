import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { RequestForm } from '../features/requests/RequestForm';
import { useRequest, useRequestMutations } from '../hooks/useRequests';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import type { RequestFormData } from '../schemas';
export function EditRequestPage() {
  const { id = '' } = useParams(),
    navigate = useNavigate(),
    query = useRequest(id),
    { update } = useRequestMutations(),
    categories = useCategories(),
    { user } = useAuth();
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState />;
  if (query.data.requesterId !== user?.id) return <Navigate to={`/requests/${id}`} replace />;
  const submit = async (data: RequestFormData) => {
    await update.mutateAsync({ id, data });
    navigate(`/requests/${id}`, { state: { notice: 'Solicitação atualizada com sucesso.' } });
  };
  return (
    <div className="narrow">
      <PageHeader
        eyebrow={query.data.code}
        title="Editar solicitação"
        description="Atualize os dados do seu pedido."
      />
      <section className="panel form-panel">
        <RequestForm
          initial={{
            title: query.data.title,
            category: query.data.category,
            description: query.data.description,
          }}
          onSubmit={submit}
          categories={categories.data}
          submitLabel="Salvar alterações"
        />
      </section>
    </div>
  );
}
