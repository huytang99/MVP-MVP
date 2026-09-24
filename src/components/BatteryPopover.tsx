import React, { useState } from 'react';
import { BatteryCharging, X, Zap } from 'lucide-react';
import { BatteryInfo } from '../types/pricing';

interface BatteryPopoverProps {
  batteryInfo: BatteryInfo;
}

export const BatteryPopover: React.FC<BatteryPopoverProps> = ({ batteryInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
        title="High-Voltage Battery Health Score. Click for full telemetry."
      >
        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
        <span className="font-mono">{batteryInfo.score}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-xl border border-slate-300 z-50 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>EV Battery Health Report</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Health Score:</span>
                <span className="font-bold text-emerald-700">{batteryInfo.score} / 100</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">State of Health (SoH):</span>
                <span className="font-semibold text-slate-800">{batteryInfo.stateOfHealth}%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Current State of Charge:</span>
                <span className="font-semibold text-slate-800">{batteryInfo.stateOfCharge}%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Pack Usable Capacity:</span>
                <span className="font-semibold text-slate-800">{batteryInfo.capacityKwh} kWh</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Estimated Range:</span>
                <span className="font-semibold text-slate-800">{batteryInfo.rangeMiles} miles</span>
              </div>
              <div className="flex justify-between pt-1 text-slate-400 text-[10px]">
                <span className="font-sans">Certified Report Date:</span>
                <span>{batteryInfo.reportDate}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
