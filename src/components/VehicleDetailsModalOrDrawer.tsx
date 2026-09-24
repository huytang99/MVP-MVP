import React from 'react';
import { X, FileText, CheckCircle2, AlertOctagon, Car, Calendar, DollarSign, Layers } from 'lucide-react';
import { Vehicle } from '../types/pricing';
import { formatCurrency, formatNumber } from '../mock/mockVehicles';

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  isOpen: boolean;
}

export const VehicleDetailsModalOrDrawer: React.FC<VehicleDetailsProps> = ({
  vehicle,
  onClose,
  isOpen,
}) => {
  if (!isOpen || !vehicle) return null;

  const vinPrefix = vehicle.vin.slice(0, vehicle.vin.length - 7);
  const vinLast7 = vehicle.vin.slice(-7);
  const isBmwfs = vehicle.vehicleSource === 'bmwfs';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#173B68] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono font-medium">
                {vinPrefix}<strong className="text-amber-300 font-bold">{vinLast7}</strong>
              </span>
              {vehicle.isOpenLoop && (
                <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded uppercase">
                  OpenLoop Mandatory
                </span>
              )}
              {vehicle.inspectionExpired && (
                <span className="bg-amber-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded uppercase">
                  Inspection Expired
                </span>
              )}
            </div>
            <h2 className="text-base font-bold tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Group 1: General Specifications */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5 text-xs">
              <Car className="w-3.5 h-3.5 text-[#173B68]" />
              Vehicle Identification & Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
              <div>
                <span className="text-slate-500 block text-[11px]">Vehicle Status</span>
                <span className="font-semibold text-slate-900">{vehicle.vehicleStatus}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Odometer</span>
                <span className="font-mono font-semibold text-slate-900">{formatNumber(vehicle.odometer)} mi</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Condition Grade</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-200/80 px-1.5 py-0.5 rounded text-[11px]">
                  {vehicle.conditionGrade.toFixed(1)} / 5.0
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Exterior Color</span>
                <span className="font-medium text-slate-800">{vehicle.exteriorColor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Interior Color</span>
                <span className="font-medium text-slate-800">{vehicle.interiorColor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Transmission</span>
                <span className="font-medium text-slate-800">{vehicle.transmission}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Roof Type</span>
                <span className="font-medium text-slate-800">{vehicle.roof}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Inventory Age</span>
                <span className="font-mono font-semibold text-slate-800">{vehicle.inventoryAge} days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Work Order #</span>
                <span className="font-mono text-slate-800">{vehicle.workOrder}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">FS Final Inspection Type</span>
                <span className="font-medium text-slate-800">{vehicle.fsFinalInspectionType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Vehicle Location</span>
                <span className="font-medium text-slate-800">{vehicle.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">CarFax Indicator</span>
                <span className="font-medium text-slate-800">{vehicle.carFaxIndicator}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Title State / Term Type</span>
                <span className="font-medium text-slate-800">{vehicle.titleState} • {vehicle.termType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Origination Type</span>
                <span className="font-medium text-slate-800">{vehicle.originationType}</span>
              </div>

              {/* Disclosure: Hidden if BMWFS source */}
              {!isBmwfs && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Disclosure</span>
                  <span className="font-medium text-slate-800">
                    {vehicle.disclosureIndicator}
                    {vehicle.disclosureDocUrl && (
                      <a href={vehicle.disclosureDocUrl} className="text-blue-700 underline ml-1">
                        View Doc
                      </a>
                    )}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Group 2: Complete Market & Remarketing Numbers */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              Valuation, Benchmark MMR & Consignment Pricing Breakdown
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 bg-white p-3 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Base MMR</span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatCurrency(vehicle.marketPricing.mmr)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Cond Adj MMR</span>
                <span className="font-mono font-bold text-sm text-blue-900">
                  {formatCurrency(vehicle.marketPricing.condAdjMmr)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">RMR</span>
                <span className="font-mono font-bold text-sm text-slate-800">
                  {formatCurrency(vehicle.marketPricing.rmr)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">DP at Consignment</span>
                <span className="font-mono font-bold text-sm text-slate-800">
                  {formatCurrency(vehicle.marketPricing.dpAtConsignment)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 border-t border-slate-200 pt-2 text-[11px]">
              <div>Condition Adj: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.conditionAdj)}</strong></div>
              <div>Color Adj: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.colorAdj)}</strong></div>
              <div>Option Adj: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.optionAdj)}</strong></div>
              <div>CarFax Adj: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.carFaxAdj)}</strong></div>
              <div>MMR Sample Size: <strong className="font-mono font-normal">{vehicle.marketPricing.mmrSampleSize}</strong></div>
              <div>OutOfWarr Adj: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.outOfWarrAdj)}</strong></div>
              <div>Market Derivative: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.marketDerivative)}</strong></div>
              <div>MMRP: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.mmrp)}</strong></div>
              <div>Invoice Price: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.invoicePrice)}</strong></div>
              <div>MMR Date: <strong className="font-mono font-normal">{vehicle.marketPricing.mmrDate}</strong></div>
              <div>Current DP: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.dp)}</strong></div>
              <div>Payoff Damage Disc - EWT: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.payoffDamageDiscountEwt)}</strong></div>
              <div>DP - EWT: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.dpEwt)}</strong></div>
              <div>2nd Chance Payoff - EWT: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.secondChancePayoffDiscountEwt)}</strong></div>
              <div>Pricing Method: <strong className="font-mono font-normal">{vehicle.marketPricing.pricingMethod}</strong></div>
              <div>FS Base: <strong className="font-mono font-normal">{formatCurrency(vehicle.marketPricing.fsBase)}</strong></div>
              {!isBmwfs && (vehicle.marketPricing.formulaPrice ?? 0) > 0 && (
                <div>Formula Price: <strong className="font-mono font-semibold text-emerald-800">{formatCurrency(vehicle.marketPricing.formulaPrice)}</strong></div>
              )}
            </div>
          </section>

          {/* Group 3: BGD Offering History */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-800" />
              BGD Offering & In-Lane Auction History
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Times Offered on BGD:</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.bgdHistory.timesOffered}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Last BGD Offered Date:</span>
                <span className="font-mono text-slate-800">{vehicle.bgdHistory.lastOfferedDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Initial BGD Offered Price:</span>
                <span className="font-mono font-semibold text-slate-800">{formatCurrency(vehicle.bgdHistory.initialOfferedPrice)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Last BGD Offered Price:</span>
                <span className="font-mono font-bold text-blue-900">{formatCurrency(vehicle.bgdHistory.lastOfferedPrice)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Last Sales Channel:</span>
                <span className="text-slate-800 font-medium">{vehicle.bgdHistory.lastSalesChannel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">In-Lane High Bid:</span>
                <span className="font-mono font-semibold text-slate-800">{formatCurrency(vehicle.bgdHistory.inLaneHighBid)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">In-Service Date:</span>
                <span className="font-mono text-slate-800">{vehicle.bgdHistory.inServiceDate}</span>
              </div>
            </div>
          </section>

          {/* Group 4: Packages & Options */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-[#173B68]" />
              Packages & Equipment Options
            </h3>
            <div className="mb-3">
              <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px] tracking-wider">
                Installed Packages ({vehicle.packages.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.packages.map((pkg, idx) => (
                  <span key={idx} className="bg-blue-50 border border-blue-200 text-blue-900 px-2 py-0.5 rounded text-[11px] font-medium">
                    {pkg}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1 uppercase text-[10px] tracking-wider">
                Vehicle Options ({vehicle.options.length})
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700 max-h-36 overflow-y-auto pr-2">
                {vehicle.options.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Group 5: Remarketing Reason & Warranty */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Remarketing Reason</span>
              <p className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                {vehicle.remarketingReason || 'N/A'}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Warranty Text</span>
              <p className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                {vehicle.warrantyText || 'N/A'}
              </p>
            </div>
          </section>

          {/* Group 6: Sanitized Notes (Newest first per 4.4) */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                Vehicle Notes & Remarks ({vehicle.notes.length})
              </span>
              <span className="text-slate-400 font-normal text-[11px]">Sorted: Newest First</span>
            </h3>

            {vehicle.notes.length === 0 ? (
              <p className="text-slate-400 italic text-xs py-2">No notes available.</p>
            ) : (
              <div className="space-y-2.5">
                {vehicle.notes.map((note) => (
                  <div key={note.id} className="bg-white p-3 rounded border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 border-b border-slate-100 pb-1">
                      <span className="font-semibold text-slate-800">{note.user}</span>
                      <span>{note.dateTime} • <span className="italic text-slate-600">{note.noteType}</span></span>
                    </div>
                    <div
                      className="text-slate-800 text-xs"
                      dangerouslySetInnerHTML={{ __html: note.text }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#173B68] text-white rounded text-xs font-semibold hover:bg-[#122d50]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
