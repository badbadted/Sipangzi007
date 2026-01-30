import { useRef, useEffect, useState } from 'react';
import { Loader2, Calendar, Filter } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useEventFilters } from '../hooks/useEventFilters';
import { EventList } from '../components/events/EventList';
import { EventFilters } from '../components/events/EventFilters';

export function EventsPage() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useEventFilters();
  const { data: events, isLoading, error } = useEvents(filters);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // 點擊外側關閉 popover
  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterBtnRef.current?.contains(e.target as Node) ||
        filterPanelRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  // 載入完成後訂位在今日或下一場賽事
  useEffect(() => {
    if (isLoading || !events?.length) return;
    const today = new Date().toISOString().slice(0, 10);
    const idx = events.findIndex((e) => e.eventDate >= today);
    const index = idx === -1 ? events.length - 1 : idx;
    const targetId = events[index].id;
    const scroll = () => {
      const el = listContainerRef.current?.querySelector(
        `[data-event-id="${targetId}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const t = setTimeout(scroll, 100);
    return () => clearTimeout(t);
  }, [isLoading, events]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-black text-slate-900">賽事列表</h1>
        </div>
        <div className="relative">
          <button
            ref={filterBtnRef}
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`p-2 rounded-lg border transition-colors ${
              hasActiveFilters()
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            {hasActiveFilters() && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full" />
            )}
          </button>
          {isFilterOpen && (
            <div
              ref={filterPanelRef}
              className="absolute right-0 top-full mt-2 z-20"
            >
              <EventFilters
                variant="popover"
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters()}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          載入賽事時發生錯誤，請稍後再試。
        </div>
      )}

      {!isLoading && !error && events && events.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">目前沒有符合條件的賽事</p>
        </div>
      )}

      {!isLoading && !error && events && events.length > 0 && (
        <EventList ref={listContainerRef} events={events} />
      )}
    </div>
  );
}
