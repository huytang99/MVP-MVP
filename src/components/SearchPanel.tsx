import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, AlertTriangle, Filter } from 'lucide-react';
import { SearchCriteria } from '../types/pricing';

interface SearchPanelProps {
  criteria: SearchCriteria;
  onCriteriaChange: (newCriteria: SearchCriteria) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
  hasExecutedSearch: boolean;
}

const STATUS_OPTIONS = [
  { value: 'Awaiting Pricing', label: 'Awaiting Pricing' },
  { value: 'Ready for Sale', label: 'Ready for Sale' },
  { value: 'In-Transit to Auction', label: 'In-Transit to Auction' },
  { value: 'Pending Inspection', label: 'Pending Inspection' },
  { value: 'Vehicle Sold', label: 'Vehicle Sold' },
  { value: '0', label: 'Any (Requires VIN)' }, // Special "Any" status
];

const MODEL_YEAR_OPTIONS = ['All', '2025', '2024', '2023', '2022', '2021', '2020'];

const MANUFACTURER_OPTIONS = ['All', 'BMW', 'MINI', 'Rolls-Royce'];

const MODEL_RANGES: Record<string, string[]> = {
  BMW: ['All', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'i4'],
  MINI: ['All', 'Hardtop 2 Door', 'Hardtop 4 Door', 'Convertible', 'Countryman', 'Clubman'],
};

const MODELS: Record<string, string[]> = {
  '3 Series': ['All', '330i Sedan', '330i xDrive Sedan', 'M340i xDrive', '330e PHEV'],
  'Countryman': ['All', 'Cooper Countryman', 'Cooper S Countryman', 'Cooper S ALL4', 'JCW ALL4'],
  'X5': ['All', 'X5 sDrive40i', 'X5 xDrive40i', 'X5 xDrive50e', 'X5 M60i'],
  'i4': ['All', 'i4 eDrive35', 'i4 eDrive40', 'i4 xDrive40', 'i4 M50'],
};

const TRIMS: Record<string, string[]> = {
  '330i xDrive Sedan': ['All', 'Base', 'Sport Line', 'M Sport Edition'],
  'Cooper S Countryman': ['All', 'Classic Trim', 'Signature Trim', 'Iconic Trim'],
  'X5 xDrive40i': ['All', 'Standard', 'xLine', 'M Sport', 'Executive Edition'],
  'i4 eDrive40': ['All', 'Standard', 'M Sport EV'],
};

