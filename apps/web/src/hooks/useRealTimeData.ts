import { useMemo } from 'react';
import { useRealtimeStore } from '@/stores/realtimeStore';
import type { RealTimeValue } from '@ampris/shared';

export function useRealTimeValue(tag: string): RealTimeValue | undefined {
  return useRealtimeStore((s) => s.values[tag]);
}

export function useRealTimeValues(tags: string[]): Record<string, RealTimeValue | undefined> {
  const values = useRealtimeStore((s) => s.values);
  return useMemo(() => {
    const result: Record<string, RealTimeValue | undefined> = {};
    for (const tag of tags) {
      result[tag] = values[tag];
    }
    return result;
  }, [tags, values]);
}

export function useNumericValue(tag: string, decimals = 2): string {
  const value = useRealtimeStore((s) => s.values[tag]);
  if (!value || typeof value.value !== 'number') return '---';
  return value.value.toFixed(decimals);
}

export function useDigitalState(tag: string): boolean | undefined {
  const value = useRealtimeStore((s) => s.values[tag]);
  if (!value) return undefined;
  return Boolean(value.value);
}
