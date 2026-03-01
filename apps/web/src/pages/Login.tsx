import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { loginApi } from '@/services/auth';
import { Zap, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very Strong', color: 'bg-emerald-500' };
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setError('');
    setLoading(true);

    try {
      const result = await loginApi(username, password);
      setAuth(result.user, result.accessToken, result.refreshToken);
      setFailedAttempts(0);
      // Store last login time
      localStorage.setItem('gridvision-last-login', new Date().toISOString());
      navigate('/app');
    } catch {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const lockout = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockout);
        setError(`Account locked for 5 minutes due to ${MAX_FAILED_ATTEMPTS} failed attempts.`);
      } else {
        setError(`Invalid credentials. ${MAX_FAILED_ATTEMPTS - attempts} attempts remaining.`);
      }
    } finally {
      setLoading(false);
    }
  }, [username, password, isLockedOut, failedAttempts, setAuth, navigate]);

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-scada-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-10 h-10 text-scada-accent" />
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-scada-accent">Grid</span>
                <span className="text-white">Vision</span>
              </h1>
              <p className="text-xs text-gray-400 tracking-widest">SCADA SYSTEM</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            MSEDCL Smart Distribution Substation Monitoring
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-scada-panel border border-scada-border rounded-lg p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-center mb-4">Operator Login</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          {isLockedOut && (
            <div className="bg-orange-900/30 border border-orange-800 text-orange-300 text-sm px-3 py-2 rounded flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Locked out. Try again in{' '}
                <span className="font-mono font-bold">
                  {Math.ceil(lockoutRemaining / 1000)}s
                </span>
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-scada-bg border border-scada-border rounded text-white focus:outline-none focus:border-scada-accent"
              placeholder="Enter username"
              required
              autoFocus
              disabled={isLockedOut}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-scada-bg border border-scada-border rounded text-white focus:outline-none focus:border-scada-accent"
                placeholder="Enter password"
                required
                disabled={isLockedOut}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  Strength: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                </span>
              </div>
            )}
          </div>

          {failedAttempts > 0 && !isLockedOut && (
            <div className="text-xs text-orange-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full py-2.5 bg-scada-accent hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded transition-colors"
          >
            {loading ? 'Authenticating...' : isLockedOut ? 'Account Locked' : 'Login'}
          </button>

          {/* Demo credentials */}
          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-scada-border">
            <p className="mb-1">Demo Credentials:</p>
            <p>admin / admin123 | operator1 / operator123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
