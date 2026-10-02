import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '../components/Feedback';
export function ProtectedRoute() {
  const { user, loading } = useAuth(),
    location = useLocation();
  if (loading) return <LoadingState />;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
export function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
