import { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { EventFilters as EventFiltersType } from '../../types/event';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFilterChange: <K extends keyof EventFiltersType>(key: K, value: EventFiltersType[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  variant?: 'block' | 'popover';
  onClose?: () => void;
}

export function EventFilters({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  variant = 'block',
  onClose,
}: EventFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const parseDate = (dateStr: string | undefined): Date | null => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Popover 模式：僅渲染篩選表單，不含外層卡片與標題
  if (variant === 'popover') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">篩選條件</h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
        <div className="space-y-3">
          {/* 國內/國外切換 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              賽事類型
            </label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden">
              <button
                type="button"
                className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors ${
                  filters.isDomestic === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => onFilterChange('isDomestic', null)}
              >
                全部
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors border-x border-slate-300 ${
                  filters.isDomestic === true
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => onFilterChange('isDomestic', true)}
              >
                國內
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors ${
                  filters.isDomestic === false
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => onFilterChange('isDomestic', false)}
              >
                國外
              </button>
            </div>
          </div>

          {/* 日期範圍 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                開始日期
              </label>
              <DatePicker
                selected={parseDate(filters.fromDate)}
                onChange={(date) => onFilterChange('fromDate', formatDate(date))}
                dateFormat="yyyy-MM-dd"
                placeholderText="選擇日期"
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                isClearable
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                結束日期
              </label>
              <DatePicker
                selected={parseDate(filters.toDate)}
                onChange={(date) => onFilterChange('toDate', formatDate(date))}
                dateFormat="yyyy-MM-dd"
                placeholderText="選擇日期"
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                isClearable
              />
            </div>
          </div>

          {/* 地點關鍵字 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              地點
            </label>
            <input
              type="text"
              placeholder="輸入地點關鍵字"
              value={filters.location || ''}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 賽事名稱關鍵字 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              賽事名稱
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋賽事名稱"
                value={filters.keyword || ''}
                onChange={(e) => onFilterChange('keyword', e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 重置按鈕 */}
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={onReset} className="w-full">
              <X className="w-4 h-4 mr-1" />
              清除篩選
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Block 模式：原有的折疊式卡片
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 mb-2 text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-black text-slate-900">篩選條件</h2>
          {hasActiveFilters && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
              已篩選
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {expanded && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 國內/國外切換 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            賽事類型
          </label>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            <button
              type="button"
              className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors ${
                filters.isDomestic === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => onFilterChange('isDomestic', null)}
            >
              全部
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors border-x border-slate-300 ${
                filters.isDomestic === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => onFilterChange('isDomestic', true)}
            >
              國內
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-1.5 text-sm font-bold transition-colors ${
                filters.isDomestic === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => onFilterChange('isDomestic', false)}
            >
              國外
            </button>
          </div>
        </div>

        {/* 日期範圍 - 開始日期 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            開始日期
          </label>
          <DatePicker
            selected={parseDate(filters.fromDate)}
            onChange={(date) => onFilterChange('fromDate', formatDate(date))}
            dateFormat="yyyy-MM-dd"
            placeholderText="選擇開始日期"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            isClearable
          />
        </div>

        {/* 日期範圍 - 結束日期 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            結束日期
          </label>
          <DatePicker
            selected={parseDate(filters.toDate)}
            onChange={(date) => onFilterChange('toDate', formatDate(date))}
            dateFormat="yyyy-MM-dd"
            placeholderText="選擇結束日期"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            isClearable
          />
        </div>

        {/* 地點關鍵字 */}
        <div>
          <Input
            label="地點"
            placeholder="輸入地點關鍵字"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>

        {/* 賽事名稱關鍵字 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            賽事名稱
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋賽事名稱"
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 重置按鈕 */}
      {hasActiveFilters && (
        <div className="mt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            清除篩選
          </Button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
