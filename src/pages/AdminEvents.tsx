import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Plus, Settings, Loader2, KeyRound, LogOut, FileUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents';
import { EventTable } from '../components/events/EventTable';
import { EventForm } from '../components/events/EventForm';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal';
import { BatchImportModal } from '../components/admin/BatchImportModal';
import { Button } from '../components/common/Button';
import type { Event } from '../types/event';
import type { BatchEventRow } from '../lib/batchImport';

export function AdminEvents() {
  const { changePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [batchImportLoading, setBatchImportLoading] = useState(false);

  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleOpenForm = (event?: Event) => {
    setEditingEvent(event || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (data: {
    name: string;
    eventDate: string;
    location: string;
    isDomestic: boolean;
    registrationUrl?: string;
    registrationDeadline?: string;
  }) => {
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent.id, ...data });
        toast.success('賽事更新成功！');
      } else {
        await createEvent.mutateAsync(data);
        toast.success('賽事新增成功！');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(editingEvent ? '更新失敗，請稍後再試。' : '新增失敗，請稍後再試。');
      throw error;
    }
  };

  const handleDelete = (event: Event) => {
    confirmAlert({
      title: '確認刪除',
      message: `確定要刪除「${event.name}」嗎？此操作無法復原。`,
      buttons: [
        {
          label: '取消',
          onClick: () => {},
        },
        {
          label: '刪除',
          onClick: async () => {
            try {
              await deleteEvent.mutateAsync(event.id);
              toast.success('賽事已刪除！');
            } catch (error) {
              console.error('Delete error:', error);
              toast.error('刪除失敗，請稍後再試。');
            }
          },
        },
      ],
    });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setChangePasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('密碼已變更！');
      setIsChangePasswordOpen(false);
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error instanceof Error ? error.message : '目前密碼錯誤，請重試。');
      throw error;
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleBatchImport = async (rows: BatchEventRow[]) => {
    setBatchImportLoading(true);
    try {
      let success = 0;
      let fail = 0;
      for (const row of rows) {
        try {
          await createEvent.mutateAsync(row);
          success += 1;
        } catch {
          fail += 1;
        }
      }
      if (fail > 0) {
        toast.warning(`已匯入 ${success} 筆，${fail} 筆失敗。`);
      } else {
        toast.success(`已成功匯入 ${success} 筆賽事！`);
      }
      setIsBatchImportOpen(false);
    } catch (error) {
      console.error('Batch import error:', error);
      toast.error('匯入失敗，請稍後再試。');
      throw error;
    } finally {
      setBatchImportLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-black text-slate-900">賽事管理</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsChangePasswordOpen(true)}>
            <KeyRound className="w-4 h-4 mr-2" />
            變更密碼
          </Button>
          <Button variant="secondary" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
          <Button variant="secondary" onClick={() => setIsBatchImportOpen(true)}>
            <FileUp className="w-4 h-4 mr-2" />
            成批輸入
          </Button>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="w-4 h-4 mr-2" />
            新增賽事
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <EventTable
          events={events || []}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      )}

      <EventForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        event={editingEvent}
        loading={createEvent.isPending || updateEvent.isPending}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onChangePassword={handleChangePassword}
        loading={changePasswordLoading}
      />

      <BatchImportModal
        isOpen={isBatchImportOpen}
        onClose={() => setIsBatchImportOpen(false)}
        onImport={handleBatchImport}
        loading={batchImportLoading}
      />
    </div>
  );
}
