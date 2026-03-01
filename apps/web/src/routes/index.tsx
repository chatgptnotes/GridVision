import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '@/components/common/AppShell';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import SLDView from '@/pages/SLDView';
import Alarms from '@/pages/Alarms';
import Trends from '@/pages/Trends';
import Events from '@/pages/Events';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import SLDGenerator from '@/pages/SLDGenerator';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/generate',
    element: <SLDGenerator />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/sld', element: <SLDView /> },
          { path: '/sld/:substationId', element: <SLDView /> },
          { path: '/alarms', element: <Alarms /> },
          { path: '/trends', element: <Trends /> },
          { path: '/events', element: <Events /> },
          { path: '/reports', element: <Reports /> },
          { path: '/settings', element: <Settings /> },
        ],
      },
    ],
  },
]);
