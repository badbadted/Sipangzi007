import { Link, useNavigate } from 'react-router-dom';
import { Bike, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Bike className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-black text-slate-900">
              滑步車賽事資訊系統
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/admin/events">
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    後台管理
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-1" />
                  登出
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
