import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { RequestFiltersValue } from '../../types';
export function RequestFilters({
  value,
  categories = [],
  categoriesLoading = false,
  categoriesError = false,
  onChange,
  onReset,
}: {
  value: RequestFiltersValue;
  categories?: string[];
  categoriesLoading?: boolean;
  categoriesError?: boolean;
  onChange: (v: Partial<RequestFiltersValue>) => void;
  onReset: () => void;
}) {
  const active = value.q || value.status || value.category || value.from || value.to;
  return (
    <section className="filters">
      <div className="search-box">
        <Search />
        <input
          aria-label="Buscar solicitações"
          placeholder="Buscar por título ou código..."
          value={value.q}
          onChange={(e) => onChange({ q: e.target.value, page: 1 })}
        />
      </div>
      <div className="filter-row">
        <span className="filter-label">
          <SlidersHorizontal size={16} /> Filtrar por
        </span>
        <select
          aria-label="Status"
          value={value.status}
          onChange={(e) => onChange({ status: e.target.value, page: 1 })}
        >
          <option value="">Todos os status</option>
          <option>Aberto</option>
          <option>Em atendimento</option>
          <option>Concluído</option>
        </select>
        <div className="filter-field">
          <label htmlFor="category-filter">Categoria</label>
          <select
            id="category-filter"
            value={value.category}
            disabled={categoriesLoading || categoriesError}
            onChange={(e) => onChange({ category: e.target.value, page: 1 })}
          >
            <option value="">
              {categoriesLoading
                ? 'Carregando categorias...'
                : categoriesError
                  ? 'Categorias indisponíveis'
                  : 'Todas as categorias'}
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <select
          aria-label="Prioridade"
          value={value.priority}
          onChange={(e) => onChange({ priority: e.target.value, page: 1 })}
        >
          <option value="">Todas as prioridades</option>
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
          <option>Urgente</option>
        </select>
        <input
          aria-label="Data inicial"
          type="date"
          value={value.from}
          onChange={(e) => onChange({ from: e.target.value, page: 1 })}
        />
        <span className="date-separator">até</span>
        <input
          aria-label="Data final"
          type="date"
          value={value.to}
          onChange={(e) => onChange({ to: e.target.value, page: 1 })}
        />
        {active && (
          <button className="clear-button" onClick={onReset}>
            <X size={15} /> Limpar
          </button>
        )}
      </div>
    </section>
  );
}
