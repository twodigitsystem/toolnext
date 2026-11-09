"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
}

const STORAGE_KEY = "toolnext-recent-searches";

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
  recentSearches: [],
  addRecentSearch: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore storage errors
    }
  }, []);

  const addRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== q.toLowerCase());
      const updated = [q, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ query, setQuery, recentSearches, addRecentSearch }),
    [query, recentSearches, addRecentSearch],
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
