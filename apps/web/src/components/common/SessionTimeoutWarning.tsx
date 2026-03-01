import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Clock } from 'lucide-react';

export default function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!accessToken) return;

    const check = () => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expiresIn = payload.exp * 1000 - Date.now();
        if (expiresIn <= 0) {
          logout();
          return;
        }
        if (expiresIn < 5 * 60 * 1000) {
          setShowWarning(true);
          setRemaining(Math.ceil(expiresIn / 1000));
        } else {
          setShowWarning(false);
        }
      } catch {
        // token parse failed
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [accessToken, logout]);

  if (!showWarning) return null;

  return (
    <div className="fixed top-14 right-4 z-50 bg-orange-900/90 border border-orange-700 rounded-lg p-3 shadow-lg max-w-xs animate-fade-in">
      <div className="flex items-center gap-2 text-orange-200 text-sm">
        <Clock className="w-4 h-4 shrink-0" />
        <div>
          <div className="font-medium">Session Expiring</div>
          <div className="text-xs text-orange-300 mt-0.5">
            Your session expires in <span className="font-mono font-bold">{remaining}s</span>. Save your work.
          </div>
        </div>
      </div>
    </div>
  );
}
