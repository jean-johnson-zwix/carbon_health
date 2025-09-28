import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Layout from './layout';
import Landing from '@/pages/Landing';
import Calculator from '@/pages/Calculator';
import Results from '@/pages/Results';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login'
import Register from '@/pages/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Landing /></Layout>,
    errorElement: <Layout><NotFound /></Layout>,
  },
  {
    path: '/start',
    element: <Layout><Calculator /></Layout>,
  },
  {
    path: '/calculator',
    element: <Layout><Calculator /></Layout>,
  },
  {
    path: '/results',
    element: <Layout><Results /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><About /></Layout>,
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>,
  },
  {
    path: '/register',
    element: <Layout><Register /></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);

export { router };

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="glass-card p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export function Routes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
