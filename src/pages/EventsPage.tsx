import { useRef, useEffect, useState, useMemo } from 'react';
import { Loader2, Calendar, Filter } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useEventFilters } from '../hooks/useEventFilters';
import { EventList } from '../components/events/EventList';
import { EventFilters } from '../components/events/EventFilters';

type EventTab = 'upcoming' | 'completed';

export function EventsPage() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useEventFilters();
  const { data: events, isLoading, error } = useEvents(filters);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // 依今日日期分割未完成 / 已完成
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const upcomingEvents = useMemo(() => {
    const upcoming = (events || []).filter((e) => e.eventDate >= today);
    // 報名中的賽事排最前面
    return upcoming.sort((a, b) => {
      const aOpen = a.registrationUrl && (!a.registrationDeadline || today <= a.registrationDeadline);
      const bOpen = b.registrationUrl && (!b.registrationDeadline || today <= b.registrationDeadline);
      if (aOpen && !bOpen) return -1;
      if (!aOpen && bOpen) return 1;
      return a.eventDate.localeCompare(b.eventDate);
    });
  }, [events, today]);
  const completedEvents = useMemo(
    () => (events || []).filter((e) => e.eventDate < today),
    [events, today]
  );

  // 已完成賽事的年份列表（由大到小）
  const completedYears = useMemo(() => {
    const years = new Set(completedEvents.map((e) => parseInt(e.eventDate.slice(0, 4), 10)));
    return Array.from(years).sort((a, b) => b - a);
  }, [completedEvents]);

  // 已完成賽事依年份篩選
  const filteredCompletedEvents = useMemo(() => {
    if (selectedYear === null) return completedEvents;
    return completedEvents.filter(
      (e) => parseInt(e.eventDate.slice(0, 4), 10) === selectedYear
    );
  }, [completedEvents, selectedYear]);

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : filteredCompletedEvents;

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

  // 載入完成後捲動到第一筆
  useEffect(() => {
    if (isLoading || !displayedEvents.length) return;
    const targetId = displayedEvents[0].id;
    const scroll = () => {
      const el = listContainerRef.current?.querySelector(
        `[data-event-id="${targetId}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const t = setTimeout(scroll, 100);
    return () => clearTimeout(t);
  }, [isLoading, displayedEvents]);

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

      {/* 分頁切換：未完成 / 已完成 + 年度切換 */}
      {!isLoading && !error && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              未完成
              {events && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {upcomingEvents.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === 'completed'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              已完成
              {events && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {completedEvents.length}
                </span>
              )}
            </button>
          </div>
          {/* 年度切換按鈕（已完成頁籤時顯示） */}
          {activeTab === 'completed' && completedYears.length > 0 && (
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedYear === null
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                全部
              </button>
              {completedYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    selectedYear === year
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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

      {!isLoading && !error && displayedEvents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            {activeTab === 'upcoming'
              ? '目前沒有未完成的賽事'
              : selectedYear
                ? `${selectedYear} 年沒有已完成的賽事`
                : '目前沒有已完成的賽事'}
          </p>
        </div>
      )}

      {!isLoading && !error && displayedEvents.length > 0 && (
        <EventList ref={listContainerRef} events={displayedEvents} />
      )}
    </div>
  );
}
