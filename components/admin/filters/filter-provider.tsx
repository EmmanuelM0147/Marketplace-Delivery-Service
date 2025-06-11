"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterState {
  search: string;
  dateRange: { from?: Date; to?: Date };
  categories: string[];
  status: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface FilterContextType {
  filters: FilterState;
  setSearch: (search: string) => void;
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  setCategories: (categories: string[]) => void;
  setStatus: (status: string[]) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  resetFilters: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  search: "",
  dateRange: {},
  categories: [],
  status: [],
  sortBy: "created_at",
  sortOrder: "desc",
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlFilters: Partial<FilterState> = {};

    if (params.has("search")) urlFilters.search = params.get("search") || "";
    if (params.has("from") || params.has("to")) {
      urlFilters.dateRange = {
        from: params.get("from") ? new Date(params.get("from")!) : undefined,
        to: params.get("to") ? new Date(params.get("to")!) : undefined,
      };
    }
    if (params.has("categories")) {
      urlFilters.categories = params.get("categories")?.split(",") || [];
    }
    if (params.has("status")) {
      urlFilters.status = params.get("status")?.split(",") || [];
    }
    if (params.has("sortBy")) urlFilters.sortBy = params.get("sortBy") || "created_at";
    if (params.has("sortOrder")) {
      urlFilters.sortOrder = (params.get("sortOrder") || "desc") as "asc" | "desc";
    }

    setFilters((prev) => ({ ...prev, ...urlFilters }));
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.dateRange.from) {
      params.set("from", newFilters.dateRange.from.toISOString());
    }
    if (newFilters.dateRange.to) {
      params.set("to", newFilters.dateRange.to.toISOString());
    }
    if (newFilters.categories.length) {
      params.set("categories", newFilters.categories.join(","));
    }
    if (newFilters.status.length) {
      params.set("status", newFilters.status.join(","));
    }
    if (newFilters.sortBy !== "created_at") {
      params.set("sortBy", newFilters.sortBy);
    }
    if (newFilters.sortOrder !== "desc") {
      params.set("sortOrder", newFilters.sortOrder);
    }

    router.push(`?${params.toString()}`);
  }, [router]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, search };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const setDateRange = useCallback((dateRange: { from?: Date; to?: Date }) => {
    setFilters((prev) => {
      const newFilters = { ...prev, dateRange };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const setCategories = useCallback((categories: string[]) => {
    setFilters((prev) => {
      const newFilters = { ...prev, categories };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const setStatus = useCallback((status: string[]) => {
    setFilters((prev) => {
      const newFilters = { ...prev, status };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const setSortBy = useCallback((sortBy: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, sortBy };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const setSortOrder = useCallback((sortOrder: "asc" | "desc") => {
    setFilters((prev) => {
      const newFilters = { ...prev, sortOrder };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  }, [updateURL]);

  const savePreset = useCallback((name: string) => {
    const presets = JSON.parse(localStorage.getItem("filterPresets") || "{}");
    presets[name] = filters;
    localStorage.setItem("filterPresets", JSON.stringify(presets));
  }, [filters]);

  const loadPreset = useCallback((name: string) => {
    const presets = JSON.parse(localStorage.getItem("filterPresets") || "{}");
    if (presets[name]) {
      const newFilters = presets[name];
      setFilters(newFilters);
      updateURL(newFilters);
    }
  }, [updateURL]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearch,
        setDateRange,
        setCategories,
        setStatus,
        setSortBy,
        setSortOrder,
        resetFilters,
        savePreset,
        loadPreset,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}