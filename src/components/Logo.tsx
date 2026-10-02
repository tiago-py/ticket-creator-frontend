import { Layers3 } from 'lucide-react';
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark">
        <Layers3 size={19} />
      </span>
      <span>atende</span>
    </div>
  );
}
