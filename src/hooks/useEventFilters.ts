import { useState, useCallback } from 'react';
import type { EventFilters } from '../types/event';

const initialFilters: EventFilters = {
  isDomestic: null,
  fromDate: '',
  toDate: '',
  location: '',
  keyword: '',
};

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.isDomestic !== null ||
      filters.fromDate !== '' ||
      filters.toDate !== '' ||
      filters.location !== '' ||
      filters.keyword !== ''
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
