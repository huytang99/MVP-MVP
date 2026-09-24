import React from 'react';
import { Download, Upload, RotateCcw, Save, ArrowUpDown, AlertTriangle, AlertOctagon, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { WarningSummary } from '../types/pricing';

interface ResultsToolbarProps {
  totalCount: number;
  pendingCount: number;
  warnings: WarningSummary;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onResetChanges: () => void;
  onSave: () => void;
  isSaving: boolean;
  sortBy: string;
  onSortByChange: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionToggle: () => void;
  thenBy: string;
  onThenByChange: (field: string) => void;
  currentPage: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onJumpToWarning?: (type: 'mmr' | 'priceLimit' | 'mandatory' | 'expired') => void;
}

const SORT_FIELDS = [
  { value: 'vinLast7', label: 'VIN Last 7' },
  { value: 'model', label: 'Model' },
  { value: 'year', label: 'Model Year' },
  { value: 'odometer', label: 'Odometer' },
  { value: 'conditionGrade', label: 'Condition Grade' },
  { value: 'condAdjMmr', label: 'Cond Adj MMR' },
  { value: 'inventoryAge', label: 'Inventory Age' },
  { value: 'status', label: 'Vehicle Status' },
];

export const ResultsToolbar: React.FC<ResultsToolbarProps> = ({
  totalCount,
  pendingCount,
  warnings,
  onOpenExport,
  onOpenImport,
  onResetChanges,
  onSave,
  isSaving,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionToggle,
  thenBy,
  onThenByChange,
  currentPage,
  pageSize,
  onPageSizeChange,
  onPageChange,
  onJumpToWarning,
}) => {
  const startIdx = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-2 mb-3">
      {/* Primary Action & Status Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Consolidated vehicle count & pending changes pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 font-bold text-slate-800 text-sm">
            <span>{totalCount.toLocaleString()}</span>
            <span className="text-slate-500 font-normal text-xs">vehicles found</span>
          </div>

          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              {pendingCount} pending {pendingCount === 1 ? 'change' : 'changes'}
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenExport}
            disabled={totalCount === 0}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 font-medium flex items-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onOpenImport}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 font-medium flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={onResetChanges}
            disabled={pendingCount === 0}
            className="px-3 py-1.5 bg-white border border-slate-300 text-amber-800 rounded hover:bg-amber-50/50 font-medium flex items-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset Changes</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={pendingCount === 0 || isSaving}
            className="px-4 py-1.5 bg-[#173B68] hover:bg-[#122d50] text-white rounded font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving…' : `Save ${pendingCount} ${pendingCount === 1 ? 'Change' : 'Changes'}`}</span>
          </button>
        </div>
      </div>

      {/* Pre-Save Warning Notification Bar: Surfacing warnings before save per Section 5.5 */}
      {warnings.totalWarnings > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-md px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">Pre-Save Validation Review:</span>
            <span className="text-slate-700">
              {warnings.totalWarnings} warning {warnings.totalWarnings === 1 ? 'condition' : 'conditions'} flagged on current page
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            {warnings.mandatoryNotPriced.count > 0 && (
              <button
                type="button"
                onClick={() => onJumpToWarning?.('mandatory')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 rounded font-semibold cursor-pointer"
              >
                <Info className="w-3 h-3 text-sky-700" />
                <span>{warnings.mandatoryNotPriced.count} mandatory unpriced</span>
              </button>
            )}

            {warnings.mmrRange.count > 0 && (
              <button
                type="button"
                onClick={() => onJumpToWarning?.('mmr')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-semibold cursor-pointer"
              >
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                <span>{warnings.mmrRange.count} outside ±6% MMR</span>
              </button>
            )}

            {warnings.priceLimit.count > 0 && (
              <button
                type="button"
                onClick={() => onJumpToWarning?.('priceLimit')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded font-semibold cursor-pointer"
              >
                <AlertOctagon className="w-3 h-3 text-red-700" />
                <span>{warnings.priceLimit.count} price limit violations</span>
              </button>
            )}

            {warnings.expiredInspection.count > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-900 border border-orange-300 rounded font-semibold">
                <span>{warnings.expiredInspection.count} expired inspections</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Secondary Controls Bar: Sorting & Paging */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
        {/* Sort Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-[#173B68]"
            >
              {SORT_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onSortDirectionToggle}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-600"
              title={`Toggle sort direction (currently ${sortDirection.toUpperCase()})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-500 uppercase">{sortDirection}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Then By</span>
            <select
              value={thenBy}
              onChange={(e) => onThenByChange(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-[#173B68]"
            >
              <option value="none">None</option>
              {SORT_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paging Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="text-slate-600">
            Showing <strong className="text-slate-900 font-mono">{startIdx}–{endIdx}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{totalCount.toLocaleString()}</strong>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
