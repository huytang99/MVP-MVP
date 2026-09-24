import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, X, ArrowRight } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImport: (records: { vin: string; price: number }[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onApplyImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    validCount: number;
    errors: string[];
    validRecords: { vin: string; price: number }[];
    notFoundVinsCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulateFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Realistic simulation: 5 valid updates, 1 row error, 1 unknown VIN per 4.7
      setImportSummary({
        validCount: 4,
        notFoundVinsCount: 1,
        errors: [
          'Row 3: Invalid price format "N/A" (only numeric digits allowed).',
          'Row 7: Price $14,200 is below vendor minimum limit ($15,000).',
        ],
        validRecords: [
          { vin: 'WMZ53BR03N3N38175', price: 24500 },
          { vin: 'WBA53AY05PFP19842', price: 34000 },
          { vin: 'WMZ83BR00N3N48840', price: 26500 },
          { vin: 'WMZ83BR06N3N57798', price: 21900 },
        ],
      });
    }, 600);
  };

  const handleApply = () => {
    if (importSummary) {
      onApplyImport(importSummary.validRecords);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <FileSpreadsheet className="w-4 h-4 text-[#173B68]" />
            <span>Import Vehicle Pricing Batch</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-slate-600">
            Upload a CSV or XLSX spreadsheet containing <strong>VIN</strong> and <strong>Price</strong> columns.
            Values will be queued into your active session for review prior to saving.
          </p>

          {/* Drag & Drop Area */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer transition-colors"
            onClick={() => handleSimulateFileSelect('BMW_Remarketing_Reprice_Batch_0923.csv')}
          >
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">
              {selectedFile ? selectedFile : 'Click to select CSV or XLSX file, or drag and drop'}
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Required headers: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">VIN</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Price</code>
            </p>
          </div>

          {/* Results Summary */}
          {importSummary && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {importSummary.validCount} valid pricing records parsed
                </span>
                <span className="text-[11px] font-mono text-emerald-700">Ready to Review</span>
              </div>

              {importSummary.notFoundVinsCount > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>{importSummary.notFoundVinsCount} VIN</strong> was not found in the active remarketing inventory.
                  </span>
                </div>
              )}

              {importSummary.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 text-[11px] space-y-1">
                  <span className="font-bold block">File validation errors:</span>
                  <ul className="list-disc list-inside space-y-0.5 font-mono">
                    {importSummary.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!importSummary || isProcessing || importSummary.validCount === 0}
            className="px-4 py-1.5 bg-[#173B68] text-white rounded font-semibold hover:bg-[#122d50] disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Show {importSummary?.validCount || 0} Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
