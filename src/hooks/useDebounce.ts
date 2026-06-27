"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Debounces a value by `delay` milliseconds.
 * Useful for search inputs, auto-save, and any input that triggers API calls.
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 400);
 * useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced callback that delays invoking `fn` until
 * `delay` milliseconds have elapsed since the last invocation.
 *
 * Uses a ref-based timer so the returned function identity is stable.
 */
export function useDebouncedCallback(
  fn: (...args: never[]) => void,
  delay: number
): (...args: never[]) => void {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep fnRef current via effect (React 19 compatible)
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: never[]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay]
  );
}