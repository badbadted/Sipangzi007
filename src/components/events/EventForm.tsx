import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { X } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Event } from '../../types/event';

interface EventFormData {
  name: string;
  eventDate: string;
  location: string;
  isDomestic: boolean;
  registrationUrl?: string;
  registrationDeadline?: string;
}

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  event?: Event | null;
  loading?: boolean;
}

Modal.setAppElement('#root');

export function EventForm({ isOpen, onClose, onSubmit, event, loading }: EventFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      name: '',
      eventDate: '',
      location: '',
      isDomestic: true,
      registrationUrl: '',
      registrationDeadline: '',
    },
  });

  const eventDate = watch('eventDate');
  const isDomestic = watch('isDomestic');
  const registrationDeadline = watch('registrationDeadline');

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        eventDate: event.eventDate,
        location: event.location,
        isDomestic: event.isDomestic,
        registrationUrl: event.registrationUrl || '',
        registrationDeadline: event.registrationDeadline || '',
      });
    } else {
      reset({
        name: '',
        eventDate: '',
        location: '',
        isDomestic: true,
        registrationUrl: '',
        registrationDeadline: '',
      });
    }
  }, [event, reset]);

  const handleFormSubmit = async (data: EventFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-lg w-full mx-auto mt-20 bg-white rounded-2xl shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">
            {event ? '編輯賽事' : '新增賽事'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="賽事名稱"
            placeholder="請輸入賽事名稱"
            {...register('name', { required: '請輸入賽事名稱' })}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              比賽日期
            </label>
            <DatePicker
              selected={parseDate(eventDate)}
              onChange={(date) => setValue('eventDate', formatDate(date))}
              dateFormat="yyyy-MM-dd"
              placeholderText="選擇比賽日期"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.eventDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            <input
              type="hidden"
              {...register('eventDate', { required: '請選擇比賽日期' })}
            />
            {errors.eventDate && (
              <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
            )}
          </div>

          <Input
            label="地點"
            placeholder="請輸入比賽地點"
            {...register('location', { required: '請輸入比賽地點' })}
            error={errors.location?.message}
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              賽事類型
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  checked={isDomestic === true}
                  onChange={() => setValue('isDomestic', true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">國內</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  checked={isDomestic === false}
                  onChange={() => setValue('isDomestic', false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">國外</span>
              </label>
            </div>
          </div>

          <Input
            label="報名連結（選填）"
            placeholder="請輸入報名連結 URL"
            {...register('registrationUrl')}
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              報名截止日（選填）
            </label>
            <DatePicker
              selected={parseDate(registrationDeadline || '')}
              onChange={(date) => setValue('registrationDeadline', formatDate(date))}
              dateFormat="yyyy-MM-dd"
              placeholderText="選擇報名截止日"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              isClearable
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" loading={loading}>
              {event ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
