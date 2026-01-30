import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { Event } from '../../types/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-black text-slate-900">{event.name}</h3>
        <Badge variant={event.isDomestic ? 'domestic' : 'international'}>
          {event.isDomestic ? '國內' : '國外'}
        </Badge>
      </div>

      <div className="space-y-2 text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{event.eventDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
}
