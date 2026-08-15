import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribeToKey(key: string) {
  return (callback: () => void) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(callback);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.get(key)!.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  };
}

function getItem(key: string) {
  return window.localStorage.getItem(key);
}

export function useStoredJson<T>(key: string, fallback: T): [T, (value: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(subscribeToKey(key), () => getItem(key), () => null);
  const value = raw ? (JSON.parse(raw) as T) : fallback;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = raw ? (JSON.parse(raw) as T) : fallback;
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      window.localStorage.setItem(key, JSON.stringify(resolved));
      emit(key);
    },
    [fallback, key, raw],
  );

  return [value, setValue];
}
