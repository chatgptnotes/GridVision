import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AlarmStatusBar from './AlarmStatusBar';

export default function AppShell() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 bg-scada-bg">
          <Outlet />
        </main>
      </div>
      <AlarmStatusBar />
    </div>
  );
}
