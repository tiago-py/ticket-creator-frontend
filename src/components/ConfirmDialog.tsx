import { X } from 'lucide-react';
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="icon-button dialog-close" aria-label="Fechar" onClick={onClose}>
          <X size={18} />
        </button>
        <span className="eyebrow">Confirmar ação</span>
        <h2 id="dialog-title">{title}</h2>
        <p>{description}</p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="button danger" onClick={onConfirm}>
            Excluir solicitação
          </button>
        </div>
      </div>
    </div>
  );
}
