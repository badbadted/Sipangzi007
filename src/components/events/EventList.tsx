import { forwardRef } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { Event } from '../../types/event';

// 取得報名狀態
function getRegistrationStatus(event: Event, today: string): 'open' | 'closed' | 'expired' | 'none' {
  if (!event.registrationUrl) {
    // 沒有 URL 但有截止日且已超過 → 結束報名
    if (event.registrationDeadline && today > event.registrationDeadline) return 'expired';
    return 'none';
  }
  // 無截止日則視為報名中
  if (!event.registrationDeadline) return 'open';
  return today <= event.registrationDeadline ? 'open' : 'closed';
}

// 月份底色對應表（6 色循環）
const MONTH_BG_COLORS = [
  'bg-slate-50',   // 1月, 7月
  'bg-blue-50',    // 2月, 8月
  'bg-amber-50',   // 3月, 9月
  'bg-green-50',   // 4月, 10月
  'bg-violet-50',  // 5月, 11月
  'bg-rose-50',    // 6月, 12月
];

// 根據日期取得月份底色 class
function getMonthBgColor(eventDate: string): string {
  const month = parseInt(eventDate.slice(5, 7), 10); // 取 MM
  return MONTH_BG_COLORS[(month - 1) % 6];
}

interface EventListProps {
  events: Event[];
}

export const EventList = forwardRef<HTMLDivElement, EventListProps>(function EventList(
  { events },
  ref
) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      ref={ref}
      className="min-h-[70vh] max-h-[calc(100vh-12rem)] overflow-auto rounded-xl border border-slate-200"
    >
      <div className="bg-white rounded-xl overflow-hidden">
      {/* 桌面版：表格 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                報名
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  日期
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                賽事名稱
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  地點
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                類型
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => {
              const isPast = event.eventDate < today;
              const regStatus = getRegistrationStatus(event, today);
              const monthBg = getMonthBgColor(event.eventDate);
              return (
                <tr
                  key={event.id}
                  data-event-id={event.id}
                  data-event-date={event.eventDate}
                  className={`transition-colors ${monthBg} ${
                    isPast ? 'opacity-70' : ''
                  } hover:brightness-95`}
                >
                  <td className="px-4 py-3">
                    {regStatus === 'open' && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:text-green-800 hover:underline"
                      >
                        報名中
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {regStatus === 'closed' && (
                      <span className="text-sm font-bold text-red-600">報名截止</span>
                    )}
                    {regStatus === 'expired' && (
                      <span className="text-sm font-bold text-red-600">結束報名</span>
                    )}
                    {regStatus === 'none' && (
                      <span className="text-sm text-slate-400">未開放</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold text-base ${
                        isPast ? 'text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {event.eventDate.slice(5)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${isPast && !event.nameColor ? 'text-slate-500' : !event.nameColor ? 'text-black' : ''}`}
                      style={event.nameColor ? { color: event.nameColor } : undefined}
                    >
                      {event.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={isPast && !event.locationColor ? 'text-slate-500' : !event.locationColor ? 'text-black' : ''}
                      style={event.locationColor ? { color: event.locationColor } : undefined}
                    >
                      {event.location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={event.isDomestic ? 'domestic' : 'international'}>
                        {event.isDomestic ? '國內' : '國外'}
                      </Badge>
                      {isPast && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                          比賽完成
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 手機版：堆疊式列表 */}
      <div className="md:hidden divide-y divide-slate-100">
        {events.map((event) => {
          const isPast = event.eventDate < today;
          const regStatus = getRegistrationStatus(event, today);
          const monthBg = getMonthBgColor(event.eventDate);
          return (
            <div
              key={event.id}
              data-event-id={event.id}
              data-event-date={event.eventDate}
              className={`px-4 py-3 transition-colors ${monthBg} ${
                isPast ? 'opacity-70' : ''
              }`}
            >
              {/* 第一列：報名狀態 + 日期 */}
              <div className="flex items-center gap-3 mb-1">
                {regStatus === 'open' && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:text-green-800"
                  >
                    報名中
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {regStatus === 'closed' && (
                  <span className="text-sm font-bold text-red-600">報名截止</span>
                )}
                {regStatus === 'expired' && (
                  <span className="text-sm font-bold text-red-600">結束報名</span>
                )}
                {regStatus === 'none' && (
                  <span className="text-sm text-slate-400">未開放</span>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span
                    className={`font-bold ${isPast ? 'text-slate-500' : 'text-slate-900'}`}
                  >
                    {event.eventDate.slice(5)}
                  </span>
                </div>
              </div>
              {/* 第二列：賽事名稱 + 地點 */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`font-bold ${isPast && !event.nameColor ? 'text-slate-500' : !event.nameColor ? 'text-black' : ''}`}
                  style={event.nameColor ? { color: event.nameColor } : undefined}
                >
                  {event.name}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span
                    className={isPast && !event.locationColor ? 'text-slate-500' : !event.locationColor ? 'text-black' : ''}
                    style={event.locationColor ? { color: event.locationColor } : undefined}
                  >
                    {event.location}
                  </span>
                </div>
              </div>
              {/* 第三列：類型 */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={event.isDomestic ? 'domestic' : 'international'}>
                  {event.isDomestic ? '國內' : '國外'}
                </Badge>
                {isPast && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                    比賽完成
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
});
