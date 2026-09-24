import React from 'react';
import { 
  FileText, 
  Eye, 
  ClipboardList, 
  RotateCcw, 
  AlertTriangle, 
  AlertOctagon, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Vehicle, PendingEdit } from '../../types/pricing';
import { BatteryPopover } from '../BatteryPopover';
import { formatCurrency, formatNumber, MOCK_CASCADE_OPTIONS } from '../../mock/mockVehicles';

interface Direction1Props {
  vehicles: Vehicle[];
  pendingEdits: Record<string, PendingEdit>;
  onPriceChange: (vehicleId: string, val: string) => void;
  onPriceBlur: (vehicle: Vehicle) => void;
  onCascadeChange: (vehicleId: string, val: string) => void;
  onRevertPrice: (vehicle: Vehicle) => void;
  onRevertCascade: (vehicle: Vehicle) => void;
  onOpenDetails: (vehicle: Vehicle) => void;
}

export const Direction1WorksheetGrid: React.FC<Direction1Props> = ({
  vehicles,
  pendingEdits,
  onPriceChange,
  onPriceBlur,
  onCascadeChange,
  onRevertPrice,
  onRevertCascade,
  onOpenDetails,
}) => {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
      {/* Direction Banner */}
      <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide uppercase text-blue-300">Direction 1:</span>
          <span className="font-semibold">Financial Remarketing Worksheet</span>
          <span className="text-slate-400 hidden sm:inline">— High-density column-aligned financial grid for keyboard-first batch throughput</span>
        </div>
        <div className="text-[11px] text-slate-300 font-mono">
          [Tab] next field • [Enter] next vehicle price
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 min-w-[200px]">Vehicle / Trim / Specs</th>
              <th className="py-2.5 px-3 min-w-[155px]">VIN / Reg</th>
              <th className="py-2.5 px-2 text-right">Odo / Grd</th>
              <th className="py-2.5 px-3 text-right">Cond Adj MMR</th>
              <th className="py-2.5 px-3 text-right">Base MMR</th>
              <th className="py-2.5 px-3 text-right">Last BGD</th>
              <th className="py-2.5 px-3 text-right">DP Consign</th>
              <th className="py-2.5 px-3 min-w-[170px]">Sales Cascade</th>
              <th className="py-2.5 px-3 min-w-[190px] text-right">Target Price</th>
              <th className="py-2.5 px-3 text-center w-28">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vehicles.map((v, index) => {
              const edit = pendingEdits[v.id];
              const displayPrice = edit !== undefined ? edit.price : v.currentPrice.toString();
              const displayCascade = edit !== undefined ? edit.cascade : v.currentCascade;
              const isModified = edit && (edit.isPriceTouched || edit.isCascadeTouched);
              const isPriceDiff = edit && Number(edit.price) !== v.currentPrice && edit.price !== '';
              const isCascadeDiff = edit && edit.cascade !== v.currentCascade;
              const vinPrefix = v.vin.slice(0, v.vin.length - 7);
              const vinLast7 = v.vin.slice(-7);

              // Row styling depending on status
              let rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';
              let borderLeftStyle = 'border-l-4 border-transparent';

              if (v.saveErrorMessage) {
                rowBg = 'bg-red-50/40';
                borderLeftStyle = 'border-l-4 border-red-600';
              } else if (edit?.status === 'error') {
                rowBg = 'bg-red-50/30';
                borderLeftStyle = 'border-l-4 border-red-500';
              } else if (edit?.status === 'warning') {
                rowBg = 'bg-amber-50/30';
                borderLeftStyle = 'border-l-4 border-amber-500';
              } else if (isModified) {
                rowBg = 'bg-emerald-50/40';
                borderLeftStyle = 'border-l-4 border-emerald-600';
              }

              return (
                <React.Fragment key={v.id}>
                  <tr
                    id={`vehicle-row-${v.vin}`}
                    className={`hover:bg-blue-50/30 transition-colors ${rowBg} ${borderLeftStyle}`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>

                    {/* Vehicle Title & Badges */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 leading-tight">
                          {v.year} {v.make} {v.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">{v.trim}</span>
                        <span>•</span>
                        <span>{v.exteriorColor}</span>
                        {v.batteryInfo && <BatteryPopover batteryInfo={v.batteryInfo} />}
                        {v.isOpenLoop && (
                          <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wide">
                            Mandatory
                          </span>
                        )}
                        {v.inspectionExpired && (
                          <span
                            className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-1 py-0.2 rounded text-[10px]"
                            title="Server notice: Inspection is expired. Repricing sends vehicle back to inspection queue."
                          >
                            Expired Insp.
                          </span>
                        )}
                      </div>
                    </td>

                    {/* VIN with Last 7 Bold */}
                    <td className="py-2.5 px-3 font-mono text-xs">
                      <div className="tracking-tight text-slate-600">
                        <span>{vinPrefix}</span>
                        <strong className="text-slate-900 font-bold bg-slate-100 px-1 py-0.5 rounded">
                          {vinLast7}
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {v.location} • {v.titleState}
                      </div>
                    </td>

                    {/* Odometer & Grade */}
                    <td className="py-2.5 px-2 text-right">
                      <div className="font-mono text-slate-800 text-xs">
                        {formatNumber(v.odometer)}
                      </div>
                      <div className="font-mono font-bold text-slate-600 text-[11px]">
                        Gr: {v.conditionGrade.toFixed(1)}
                      </div>
                    </td>

                    {/* Cond Adj MMR */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-mono font-bold text-blue-900 text-xs tabular-nums">
                        {formatCurrency(v.marketPricing.condAdjMmr)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {v.marketPricing.conditionAdj >= 0 ? `+${v.marketPricing.conditionAdj}` : v.marketPricing.conditionAdj} adj
                      </div>
                    </td>

                    {/* Base MMR */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 text-xs tabular-nums">
                      {formatCurrency(v.marketPricing.mmr)}
                    </td>

                    {/* Last BGD Offered Price */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-mono text-slate-800 text-xs tabular-nums">
                        {formatCurrency(v.bgdHistory.lastOfferedPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {v.bgdHistory.timesOffered}x offered
                      </div>
                    </td>

                    {/* DP at Consignment */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 text-xs tabular-nums">
                      {formatCurrency(v.marketPricing.dpAtConsignment)}
                    </td>

                    {/* Sales Cascade Selector */}
                    <td className="py-2.5 px-3">
                      {v.isCascadeEligible ? (
                        <div className="flex items-center gap-1">
                          <select
                            disabled={v.isSold}
                            value={displayCascade}
                            onChange={(e) => onCascadeChange(v.id, e.target.value)}
                            className={`w-full text-xs py-1 px-2 border rounded focus:ring-1 focus:ring-[#173B68] ${
                              isCascadeDiff
                                ? 'border-emerald-500 bg-emerald-50/50 font-semibold text-emerald-900'
                                : 'border-slate-300 bg-white text-slate-800'
                            } disabled:bg-slate-100 disabled:text-slate-400`}
                          >
                            {MOCK_CASCADE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {isCascadeDiff && (
                            <button
                              type="button"
                              onClick={() => onRevertCascade(v)}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Revert Sales Cascade to original"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">N/A (Not eligible)</span>
                      )}
                    </td>

                    {/* Inline Price Input */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPriceDiff && (
                          <button
                            type="button"
                            onClick={() => onRevertPrice(v)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Revert price to original"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        )}

                        <div className="relative">
                          <span className="absolute left-2 top-1 text-slate-400 font-mono text-xs select-none">
                            $
                          </span>
                          <input
                            type="text"
                            data-vehicle-input="price"
                            data-vehicle-id={v.id}
                            disabled={v.isSold}
                            value={displayPrice}
                            onChange={(e) => onPriceChange(v.id, e.target.value)}
                            onBlur={() => onPriceBlur(v)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                                // Focus next price input
                                const inputs = Array.from(document.querySelectorAll('[data-vehicle-input="price"]')) as HTMLInputElement[];
                                const currentIdx = inputs.indexOf(e.currentTarget);
                                if (currentIdx !== -1 && currentIdx < inputs.length - 1) {
                                  inputs[currentIdx + 1].focus();
                                  inputs[currentIdx + 1].select();
                                }
                              }
                            }}
                            className={`w-28 text-right font-mono text-xs font-bold py-1 pl-4 pr-2 border rounded tabular-nums focus:outline-none focus:ring-2 focus:ring-[#173B68] ${
                              edit?.status === 'error'
                                ? 'border-red-600 bg-red-50 text-red-900 focus:ring-red-600'
                                : edit?.status === 'warning'
                                ? 'border-amber-500 bg-amber-50 text-amber-900 focus:ring-amber-500'
                                : isModified
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                : 'border-slate-300 bg-white text-slate-900'
                            } disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200`}
                          />
                        </div>
                      </div>

                      {/* Validation message under input per 4.5.3 */}
                      {edit?.isBlurred && edit.statusMessage && (
                        <div
                          className={`text-[10px] mt-0.5 text-right font-sans ${
                            edit.status === 'error'
                              ? 'text-red-600 font-bold'
                              : edit.status === 'warning'
                              ? 'text-amber-700 font-semibold'
                              : 'text-emerald-700 font-medium'
                          }`}
                        >
                          {edit.statusMessage}
                        </div>
                      )}
                    </td>

                    {/* Quick Links & Details Trigger */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500">
                        {/* Notes popup */}
                        <button
                          type="button"
                          onClick={() => alert(`Legacy Notes Popup for VIN: ${v.vin}`)}
                          className="p-1 hover:text-[#173B68] hover:bg-slate-100 rounded relative"
                          title={`Notes (${v.notes.length})`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {v.notes.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-slate-200 text-slate-700 text-[9px] font-bold px-1 rounded-full font-mono">
                              {v.notes.length}
                            </span>
                          )}
                        </button>

                        {/* Inspection link */}
                        <button
                          type="button"
                          onClick={() => alert(`Legacy Inspection Report for VIN: ${v.vin}`)}
                          className={`p-1 rounded ${
                            v.inspectionExpired
                              ? 'text-red-600 hover:bg-red-50'
                              : 'hover:text-[#173B68] hover:bg-slate-100'
                          }`}
                          title={
                            v.inspectionExpired
                              ? 'Inspection Is Expired (Re-pricing sends vehicle back to inspection queue)'
                              : 'Inspection Report'
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Audit link */}
                        <button
                          type="button"
                          onClick={() => alert(`Legacy Audit Trail for VIN: ${v.vin}`)}
                          className="p-1 hover:text-[#173B68] hover:bg-slate-100 rounded"
                          title="Audit Trail"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                        </button>

                        {/* Details Drawer Trigger */}
                        <button
                          type="button"
                          onClick={() => onOpenDetails(v)}
                          className="p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded ml-1 font-medium"
                          title="View all 40+ vehicle fields"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Save Failed Error Banner per 4.3.5: Visible while collapsed */}
                  {v.saveErrorMessage && (
                    <tr className="bg-red-100 border-l-4 border-red-600 text-red-900 text-[11px]">
                      <td colSpan={11} className="py-1 px-4">
                        <div className="flex items-center gap-2 font-medium">
                          <AlertOctagon className="w-3.5 h-3.5 text-red-700 shrink-0" />
                          <span>Save Error for {v.vin}: {v.saveErrorMessage}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
