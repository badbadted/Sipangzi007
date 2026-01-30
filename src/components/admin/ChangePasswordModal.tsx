import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  loading?: boolean;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onChangePassword,
  loading = false,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { message: '確認密碼與新密碼不一致' });
      return;
    }
    try {
      await onChangePassword(data.currentPassword, data.newPassword);
      reset();
      onClose();
    } catch (error) {
      setError('currentPassword', {
        message: error instanceof Error ? error.message : '目前密碼錯誤',
      });
      throw error;
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="變更密碼"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-slate-900/50"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900">變更密碼</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="password"
            label="目前密碼"
            placeholder="請輸入目前密碼"
            {...register('currentPassword', { required: '請輸入目前密碼' })}
            error={errors.currentPassword?.message}
          />

          <Input
            type="password"
            label="新密碼"
            placeholder="請輸入新密碼"
            {...register('newPassword', {
              required: '請輸入新密碼',
              minLength: { value: 4, message: '密碼至少需要 4 個字元' },
            })}
            error={errors.newPassword?.message}
          />

          <Input
            type="password"
            label="確認新密碼"
            placeholder="請再次輸入新密碼"
            {...register('confirmPassword', {
              required: '請確認新密碼',
              validate: (value) => value === newPassword || '確認密碼與新密碼不一致',
            })}
            error={errors.confirmPassword?.message}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
              取消
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              變更密碼
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
