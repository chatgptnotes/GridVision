import { useAuthStore } from '@/stores/authStore';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { LogOut, Wifi, WifiOff, Zap, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const connectionStatus = useRealtimeStore((s) => s.connectionStatus);

  return (
    <header className="h-12 bg-scada-panel border-b border-scada-border flex items-center px-2 sm:px-4 justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded hover:bg-scada-border/50 text-gray-400 hover:text-white md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Zap className="w-6 h-6 text-scada-accent hidden sm:block" />
        <h1 className="text-lg font-bold tracking-wide">
          <span className="text-scada-accent">Grid</span>
          <span className="text-scada-text">Vision</span>
          <span className="text-xs ml-2 text-gray-400 font-normal hidden sm:inline">SCADA</span>
        </h1>
        <span className="text-xs text-gray-500 ml-4 hidden lg:inline">MSEDCL Smart Distribution</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5 text-xs">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="w-4 h-4 text-scada-success" />
              <span className="text-scada-success hidden sm:inline">LIVE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-scada-danger" />
              <span className="text-scada-danger hidden sm:inline">OFFLINE</span>
            </>
          )}
        </div>

        {/* Current time */}
        <div className="hidden sm:block">
          <Clock />
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 hidden sm:inline">{user?.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-scada-accent/20 text-scada-accent">
            {user?.role}
          </span>
          <button
            onClick={logout}
            className="p-1.5 rounded hover:bg-scada-border/50 text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Clock() {
  return (
    <div className="text-xs font-mono text-gray-400">
      {new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
    </div>
  );
}
