import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useWebSocket } from './hooks/useWebSocket';

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket();
  return <>{children}</>;
}

export default function App() {
  return (
    <WebSocketProvider>
      <RouterProvider router={router} />
    </WebSocketProvider>
  );
}
