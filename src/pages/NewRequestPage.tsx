import { Navigate, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { RequestForm } from '../features/requests/RequestForm';
import { useRequestMutations } from '../hooks/useRequests';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import type { RequestFormData } from '../schemas';
export function NewRequestPage() {
  const navigate = useNavigate(),
    { create } = useRequestMutations(),
    categories = useCategories(),
    { user } = useAuth();
  if (user?.role !== 'solicitante') return <Navigate to="/requests" replace />;
  const submit = async (data: RequestFormData) => {
    const item = await create.mutateAsync(data);
    navigate(`/requests/${item.id}`, { state: { notice: 'Solicitação criada com sucesso.' } });
  };
  return (
    <div className="narrow">
      <PageHeader
        eyebrow="Nova solicitação"
        title="Como podemos ajudar?"
        description="Preencha as informações abaixo. Você poderá acompanhar o andamento pelo portal."
      />
      <section className="panel form-panel">
        <RequestForm
          onSubmit={submit}
          categories={categories.data}
          categoriesLoading={categories.isLoading}
          categoriesError={categories.isError}
        />
      </section>
    </div>
  );
}
