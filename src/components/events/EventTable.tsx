import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { Event } from '../../types/event';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">目前沒有賽事資料</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">
                賽事名稱
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">
                比賽日期
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">
                地點
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">
                類型
              </th>
              <th className="px-6 py-3 text-right text-sm font-bold text-slate-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {event.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {event.eventDate}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {event.location}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={event.isDomestic ? 'domestic' : 'international'}>
                    {event.isDomestic ? '國內' : '國外'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(event)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
