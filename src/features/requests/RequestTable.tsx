import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ServiceRequest } from '../../types';
import { StatusBadge } from './StatusBadge';
const date = (v: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(v))
    .replace('.', '');
export function RequestTable({ rows }: { rows: ServiceRequest[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Solicitação</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Abrir</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link to={`/requests/${row.id}`} className="request-title">
                  <strong>{row.title}</strong>
                  <span>{row.code}</span>
                </Link>
              </td>
              <td>{row.category}</td>
              <td>{date(row.createdAt)}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <Link
                  className="row-link"
                  aria-label={`Abrir ${row.title}`}
                  to={`/requests/${row.id}`}
                >
                  <ArrowRight />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
