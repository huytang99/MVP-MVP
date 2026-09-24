import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  ClipboardList, 
  RotateCcw, 
  AlertTriangle, 
  AlertOctagon, 
  Car, 
  Calendar, 
  Check, 
  ChevronRight,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Vehicle, PendingEdit } from '../../types/pricing';
import { BatteryPopover } from '../BatteryPopover';
import { formatCurrency, formatNumber, MOCK_CASCADE_OPTIONS } from '../../mock/mockVehicles';

interface Direction2Props {
  vehicles: Vehicle[];
  pendingEdits: Record<string, PendingEdit>;
  onPriceChange: (vehicleId: string, val: string) => void;
  onPriceBlur: (vehicle: Vehicle) => void;
  onCascadeChange: (vehicleId: string, val: string) => void;
  onRevertPrice: (vehicle: Vehicle) => void;
  onRevertCascade: (vehicle: Vehicle) => void;
  onOpenDetails: (vehicle: Vehicle) => void;
}

export const Direction2MasterDetail: React.FC<Direction2Props> = ({
  vehicles,
  pendingEdits,
  onPriceChange,
  onPriceBlur,
  onCascadeChange,
  onRevertPrice,
  onRevertCascade,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVehicle = vehicles[selectedIndex] || vehicles[0];
  const activeEdit = selectedVehicle ? pendingEdits[selectedVehicle.id] : undefined;
  const activeDisplayPrice = activeEdit !== undefined ? activeEdit.price : selectedVehicle?.currentPrice.toString();
  const activeDisplayCascade = activeEdit !== undefined ? activeEdit.cascade : selectedVehicle?.currentCascade;
  const isCascadeDiff = activeEdit && activeEdit.cascade !== selectedVehicle?.currentCascade;
  const isPriceDiff = activeEdit && Number(activeEdit.price) !== selectedVehicle?.currentPrice && activeEdit.price !== '';

  const handleNext = () => {
    if (selectedIndex < vehicles.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (!selectedVehicle) return null;

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
      {/* Direction Banner */}
      <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide uppercase text-blue-300">Direction 2:</span>
          <span className="font-semibold">Master-Detail Workbench</span>
          <span className="text-slate-400 hidden sm:inline">— Fast cycling queue + persistent deep inspection & pricing pane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
          <span>Navigate:</span>
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded flex items-center gap-0.5"
          >
            <ArrowUp className="w-3 h-3" /> Prev
          </button>
          <button
            onClick={handleNext}
            disabled={selectedIndex === vehicles.length - 1}
            className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded flex items-center gap-0.5"
          >
            <ArrowDown className="w-3 h-3" /> Next
          </button>
        </div>
      </div>

      {/* 2-Pane Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Pane (Master List - 5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto max-h-[750px] divide-y divide-slate-100 bg-slate-50/50">
          <div className="p-2.5 bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700 text-xs flex justify-between items-center">
            <span>Remarketing Queue ({vehicles.length})</span>
            <span className="text-[11px] text-slate-500 font-normal">Click or Arrow keys to inspect</span>
          </div>

          {vehicles.map((v, idx) => {
            const edit = pendingEdits[v.id];
            const isSelected = idx === selectedIndex;
            const isModified = edit && (edit.isPriceTouched || edit.isCascadeTouched);
            const vinLast7 = v.vin.slice(-7);
            const vinPrefix = v.vin.slice(0, v.vin.length - 7);

            let borderClass = 'border-l-4 border-transparent';
            if (v.saveErrorMessage) borderClass = 'border-l-4 border-red-600 bg-red-50/30';
            else if (edit?.status === 'error') borderClass = 'border-l-4 border-red-500 bg-red-50/20';
            else if (edit?.status === 'warning') borderClass = 'border-l-4 border-amber-500 bg-amber-50/20';
            else if (isModified) borderClass = 'border-l-4 border-emerald-500 bg-emerald-50/20';

            return (
              <div
                key={v.id}
                id={`vehicle-row-${v.vin}`}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3 text-xs cursor-pointer transition-colors relative ${borderClass} ${
                  isSelected
                    ? 'bg-blue-50/80 shadow-xs ring-1 ring-blue-300'
                    : 'hover:bg-white bg-slate-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div>
                    <span className="font-bold text-slate-900 block leading-snug">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {v.trim} • {v.exteriorColor}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-blue-900 tabular-nums">
                      {formatCurrency(v.marketPricing.condAdjMmr)}
                    </span>
                    <span className="block text-[10px] text-slate-400">Cond Adj MMR</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] mt-2 pt-1 border-t border-slate-200/60">
                  <div className="font-mono text-slate-600">
                    <span>{vinPrefix}</span>
                    <strong className="text-slate-900 font-bold bg-white px-1 py-0.5 rounded border border-slate-200">
                      {vinLast7}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {v.batteryInfo && <BatteryPopover batteryInfo={v.batteryInfo} />}
                    {v.isOpenLoop && (
                      <span className="bg-red-600 text-white font-bold text-[9px] px-1 py-0.2 rounded uppercase">
                        Mandatory
                      </span>
                    )}
                    {v.inspectionExpired && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-semibold px-1 rounded">
                        Expired Insp.
                      </span>
                    )}
                    {isModified && (
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        Priced: {formatCurrency(Number(edit.price))}
                      </span>
                    )}
                  </div>
                </div>

                {v.saveErrorMessage && (
                  <div className="mt-1.5 p-1 bg-red-100 text-red-800 text-[10px] rounded flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate">{v.saveErrorMessage}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Pane (Detail & Pricing Sticky Pane - 7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 flex flex-col justify-between overflow-y-auto max-h-[750px]">
          <div className="space-y-4">
            {/* Header Identity Bar */}
            <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedVehicle.vin.slice(0, -7)}
                    <strong className="text-[#173B68] font-bold">{selectedVehicle.vin.slice(-7)}</strong>
                  </span>
                  {selectedVehicle.isOpenLoop && (
                    <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded uppercase">
                      OpenLoop Mandatory
                    </span>
                  )}
                  {selectedVehicle.inspectionExpired && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase">
                      Inspection Expired
                    </span>
                  )}
                  {selectedVehicle.batteryInfo && (
                    <BatteryPopover batteryInfo={selectedVehicle.batteryInfo} />
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.trim}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Status: <strong>{selectedVehicle.vehicleStatus}</strong> • Odometer:{' '}
                  <strong>{formatNumber(selectedVehicle.odometer)} mi</strong> • Condition:{' '}
                  <strong>{selectedVehicle.conditionGrade.toFixed(1)}/5.0</strong> • Location:{' '}
                  <strong>{selectedVehicle.location}</strong>
                </div>
              </div>

              {/* Legacy Quick Popups */}
              <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                <button
                  type="button"
                  onClick={() => alert(`Legacy Notes for VIN: ${selectedVehicle.vin}`)}
                  className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes ({selectedVehicle.notes.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Legacy Inspection for VIN: ${selectedVehicle.vin}`)}
                  className={`px-2 py-1 border rounded flex items-center gap-1 ${
                    selectedVehicle.inspectionExpired
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspection</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Legacy Audit for VIN: ${selectedVehicle.vin}`)}
                  className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded flex items-center gap-1"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Audit</span>
                </button>
              </div>
            </div>

            {/* Core Decision Numbers Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                Market Valuation Matrix
              </span>
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Cond Adj MMR</span>
                  <span className="font-mono font-bold text-base text-blue-900 tabular-nums">
                    {formatCurrency(selectedVehicle.marketPricing.condAdjMmr)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {selectedVehicle.marketPricing.conditionAdj >= 0 ? `+${selectedVehicle.marketPricing.conditionAdj}` : selectedVehicle.marketPricing.conditionAdj} adj
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Base MMR</span>
                  <span className="font-mono font-bold text-base text-slate-800 tabular-nums">
                    {formatCurrency(selectedVehicle.marketPricing.mmr)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Sample: {selectedVehicle.marketPricing.mmrSampleSize}</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Last BGD Price</span>
                  <span className="font-mono font-bold text-base text-slate-800 tabular-nums">
                    {formatCurrency(selectedVehicle.bgdHistory.lastOfferedPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Offered {selectedVehicle.bgdHistory.timesOffered}x</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Consignment DP</span>
                  <span className="font-mono font-bold text-base text-slate-800 tabular-nums">
                    {formatCurrency(selectedVehicle.marketPricing.dpAtConsignment)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Current DP: {formatCurrency(selectedVehicle.marketPricing.dp)}</span>
                </div>
              </div>
            </div>

            {/* BGD Offering History & Packages Tabular summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  BGD Performance
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Initial Price:</span>
                    <span className="font-mono font-semibold">{formatCurrency(selectedVehicle.bgdHistory.initialOfferedPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Sales Channel:</span>
                    <span className="truncate max-w-[170px] text-slate-700">{selectedVehicle.bgdHistory.lastSalesChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">In-Lane High Bid:</span>
                    <span className="font-mono font-semibold">{formatCurrency(selectedVehicle.bgdHistory.inLaneHighBid)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#173B68]" />
                  Packages ({selectedVehicle.packages.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                  {selectedVehicle.packages.map((pkg, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sanitized Notes Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
              <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                Latest Remarketing Notes
              </span>
              {selectedVehicle.notes.length === 0 ? (
                <p className="text-slate-400 italic text-[11px]">No notes recorded.</p>
              ) : (
                <div className="bg-white p-2 rounded border border-slate-200 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span className="font-semibold text-slate-700">{selectedVehicle.notes[0].user}</span>
                    <span>{selectedVehicle.notes[0].dateTime} • {selectedVehicle.notes[0].noteType}</span>
                  </div>
                  <p className="text-slate-800">{selectedVehicle.notes[0].text}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Pricing Command Bar at Bottom */}
          <div className="mt-4 pt-4 border-t-2 border-slate-200 bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Vehicle Pricing Execution
              </span>
              <div className="flex items-center gap-2">
                {isPriceDiff && (
                  <button
                    type="button"
                    onClick={() => onRevertPrice(selectedVehicle)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Revert Price
                  </button>
                )}
                {isCascadeDiff && (
                  <button
                    type="button"
                    onClick={() => onRevertCascade(selectedVehicle)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Revert Cascade
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              {/* Cascade Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Sales Cascade
                </label>
                {selectedVehicle.isCascadeEligible ? (
                  <select
                    disabled={selectedVehicle.isSold}
                    value={activeDisplayCascade}
                    onChange={(e) => onCascadeChange(selectedVehicle.id, e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-[#173B68]"
                  >
                    {MOCK_CASCADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-slate-400 text-xs py-1.5 italic">Not Cascade Eligible</div>
                )}
              </div>

              {/* Price Input & Next Vehicle Trigger */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Set Remarketing Price ($ USD)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-mono text-xs select-none">
                      $
                    </span>
                    <input
                      type="text"
                      disabled={selectedVehicle.isSold}
                      value={activeDisplayPrice}
                      onChange={(e) => onPriceChange(selectedVehicle.id, e.target.value)}
                      onBlur={() => onPriceBlur(selectedVehicle)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                          handleNext();
                        }
                      }}
                      className={`w-full text-right font-mono font-bold text-sm py-1.5 pl-6 pr-3 border rounded tabular-nums focus:outline-none focus:ring-2 focus:ring-[#173B68] ${
                        activeEdit?.status === 'error'
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : activeEdit?.status === 'warning'
                          ? 'border-amber-500 bg-amber-50 text-amber-900'
                          : activeEdit && (activeEdit.isPriceTouched || activeEdit.isCascadeTouched)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={selectedIndex === vehicles.length - 1}
                    className="px-3 py-1.5 bg-[#173B68] text-white rounded font-bold text-xs hover:bg-[#122d50] disabled:opacity-40"
                  >
                    Next ➔
                  </button>
                </div>

                {/* Validation message */}
                {activeEdit?.isBlurred && activeEdit.statusMessage && (
                  <div
                    className={`text-[10px] mt-1 text-right font-sans ${
                      activeEdit.status === 'error'
                        ? 'text-red-600 font-bold'
                        : activeEdit.status === 'warning'
                        ? 'text-amber-700 font-semibold'
                        : 'text-emerald-700 font-medium'
                    }`}
                  >
                    {activeEdit.statusMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
