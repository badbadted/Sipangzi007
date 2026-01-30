import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { EventsPage } from '../pages/EventsPage';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminEvents } from '../pages/AdminEvents';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <EventsPage />
      </Layout>
    ),
  },
  {
    path: '/events',
    element: (
      <Layout>
        <EventsPage />
      </Layout>
    ),
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/events',
    element: (
      <ProtectedRoute>
        <Layout showHeader={false}>
          <AdminEvents />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);
