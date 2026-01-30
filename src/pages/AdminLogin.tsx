import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Bike, LogIn, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkFirestoreConnection } from '../lib/firebase';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

interface LoginFormData {
  password: string;
}

type ConnectionStatus = 'checking' | 'ok' | 'offline';

export function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    checkFirestoreConnection().then((ok) => {
      setConnectionStatus(ok ? 'ok' : 'offline');
    });
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/admin/events', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  if (user) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.password);
      toast.success('登入成功！');
      navigate('/admin/events');
    } catch (error) {
      console.error('Login error:', error);
      const msg =
        error instanceof Error && error.message.includes('offline')
          ? '無法連線至 Firebase，請檢查網路後再試。'
          : '登入失敗，請檢查密碼是否正確。';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex flex-col items-center mb-8">
            <Bike className="w-12 h-12 text-blue-600 mb-4" />
            <h1 className="text-2xl font-black text-slate-900">後台登入</h1>
            <p className="text-slate-500 mt-1">滑步車賽事資訊系統</p>
            {connectionStatus === 'checking' && (
              <p className="text-slate-500 mt-2 text-sm">正在檢查 Firebase 連線…</p>
            )}
            {connectionStatus === 'offline' && (
              <p className="text-orange-600 mt-2 text-sm flex items-center gap-1">
                <WifiOff className="w-4 h-4" />
                無法連線至 Firebase，請檢查網路後再試
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="password"
              label="密碼"
              placeholder="請輸入密碼"
              {...register('password', {
                required: '請輸入密碼',
                minLength: {
                  value: 4,
                  message: '密碼至少需要 4 個字元',
                },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={connectionStatus === 'checking'}
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              登入
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
