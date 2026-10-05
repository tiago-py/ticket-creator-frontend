import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/Feedback';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services/categoryService';

export function CategoriesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const categories = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: categoryService.listAll,
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };
  const create = useMutation({ mutationFn: categoryService.create, onSuccess: refresh });
  const update = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      categoryService.update(id, { active }),
    onSuccess: refresh,
  });
  if (user?.role !== 'atendente') return <Navigate to="/dashboard" replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) return;
    await create.mutateAsync(value);
    setName('');
  };
  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Categorias"
        description="Gerencie as categorias disponíveis nas solicitações."
      />
      <section className="panel category-admin">
        <form onSubmit={submit} className="category-create">
          <label htmlFor="new-category">Nova categoria</label>
          <div>
            <input
              id="new-category"
              value={name}
              maxLength={50}
              onChange={(event) => setName(event.target.value)}
            />
            <button className="button primary" disabled={create.isPending || !name.trim()}>
              Adicionar
            </button>
          </div>
        </form>
        {categories.isLoading ? (
          <LoadingState />
        ) : categories.isError ? (
          <ErrorState retry={() => categories.refetch()} />
        ) : (
          <ul className="category-list">
            {categories.data?.map((category) => (
              <li key={category.id}>
                <span>
                  <strong>{category.name}</strong>
                  <small>{category.active ? 'Ativa' : 'Arquivada'}</small>
                </span>
                <button
                  className="button secondary"
                  disabled={update.isPending}
                  onClick={() => update.mutate({ id: category.id, active: !category.active })}
                >
                  {category.active ? 'Arquivar' : 'Reativar'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
