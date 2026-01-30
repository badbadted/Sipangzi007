import { useState, useMemo } from 'react';
import Modal from 'react-modal';
import { X, FileUp } from 'lucide-react';
import { Button } from '../common/Button';
import { parseBatchImport, BATCH_IMPORT_PLACEHOLDER, type BatchEventRow } from '../../lib/batchImport';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: BatchEventRow[]) => Promise<void>;
  loading?: boolean;
}

Modal.setAppElement('#root');

export function BatchImportModal({
  isOpen,
  onClose,
  onImport,
  loading = false,
}: BatchImportModalProps) {
  const [rawText, setRawText] = useState('');

  const parsed = useMemo(() => parseBatchImport(rawText), [rawText]);
  const hasValidRows = parsed.length > 0;

  const handleClose = () => {
    setRawText('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!hasValidRows) return;
    try {
      await onImport(parsed);
      handleClose();
    } catch (error) {
      throw error;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="成批輸入賽事"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-slate-900/50"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            成批輸入賽事
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1 space-y-4">
          <p className="text-sm text-slate-500">
            貼上表格內容，欄位順序：國外賽事、比賽日期、賽事名稱、比賽國家、比賽城市（Tab 或逗號分隔）。國外賽事填 O 為國外、X 為國內，留空為國內。
          </p>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={BATCH_IMPORT_PLACEHOLDER}
            className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            spellCheck={false}
          />
          {hasValidRows && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <p className="text-sm font-bold text-slate-700 px-3 py-2 bg-slate-50 border-b border-slate-200">
                預覽：共 {parsed.length} 筆
              </p>
              <div className="max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="px-3 py-2 font-bold text-slate-700">賽事名稱</th>
                      <th className="px-3 py-2 font-bold text-slate-700">比賽日期</th>
                      <th className="px-3 py-2 font-bold text-slate-700">地點</th>
                      <th className="px-3 py-2 font-bold text-slate-700">國內/國外</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-800">{row.name}</td>
                        <td className="px-3 py-2 text-slate-600">{row.eventDate}</td>
                        <td className="px-3 py-2 text-slate-600">{row.location}</td>
                        <td className="px-3 py-2">{row.isDomestic ? '國內' : '國外'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.length > 10 && (
                  <p className="text-xs text-slate-500 px-3 py-2 border-t border-slate-100">
                    尚有 {parsed.length - 10} 筆未顯示…
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!hasValidRows}
            loading={loading}
          >
            匯入 {parsed.length} 筆
          </Button>
        </div>
      </div>
    </Modal>
  );
}
