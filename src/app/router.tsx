import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RequestsPage } from '../pages/RequestsPage';
import { NewRequestPage } from '../pages/NewRequestPage';
import { RequestDetailsPage } from '../pages/RequestDetailsPage';
import { EditRequestPage } from '../pages/EditRequestPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { CategoriesPage } from '../pages/CategoriesPage';
export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/requests', element: <RequestsPage /> },
          { path: '/requests/new', element: <NewRequestPage /> },
          { path: '/requests/:id', element: <RequestDetailsPage /> },
          { path: '/requests/:id/edit', element: <EditRequestPage /> },
          { path: '/categories', element: <CategoriesPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <NotFoundPage /> },
]);
