import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import type { ControlSelectResponse, ControlResult, CommandType } from '@gridvision/shared';

interface ControlHook {
  selectResponse: ControlSelectResponse | null;
  result: ControlResult | null;
  loading: boolean;
  error: string | null;
  select: (equipmentId: string, commandType: CommandType) => Promise<void>;
  execute: (commandId: string) => Promise<void>;
  cancel: (commandId: string) => Promise<void>;
  reset: () => void;
}

export function useControl(): ControlHook {
  const [selectResponse, setSelectResponse] = useState<ControlSelectResponse | null>(null);
  const [result, setResult] = useState<ControlResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = useCallback(async (equipmentId: string, commandType: CommandType) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ControlSelectResponse>('/control/select', { equipmentId, commandType });
      setSelectResponse(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Select failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const execute = useCallback(async (commandId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ControlResult>('/control/execute', { commandId });
      setResult(data);
      setSelectResponse(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execute failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (commandId: string) => {
    setLoading(true);
    try {
      await api.post('/control/cancel', { commandId });
      setSelectResponse(null);
    } catch {
      // Ignore cancel errors
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSelectResponse(null);
    setResult(null);
    setError(null);
  }, []);

  return { selectResponse, result, loading, error, select, execute, cancel, reset };
}
