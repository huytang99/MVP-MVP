import React from 'react';
import { AlertTriangle, AlertOctagon, Info, Clock, X, Check } from 'lucide-react';
import { WarningSummary } from '../types/pricing';

interface SaveConfirmationModalProps {
  isOpen: boolean;
  warnings: WarningSummary;
  totalPendingCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  isOpen,
  warnings,
  totalPendingCount,
  onCancel,
  onConfirm,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      // Non-dismissible by clicking backdrop per rule 4.6.2: "It cannot be dismissed by clicking the backdrop."
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">
              Save Confirmation — {warnings.totalWarnings} Warnings
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <p className="text-slate-700 font-medium">
            You are about to save <strong className="text-slate-900">{totalPendingCount} pricing changes</strong>. The following vehicles have warnings:
          </p>

          {/* Group 1: MMR Range Warning (Amber) */}
          {warnings.mmrRange.count > 0 && (
            <div className="bg-amber-50/70 border border-amber-300 rounded-md p-3.5">
              <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  MMR Range Warning
                </span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  {warnings.mmrRange.count}
                </span>
              </div>
              <p className="text-amber-800 text-[11px] mb-2">
                One or more prices are greater or less than 6% of the Condition Adjusted MMR.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                {warnings.mmrRange.items.map((item, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 tracking-wide">{item.vin}:</span>
                    <span className="text-amber-900 font-sans">{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Price Limit Warning (Red) */}
          {warnings.priceLimit.count > 0 && (
            <div className="bg-red-50/70 border border-red-300 rounded-md p-3.5">
              <div className="flex items-center justify-between font-bold text-red-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  Price Limit Warning
                </span>
                <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  {warnings.priceLimit.count}
                </span>
              </div>
              <p className="text-red-800 text-[11px] mb-2">
                One or more vehicles have prices outside the allowed vendor range ($15,000 – $100,000).
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                {warnings.priceLimit.items.map((item, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded border border-red-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 tracking-wide">{item.vin}:</span>
                    <span className="text-red-700 font-sans">
                      {item.limitMessage} {item.willNotBeSaved && <strong className="font-semibold">— will not be saved</strong>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Expired Inspection (Amber/Orange) */}
          {warnings.expiredInspection.count > 0 && (
            <div className="bg-orange-50/70 border border-orange-300 rounded-md p-3.5">
              <div className="flex items-center justify-between font-bold text-orange-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Expired Inspection Re-price Notice
                </span>
                <span className="bg-orange-200 text-orange-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  {warnings.expiredInspection.count}
                </span>
              </div>
              <p className="text-orange-800 text-[11px] mb-2">
                Saving new prices on vehicles with expired inspections will immediately send them back to the inspection queue.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                {warnings.expiredInspection.items.map((item, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded border border-orange-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 tracking-wide">{item.vin}:</span>
                    <span className="text-orange-900 font-sans">{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 4: Mandatory Price Change (Blue/Teal) */}
          {warnings.mandatoryNotPriced.count > 0 && (
            <div className="bg-sky-50/70 border border-sky-300 rounded-md p-3.5">
              <div className="flex items-center justify-between font-bold text-sky-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-600" />
                  Mandatory Price Change — Not Priced / Not Changed
                </span>
                <span className="bg-sky-200 text-sky-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  {warnings.mandatoryNotPriced.count}
                </span>
              </div>
              <p className="text-sky-800 text-[11px] mb-2">
                The following OpenLoop vehicles require a mandatory price change but were not modified or newly priced in this batch:
              </p>
              <div className="space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto pr-1">
                {warnings.mandatoryNotPriced.items.map((item, idx) => (
                  <div key={idx} className="bg-white/90 p-1.5 px-2 rounded border border-sky-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800 tracking-wide">{item.vin}:</span>
                    <span className="text-sky-800 font-sans">{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#173B68] hover:bg-[#122d50] text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Queuing Changes...' : 'Continue & Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