export const SearchPanel: React.FC<SearchPanelProps> = ({
  criteria,
  onCriteriaChange,
  onSearch,
  onClear,
  isSearching,
  hasExecutedSearch,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(hasExecutedSearch);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Status change: resets dependent criteria and simulates server-side list refresh
  const handleStatusChange = (newStatus: string) => {
    setValidationError(null);
    onCriteriaChange({
      ...criteria,
      vehicleStatus: newStatus,
      modelYear: 'All',
      manufacturer: 'All',
      modelRange: 'All',
      model: 'All',
      trim: 'All',
      salesChannel: 'All',
      exteriorColor: 'All',
      conditionGrade: 'All',
      vehicleSource: 'All',
      locationType: 'All',
      vehicleLocation: 'All',
      termType: 'All',
      originationType: 'All',
      mileageFrom: '',
      mileageTo: '',
      pendingAgeMetStatus: 'All',
    });
  };

  // Model year change resets Model Range, Model, and Trim (No server call)
  const handleYearChange = (newYear: string) => {
    onCriteriaChange({
      ...criteria,
      modelYear: newYear,
      modelRange: 'All',
      model: 'All',
      trim: 'All',
    });
  };

  const handleManufacturerChange = (newMake: string) => {
    onCriteriaChange({
      ...criteria,
      manufacturer: newMake,
      modelRange: 'All',
      model: 'All',
      trim: 'All',
    });
  };

  const handleModelRangeChange = (newRange: string) => {
    onCriteriaChange({
      ...criteria,
      modelRange: newRange,
      model: 'All',
      trim: 'All',
    });
  };

  const handleModelChange = (newModel: string) => {
    onCriteriaChange({
      ...criteria,
      model: newModel,
      trim: 'All',
    });
  };

  const handleLocationTypeChange = (newLocType: string) => {
    onCriteriaChange({
      ...criteria,
      locationType: newLocType,
      vehicleLocation: 'All', // Changing Location Type clears Location per 4.1.6
    });
  };

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Rule 4.1.2: With "Any" status, a VIN is required
    if (criteria.vehicleStatus === '0' && (!criteria.vin || criteria.vin.trim().length === 0)) {
      setValidationError('A valid VIN is required when Vehicle Status is set to "Any".');
      return;
    }
    setValidationError(null);
    onSearch();
    setIsCollapsed(true); // collapse automatically on search to save screen space
  };

  const isUpstreamLocation = criteria.locationType === 'Upstream Location';
  const isReadyForSaleStatus = criteria.vehicleStatus === 'Ready for Sale';

  const availableRanges = criteria.manufacturer !== 'All' ? (MODEL_RANGES[criteria.manufacturer] || ['All']) : ['All'];
  const availableModels = criteria.modelRange !== 'All' ? (MODELS[criteria.modelRange] || ['All']) : ['All'];
  const availableTrims = criteria.model !== 'All' ? (TRIMS[criteria.model] || ['All']) : ['All'];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs mb-4 text-xs">
      {/* Panel Header */}
      <div
        className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Filter className="w-3.5 h-3.5 text-[#173B68]" />
          <span>Search Criteria</span>
          {hasExecutedSearch && (
            <span className="text-slate-500 font-normal ml-2">
              Status: <strong className="text-slate-700">{criteria.vehicleStatus === '0' ? 'Any' : criteria.vehicleStatus}</strong>
              {criteria.modelYear !== 'All' && ` • Year: ${criteria.modelYear}`}
              {criteria.manufacturer !== 'All' && ` • ${criteria.manufacturer}`}
              {criteria.vin && ` • VIN: ${criteria.vin}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium hover:text-blue-900">
          <span>{isCollapsed ? 'Expand Criteria' : 'Collapse'}</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Criteria Form */}
      {!isCollapsed && (
        <form onSubmit={handleExecuteSearch} className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Vehicle Status (Required) */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Vehicle Status <span className="text-red-600">*</span>
              </label>
              <select
                value={criteria.vehicleStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] focus:border-[#173B68]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Year */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Model Year</label>
              <select
                value={criteria.modelYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] focus:border-[#173B68]"
              >
                {MODEL_YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Manufacturer</label>
              <select
                value={criteria.manufacturer}
                onChange={(e) => handleManufacturerChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] focus:border-[#173B68]"
              >
                {MANUFACTURER_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Range (Cascade Child 1) */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Model Range</label>
              <select
                value={criteria.modelRange}
                disabled={criteria.manufacturer === 'All'}
                onChange={(e) => handleModelRangeChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] disabled:bg-slate-100 disabled:text-slate-400"
              >
                {availableRanges.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Model (Cascade Child 2) */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Model</label>
              <select
                value={criteria.model}
                disabled={criteria.modelRange === 'All'}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] disabled:bg-slate-100 disabled:text-slate-400"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Trim (Cascade Child 3) */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Trim</label>
              <select
                value={criteria.trim}
                disabled={criteria.model === 'All'}
                onChange={(e) => onCriteriaChange({ ...criteria, trim: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68] disabled:bg-slate-100 disabled:text-slate-400"
              >
                {availableTrims.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* VIN */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                VIN / Registration {criteria.vehicleStatus === '0' && <span className="text-red-600 font-bold">*</span>}
              </label>
              <input
                type="text"
                placeholder={criteria.vehicleStatus === '0' ? 'Required for status Any...' : 'Enter VIN (e.g. WMZ53...)'}
                value={criteria.vin}
                onChange={(e) => onCriteriaChange({ ...criteria, vin: e.target.value.toUpperCase() })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono uppercase focus:ring-1 focus:ring-[#173B68]"
              />
            </div>

            {/* Sales Channel */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Sales Channel</label>
              <select
                value={criteria.salesChannel}
                onChange={(e) => onCriteriaChange({ ...criteria, salesChannel: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68]"
              >
                <option value="All">All Channels</option>
                <option value="Digital Open Sale">Digital Open Sale</option>
                <option value="Closed Loop - BMW Tier 1">Closed Loop - BMW Tier 1</option>
                <option value="Off-Lease Post-Recon Open Sale">Off-Lease Post-Recon Open Sale</option>
              </select>
            </div>

            {/* Exterior Color */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Exterior Color</label>
              <select
                value={criteria.exteriorColor}
                onChange={(e) => onCriteriaChange({ ...criteria, exteriorColor: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68]"
              >
                <option value="All">All Colors</option>
                <option value="Alpine White">Alpine White</option>
                <option value="Black Sapphire">Black Sapphire</option>
                <option value="Chili Red">Chili Red</option>
                <option value="Mineral White">Mineral White</option>
              </select>
            </div>

            {/* Disclosure Present */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Disclosure Present</label>
              <select
                value={criteria.disclosurePresent}
                onChange={(e) => onCriteriaChange({ ...criteria, disclosurePresent: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68]"
              >
                <option value="All">All</option>
                <option value="Present">Present</option>
                <option value="Not Present">Not Present</option>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Location Type</label>
              <select
                value={criteria.locationType}
                onChange={(e) => handleLocationTypeChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68]"
              >
                <option value="All">All</option>
                <option value="Physical Auction">Physical Auction</option>
                <option value="Upstream Location">Upstream Location</option>
                <option value="Dealership Turn-In">Dealership Turn-In</option>
              </select>
            </div>

            {/* Vehicle Location (Hidden when Location Type = "Upstream Location" per 4.1.6) */}
            {!isUpstreamLocation ? (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Vehicle Location</label>
                <select
                  value={criteria.vehicleLocation}
                  onChange={(e) => onCriteriaChange({ ...criteria, vehicleLocation: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#173B68]"
                >
                  <option value="All">All Locations</option>
                  <option value="Manheim Palm Beach">Manheim Palm Beach</option>
                  <option value="Manheim Dallas">Manheim Dallas</option>
                  <option value="Adesa Boston">Adesa Boston</option>
                  <option value="Manheim Riverside">Manheim Riverside</option>
                </select>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded p-2 text-slate-400 text-[11px] flex items-center justify-center">
                Location hidden for Upstream Location
              </div>
            )}

            {/* Mileage From / To */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Mileage Range</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Min"
                  value={criteria.mileageFrom}
                  onChange={(e) => onCriteriaChange({ ...criteria, mileageFrom: e.target.value })}
                  className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs font-mono"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={criteria.mileageTo}
                  onChange={(e) => onCriteriaChange({ ...criteria, mileageTo: e.target.value })}
                  className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1.5 text-xs font-mono"
                />
              </div>
            </div>

            {/* Conditional Filter: Pending Age Met Status (Only when status is Ready for Sale per 4.1.8) */}
            {isReadyForSaleStatus && (
              <div className="bg-blue-50/60 border border-blue-200 rounded p-2">
                <label className="block text-blue-900 font-medium mb-1 text-[11px]">
                  Pending Age Met Status (Ready for Sale only)
                </label>
                <select
                  value={criteria.pendingAgeMetStatus}
                  onChange={(e) => onCriteriaChange({ ...criteria, pendingAgeMetStatus: e.target.value })}
                  className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs"
                >
                  <option value="All">All</option>
                  <option value="Age Met">Age Met</option>
                  <option value="Age Pending">Age Pending</option>
                </select>
              </div>
            )}
          </div>

          {/* Conditional Checkboxes: Only for users with "show all criteria fields" permission per 4.1.8 */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-5 text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.excludeErrorQueue}
                onChange={(e) => onCriteriaChange({ ...criteria, excludeErrorQueue: e.target.checked })}
                className="rounded border-slate-300 text-[#173B68] focus:ring-[#173B68]"
              />
              <span>Exclude Error Queue Vehicles</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.zeroPricedVehicles}
                onChange={(e) => onCriteriaChange({ ...criteria, zeroPricedVehicles: e.target.checked })}
                className="rounded border-slate-300 text-[#173B68] focus:ring-[#173B68]"
              />
              <span>Zero Priced Vehicles</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.vehiclesOnSale}
                onChange={(e) => onCriteriaChange({ ...criteria, vehiclesOnSale: e.target.checked })}
                className="rounded border-slate-300 text-[#173B68] focus:ring-[#173B68]"
              />
              <span>Vehicles On Sale</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#173B68] hover:bg-[#122d50] text-white px-4 py-1.5 rounded font-medium flex items-center gap-1.5 text-xs shadow-xs disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Searching...' : 'Search'}</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded font-medium flex items-center gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
