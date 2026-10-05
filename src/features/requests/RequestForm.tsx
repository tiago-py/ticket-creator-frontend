import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { requestSchema, type RequestFormData } from '../../schemas';
export function RequestForm({
  initial,
  onSubmit,
  categories = [],
  categoriesLoading = false,
  categoriesError = false,
  submitLabel = 'Criar solicitação',
}: {
  initial?: RequestFormData;
  onSubmit: (v: RequestFormData) => Promise<void>;
  categories?: string[];
  categoriesLoading?: boolean;
  categoriesError?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: initial ?? { title: '', description: '', category: '', priority: 'Média' },
  });
  const description = watch('description') ?? '';
  return (
    <form className="request-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="title">Título da solicitação</label>
        <input id="title" placeholder="Ex.: Acesso ao dashboard comercial" {...register('title')} />
        {errors.title && <small role="alert">{errors.title.message}</small>}
        <span className="hint">Seja breve e objetivo para facilitar o atendimento.</span>
      </div>
      <div className="field">
        <label htmlFor="priority">Prioridade</label>
        <select id="priority" {...register('priority')}>
          {['Baixa', 'Média', 'Alta', 'Urgente'].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          disabled={categoriesLoading || categoriesError}
          aria-describedby="category-help"
          {...register('category')}
        >
          <option value="">
            {categoriesLoading
              ? 'Carregando categorias...'
              : categoriesError
                ? 'Não foi possível carregar as categorias'
                : 'Selecione uma categoria'}
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <small role="alert">{errors.category.message}</small>}
        <span className="hint" id="category-help">
          As categorias são carregadas do sistema.
        </span>
      </div>
      <div className="field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          rows={7}
          placeholder="Conte o que você precisa e inclua as informações importantes..."
          {...register('description')}
        />
        <div className="field-meta">
          <span>
            {errors.description?.message ?? 'Quanto mais contexto, mais rápido podemos ajudar.'}
          </span>
          <span>{description.length}/1000</span>
        </div>
      </div>
      <div className="form-actions">
        <Link className="button secondary" to="/requests">
          <ArrowLeft size={17} /> Cancelar
        </Link>
        <button
          className="button primary"
          disabled={isSubmitting || categoriesLoading || categoriesError}
        >
          {isSubmitting ? (
            'Salvando...'
          ) : (
            <>
              <Check size={17} />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
