import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { requestSchema, type RequestFormData } from '../../schemas';
export function RequestForm({
  initial,
  onSubmit,
  categories = [],
  submitLabel = 'Criar solicitação',
}: {
  initial?: RequestFormData;
  onSubmit: (v: RequestFormData) => Promise<void>;
  categories?: string[];
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: initial ?? { title: '', description: '', category: 'TI' },
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
        <label htmlFor="category">Categoria</label>
        <input
          id="category"
          list="category-options"
          placeholder="Selecione ou digite uma nova categoria"
          {...register('category')}
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.category && <small role="alert">{errors.category.message}</small>}
        <span className="hint">Você pode usar uma categoria existente ou cadastrar uma nova.</span>
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
        <button className="button primary" disabled={isSubmitting}>
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
