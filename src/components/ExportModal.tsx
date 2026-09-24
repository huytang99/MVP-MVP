import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  totalCount,
}) => {
  const [format, setFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1000);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Download className="w-4 h-4 text-[#173B68]" />
            <span>Export Multiple Vehicle Pricing Data</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-slate-600">
            Export snapshot of <strong>{totalCount.toLocaleString()} vehicles</strong> matching current submitted search criteria in active sort order.
          </p>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-800">Select Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-colors ${
                  format === 'excel'
                    ? 'border-[#173B68] bg-blue-50/50 text-[#173B68] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-colors ${
                  format === 'csv'
                    ? 'border-[#173B68] bg-blue-50/50 text-[#173B68] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-700" />
                <span>CSV (.csv)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-colors ${
                  format === 'pdf'
                    ? 'border-[#173B68] bg-blue-50/50 text-[#173B68] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 text-red-700" />
                <span>PDF (.pdf)</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
            Note: Pending unqueued edits in the active session will not be included in the snapshot export until committed.
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-1.5 bg-[#173B68] text-white rounded font-semibold hover:bg-[#122d50] flex items-center gap-1.5"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating…' : 'Download Snapshot'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
