import { ClipboardList, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
export function AppLayout() {
  const [open, setOpen] = useState(false),
    { user, logout } = useAuth(),
    navigate = useNavigate(),
    canCreate = user?.role === 'solicitante';
  const signOut = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-head">
          <Logo light />
          <button
            className="icon-button mobile-only"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Navegação principal">
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>
            <LayoutDashboard />
            Visão geral
          </NavLink>
          <NavLink to="/requests" onClick={() => setOpen(false)}>
            <ClipboardList />
            Solicitações
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <span className="avatar">{user?.initials}</span>
            <span>
              <strong>{user?.name}</strong>
              <small>
                {user?.role === 'atendente' ? 'Atendente' : 'Solicitante'} · {user?.email}
              </small>
            </span>
          </div>
          <button className="logout" onClick={signOut}>
            <LogOut />
            Sair da conta
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <div className="app-main">
        <header className="topbar">
          <button
            className="icon-button mobile-only"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="topbar-copy">
            <span>Portal interno</span>
            <small>
              {user?.role === 'atendente' ? 'Área do atendimento' : 'Área do solicitante'}
            </small>
          </div>
          {canCreate && (
            <NavLink className="button primary topbar-action" to="/requests/new">
              <Plus size={17} />
              Nova solicitação
            </NavLink>
          )}
          <span className="top-avatar">{user?.initials}</span>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
