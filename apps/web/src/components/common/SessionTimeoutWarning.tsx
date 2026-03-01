import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { refreshTokenApi } from '@/services/auth';
import { Clock, X } from 'lucide-react';

export default function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  // Auto-refresh token when it's about to expire
  const doRefresh = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const { accessToken: newAccess, refreshToken: newRefresh } = await refreshTokenApi(refreshToken);
      setTokens(newAccess, newRefresh);
      setShowWarning(false);
      setDismissed(false);
    } catch {
      // refresh failed — show warning
    }
  }, [refreshToken, setTokens]);

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
        // Auto-refresh when 10 minutes remain
        if (expiresIn < 10 * 60 * 1000 && refreshToken) {
          doRefresh();
          return;
        }
        // Show warning only if refresh fails and < 5 min remain
        if (expiresIn < 5 * 60 * 1000) {
          setShowWarning(true);
          setRemaining(Math.ceil(expiresIn / 1000));
        } else {
          setShowWarning(false);
          setDismissed(false);
        }
      } catch {
        // token parse failed
      }
    };

    check();
    const interval = setInterval(check, 30000); // check every 30s instead of 10s
    return () => clearInterval(interval);
  }, [accessToken, refreshToken, logout, doRefresh]);

  // Also refresh on user activity
  useEffect(() => {
    let lastActivity = Date.now();
    const onActivity = () => { lastActivity = Date.now(); };
    window.addEventListener('mousemove', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity, { passive: true });
    window.addEventListener('click', onActivity, { passive: true });

    // If user is active and token is close to expiry, auto-refresh
    const activityCheck = setInterval(() => {
      if (!accessToken) return;
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expiresIn = payload.exp * 1000 - Date.now();
        const userActive = Date.now() - lastActivity < 5 * 60 * 1000; // active in last 5 min
        if (expiresIn < 15 * 60 * 1000 && userActive && refreshToken) {
          doRefresh();
        }
      } catch {}
    }, 60000); // check every minute

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('click', onActivity);
      clearInterval(activityCheck);
    };
  }, [accessToken, refreshToken, doRefresh]);

  if (!showWarning || dismissed) return null;

  return (
    <div className="fixed top-14 right-4 z-50 bg-orange-50 border border-orange-300 rounded-lg p-3 shadow-lg max-w-xs">
      <div className="flex items-start gap-2 text-orange-700 text-sm">
        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium">Session Expiring</div>
          <div className="text-xs text-orange-600 mt-0.5">
            Expires in <span className="font-mono font-bold">{remaining}s</span>.
          </div>
          <button
            onClick={doRefresh}
            className="mt-1 px-2 py-0.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Extend Session
          </button>
        </div>
        <button onClick={() => setDismissed(true)} className="text-orange-400 hover:text-orange-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
