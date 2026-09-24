import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Eye, 
  ClipboardList, 
  RotateCcw, 
  AlertTriangle, 
  AlertOctagon, 
  Check, 
  Car, 
  Calendar,
  Layers
} from 'lucide-react';
import { Vehicle, PendingEdit } from '../../types/pricing';
import { BatteryPopover } from '../BatteryPopover';
import { formatCurrency, formatNumber, MOCK_CASCADE_OPTIONS } from '../../mock/mockVehicles';

interface Direction3Props {
  vehicles: Vehicle[];
  pendingEdits: Record<string, PendingEdit>;
  onPriceChange: (vehicleId: string, val: string) => void;
  onPriceBlur: (vehicle: Vehicle) => void;
  onCascadeChange: (vehicleId: string, val: string) => void;
  onRevertPrice: (vehicle: Vehicle) => void;
  onRevertCascade: (vehicle: Vehicle) => void;
}

export const Direction3ActionStrip: React.FC<Direction3Props> = ({
  vehicles,
  pendingEdits,
  onPriceChange,
  onPriceBlur,
  onCascadeChange,
  onRevertPrice,
  onRevertCascade,
}) => {
  // Set of expanded vehicle IDs
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-2.5">
      {/* Direction Banner */}
      <div className="bg-slate-800 text-white px-4 py-2 rounded-t-lg flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide uppercase text-blue-300">Direction 3:</span>
          <span className="font-semibold">Smart Action Strip</span>
          <span className="text-slate-400 hidden sm:inline">— Card layout revolutionized with an integrated two-tier pricing bar on the collapsed header</span>
        </div>
        <div className="text-[11px] text-slate-300 font-mono">
          Full decision & pricing without expanding
        </div>
      </div>

      {vehicles.map((v, index) => {
        const isExpanded = !!expandedIds[v.id];
        const edit = pendingEdits[v.id];
        const displayPrice = edit !== undefined ? edit.price : v.currentPrice.toString();
        const displayCascade = edit !== undefined ? edit.cascade : v.currentCascade;
        const isModified = edit && (edit.isPriceTouched || edit.isCascadeTouched);
        const isPriceDiff = edit && Number(edit.price) !== v.currentPrice && edit.price !== '';
        const isCascadeDiff = edit && edit.cascade !== v.currentCascade;
        const vinPrefix = v.vin.slice(0, v.vin.length - 7);
        const vinLast7 = v.vin.slice(-7);

        let borderClass = 'border-l-4 border-slate-300';
        let cardBg = 'bg-white';

        if (v.saveErrorMessage) {
          borderClass = 'border-l-4 border-red-600';
          cardBg = 'bg-red-50/20';
        } else if (edit?.status === 'error') {
          borderClass = 'border-l-4 border-red-500';
          cardBg = 'bg-red-50/15';
        } else if (edit?.status === 'warning') {
          borderClass = 'border-l-4 border-amber-500';
          cardBg = 'bg-amber-50/15';
        } else if (isModified) {
          borderClass = 'border-l-4 border-emerald-600';
          cardBg = 'bg-emerald-50/20';
        }

        return (
          <div
            key={v.id}
            id={`vehicle-row-${v.vin}`}
            className={`border border-slate-200 rounded-lg shadow-2xs overflow-hidden transition-all ${borderClass} ${cardBg}`}
          >
            {/* Save Failed Error Notice per 4.3.5: Visible while collapsed */}
            {v.saveErrorMessage && (
              <div className="bg-red-100 border-b border-red-200 px-3 py-1.5 text-red-900 text-xs flex items-center gap-2">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="font-semibold">Save Error for {v.vin}:</span>
                <span>{v.saveErrorMessage}</span>
              </div>
            )}

            {/* Collapsed Header - Tier 1: Vehicle Identity & Tags */}
            <div className="p-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                {/* Expand / Collapse Chevron */}
                <button
                  type="button"
                  onClick={() => toggleExpand(v.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                  title={isExpanded ? 'Collapse secondary details' : 'Expand full 40+ vehicle details'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* VIN with Last 7 Bold */}
                <div className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  <span>{vinPrefix}</span>
                  <strong className="text-slate-900 font-bold">{vinLast7}</strong>
                </div>

                {/* Vehicle Make Model Trim */}
                <span className="font-bold text-slate-900 text-sm">
                  {v.year} {v.make} {v.model}
                </span>
                <span className="text-slate-600 text-xs font-medium">
                  {v.trim}
                </span>

                {/* Badges */}
                {v.isOpenLoop && (
                  <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wide">
                    Mandatory
                  </span>
                )}

                {v.inspectionExpired && (
                  <span
                    className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-1.5 py-0.2 rounded text-[10px]"
                    title="Inspection Is Expired (Server Text)"
                  >
                    Expired Inspection
                  </span>
                )}

                {v.batteryInfo && <BatteryPopover batteryInfo={v.batteryInfo} />}
              </div>

              {/* Right: Specs summary & Legacy Action Links */}
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <span className="hidden md:inline font-mono">
                  {formatNumber(v.odometer)} mi • Grd: {v.conditionGrade.toFixed(1)} • {v.location}
                </span>

                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Legacy Notes Popup for VIN: ${v.vin}`);
                    }}
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Legacy Inspection Report for VIN: ${v.vin}`);
                    }}
                    className={`p-1 rounded ${
                      v.inspectionExpired ? 'text-red-600 hover:bg-red-50' : 'hover:text-[#173B68] hover:bg-slate-100'
                    }`}
                    title={v.inspectionExpired ? 'Inspection Is Expired' : 'Inspection Report'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Legacy Audit Trail for VIN: ${v.vin}`);
                    }}
                    className="p-1 hover:text-[#173B68] hover:bg-slate-100 rounded"
                    title="Audit Trail"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Collapsed Header - Tier 2: The Integrated Pricing & Decision Strip */}
            <div className="px-4 py-2.5 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Left: The 4 Critical Reference Numbers */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500 text-[11px]">Cond Adj MMR:</span>
                  <span className="font-mono font-bold text-blue-900 text-xs tabular-nums">
                    {formatCurrency(v.marketPricing.condAdjMmr)}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500 text-[11px]">Base MMR:</span>
                  <span className="font-mono font-semibold text-slate-700 text-xs tabular-nums">
                    {formatCurrency(v.marketPricing.mmr)}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500 text-[11px]">Last BGD:</span>
                  <span className="font-mono font-semibold text-slate-700 text-xs tabular-nums">
                    {formatCurrency(v.bgdHistory.lastOfferedPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400">({v.bgdHistory.timesOffered}x)</span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500 text-[11px]">DP:</span>
                  <span className="font-mono font-semibold text-slate-700 text-xs tabular-nums">
                    {formatCurrency(v.marketPricing.dpAtConsignment)}
                  </span>
                </div>
              </div>

              {/* Right: Inline Pricing Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Cascade Selector */}
                {v.isCascadeEligible ? (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[11px]">Cascade:</span>
                    <select
                      disabled={v.isSold}
                      value={displayCascade}
                      onChange={(e) => onCascadeChange(v.id, e.target.value)}
                      className={`text-xs py-1 px-2 border rounded focus:ring-1 focus:ring-[#173B68] ${
                        isCascadeDiff
                          ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-900'
                          : 'border-slate-300 bg-white text-slate-800'
                      }`}
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
                        title="Revert Cascade"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px]">Cascade: N/A</span>
                )}

                {/* Inline Price Input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Price:</span>
                  {isPriceDiff && (
                    <button
                      type="button"
                      onClick={() => onRevertPrice(v)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Revert Price"
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
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : edit?.status === 'warning'
                          ? 'border-amber-500 bg-amber-50 text-amber-900'
                          : isModified
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Validation status badge */}
                {edit?.isBlurred && edit.statusMessage && (
                  <span
                    className={`text-[10px] font-sans px-1.5 py-0.5 rounded ${
                      edit.status === 'error'
                        ? 'bg-red-100 text-red-800 font-bold'
                        : edit.status === 'warning'
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'bg-emerald-100 text-emerald-800 font-medium'
                    }`}
                  >
                    {edit.statusMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Expandable Body: Secondary Details (Only loaded/expanded on demand) */}
            {isExpanded && (
              <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-700 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Exterior / Interior</span>
                    <span className="font-medium text-slate-800">{v.exteriorColor} / {v.interiorColor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Transmission / Roof</span>
                    <span className="font-medium text-slate-800">{v.transmission} • {v.roof}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Inventory Age / Work Order</span>
                    <span className="font-mono text-slate-800">{v.inventoryAge} days • #{v.workOrder}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">CarFax / Title State</span>
                    <span className="font-medium text-slate-800">{v.carFaxIndicator} • {v.titleState}</span>
                  </div>
                </div>

                {/* Valuation details */}
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1 text-[11px]">
                    Detailed Adjustments & Consignment Calculations
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div>Condition Adj: {formatCurrency(v.marketPricing.conditionAdj)}</div>
                    <div>Color Adj: {formatCurrency(v.marketPricing.colorAdj)}</div>
                    <div>Option Adj: {formatCurrency(v.marketPricing.optionAdj)}</div>
                    <div>CarFax Adj: {formatCurrency(v.marketPricing.carFaxAdj)}</div>
                    <div>MMRP: {formatCurrency(v.marketPricing.mmrp)}</div>
                    <div>Invoice Price: {formatCurrency(v.marketPricing.invoicePrice)}</div>
                    <div>DP - EWT: {formatCurrency(v.marketPricing.dpEwt)}</div>
                    <div>FS Base: {formatCurrency(v.marketPricing.fsBase)}</div>
                  </div>
                </div>

                {/* Packages & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1 text-[11px]">
                      Packages ({v.packages.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {v.packages.map((pkg, idx) => (
                        <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                          {pkg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1 text-[11px]">
                      Notes ({v.notes.length})
                    </span>
                    {v.notes.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px]">No notes recorded.</p>
                    ) : (
                      <div className="space-y-1 text-[11px]">
                        {v.notes.map((n) => (
                          <div key={n.id} className="bg-white p-1.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-800">{n.user}</span> ({n.dateTime}): {n.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
