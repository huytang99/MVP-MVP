import React, { useState, useMemo } from 'react';
import { 
  MOCK_VEHICLES, 
  validatePrice, 
  VENDOR_RULES,
  formatCurrency 
} from './mock/mockVehicles';
import { 
  Vehicle, 
  PendingEdit, 
  SearchCriteria, 
  WarningSummary 
} from './types/pricing';
import { PortalHeader } from './components/PortalHeader';
import { SearchPanel } from './components/SearchPanel';
import { ResultsToolbar } from './components/ResultsToolbar';
import { Direction1WorksheetGrid } from './components/directions/Direction1WorksheetGrid';
import { Direction2MasterDetail } from './components/directions/Direction2MasterDetail';
import { Direction3ActionStrip } from './components/directions/Direction3ActionStrip';
import { VehicleDetailsModalOrDrawer } from './components/VehicleDetailsModalOrDrawer';
import { SaveConfirmationModal } from './components/SaveConfirmationModal';
import { ImportModal } from './components/ImportModal';
import { ExportModal } from './components/ExportModal';
import { ComprehensiveSpecDoc } from './components/ComprehensiveSpecDoc';
import { CheckCircle2, AlertTriangle, Loader2, Sparkles, Filter, Database } from 'lucide-react';

const INITIAL_CRITERIA: SearchCriteria = {
  vehicleStatus: 'Awaiting Pricing',
  modelYear: 'All',
  manufacturer: 'All',
  modelRange: 'All',
  model: 'All',
  trim: 'All',
  vin: '',
  salesChannel: 'All',
  exteriorColor: 'All',
  disclosurePresent: 'All',
  conditionGrade: 'All',
  vehicleSource: 'All',
  locationType: 'All',
  vehicleLocation: 'All',
  termType: 'All',
  originationType: 'All',
  mileageFrom: '',
  mileageTo: '',
  options: [],
  pendingAgeMetStatus: 'All',
  excludeErrorQueue: false,
  zeroPricedVehicles: false,
  vehiclesOnSale: false,
};

export default function App() {
  // Navigation & Viewport State
  const [activeDirection, setActiveDirection] = useState<'worksheet' | 'masterDetail' | 'actionStrip'>('worksheet');
  const [viewportWidth, setViewportWidth] = useState<'1920' | '1366' | 'responsive'>('responsive');
  const [activeTab, setActiveTab] = useState<'redesign' | 'specification'>('redesign');

  // Search & Results State
  const [criteria, setCriteria] = useState<SearchCriteria>(INITIAL_CRITERIA);
  const [submittedCriteria, setSubmittedCriteria] = useState<SearchCriteria | null>(INITIAL_CRITERIA);
  const [hasExecutedSearch, setHasExecutedSearch] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isBlockingOverlay, setIsBlockingOverlay] = useState<boolean>(false);
  const [blockingMessage, setBlockingMessage] = useState<string>('');

  // Vehicles dataset
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [totalCount, setTotalCount] = useState<number>(1688);

  // Sorting & Paging
  const [sortBy, setSortBy] = useState<string>('vinLast7');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [thenBy, setThenBy] = useState<string>('none');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Pending Edits Dictionary (keyed by vehicleId)
  const [pendingEdits, setPendingEdits] = useState<Record<string, PendingEdit>>({
    // Pre-populate modified state on vehicle-002 as a demonstration of modified state
    'veh-002': {
      vehicleId: 'veh-002',
      price: '34200',
      originalPrice: 34200,
      cascade: 'Closed Loop - BMW Tier 1',
      originalCascade: 'Closed Loop - BMW Tier 1',
      isBlurred: true,
      status: 'ok',
      statusMessage: 'Vehicle has been modified',
      isPriceTouched: true,
      isCascadeTouched: false,
    },
    // Vehicle 3 has an out-of-range MMR warning
    'veh-003': {
      vehicleId: 'veh-003',
      price: '25200',
      originalPrice: 26800,
      cascade: 'Closed Loop - All Franchise',
      originalCascade: 'Closed Loop - All Franchise',
      isBlurred: true,
      status: 'warning',
      statusMessage: '$25,200 is outside ±6% of MMR $26,950 (allowed: $25,333 – $28,567)',
      isPriceTouched: true,
      isCascadeTouched: false,
    },
    // Vehicle 4 has a hard error ($105,000 exceeds $100k vendor rule)
    'veh-004': {
      vehicleId: 'veh-004',
      price: '105000',
      originalPrice: 30500,
      cascade: 'Move to Physical Auction',
      originalCascade: 'Move to Physical Auction',
      isBlurred: true,
      status: 'error',
      statusMessage: 'Price $105,000 exceeds vendor maximum limit of $100,000.',
      isPriceTouched: true,
      isCascadeTouched: false,
    }
  });

  // Active Modals & Drawers
  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Success / Queued Toast
  const [queuedNotification, setQueuedNotification] = useState<string | null>(null);

  // Derive pending edit count
  const pendingCount = Object.keys(pendingEdits).length;

  // Derive Warning Summary across vehicles for Pre-Save and Save Modal
  const warningSummary: WarningSummary = useMemo(() => {
    const expiredInspItems: { vin: string; message: string }[] = [];
    const mmrItems: { vin: string; price: number; mmr: number; min: number; max: number; message: string }[] = [];
    const priceLimitItems: { vin: string; price: number; limitMessage: string; willNotBeSaved: boolean }[] = [];
    const mandatoryItems: { vin: string; message: string }[] = [];

    vehicles.forEach((v) => {
      const edit = pendingEdits[v.id];

      // 1. Expired inspection warning (if repriced)
      if (v.inspectionExpired && edit && edit.isPriceTouched) {
        expiredInspItems.push({
          vin: v.vin,
          message: 'Re-pricing will send vehicle back to inspection queue.',
        });
      }

      // Check validations if edited
      if (edit && edit.isBlurred) {
        const priceNum = Number(edit.price);
        const val = validatePrice(priceNum, v);

        // 2. MMR warning (unless inspection is expired)
        if (val.status === 'warning' && !v.inspectionExpired) {
          mmrItems.push({
            vin: v.vin,
            price: priceNum,
            mmr: v.marketPricing.condAdjMmr || v.marketPricing.mmr,
            min: val.minMmr,
            max: val.maxMmr,
            message: val.message,
          });
        }

        // 3. Price limit warning
        if (val.status === 'error') {
          priceLimitItems.push({
            vin: v.vin,
            price: priceNum,
            limitMessage: val.message,
            willNotBeSaved: true,
          });
        }

        // 4. Mandatory OpenLoop (edited but price did not change)
        if (v.isOpenLoop && priceNum === v.currentPrice) {
          mandatoryItems.push({
            vin: v.vin,
            message: 'Mandatory Price Change — price was not changed',
          });
        }
      } else if (v.isOpenLoop && !edit) {
        // 4. Mandatory OpenLoop unpriced entirely
        mandatoryItems.push({
          vin: v.vin,
          message: 'Mandatory Price Change — vehicle was not priced',
        });
      }
    });

    const total = expiredInspItems.length + mmrItems.length + priceLimitItems.length + mandatoryItems.length;

    return {
      expiredInspection: { count: expiredInspItems.length, items: expiredInspItems },
      mmrRange: { count: mmrItems.length, items: mmrItems },
      priceLimit: { count: priceLimitItems.length, items: priceLimitItems },
      mandatoryNotPriced: { count: mandatoryItems.length, items: mandatoryItems },
      totalWarnings: total,
    };
  }, [vehicles, pendingEdits]);

  // Pricing Handlers
  const handlePriceChange = (vehicleId: string, val: string) => {
    // Contract 4.5.2: Accepts only digits and "."; anything else is stripped
    const clean = val.replace(/[^0-9.]/g, '');
    const v = vehicles.find((item) => item.id === vehicleId);
    if (!v) return;

    setPendingEdits((prev) => {
      const existing = prev[vehicleId];
      return {
        ...prev,
        [vehicleId]: {
          vehicleId,
          price: clean,
          originalPrice: existing ? existing.originalPrice : v.currentPrice,
          cascade: existing ? existing.cascade : v.currentCascade,
          originalCascade: existing ? existing.originalCascade : v.currentCascade,
          isBlurred: existing ? existing.isBlurred : false,
          status: existing ? existing.status : 'pristine',
          statusMessage: existing ? existing.statusMessage : '',
          isPriceTouched: true,
          isCascadeTouched: existing ? existing.isCascadeTouched : false,
        },
      };
    });
  };

  const handlePriceBlur = (vehicle: Vehicle) => {
    const edit = pendingEdits[vehicle.id];
    if (!edit) return;

    // Contract 4.5.2: Blur with an empty field or 0 restores the original price
    const num = Number(edit.price);
    if (!edit.price || isNaN(num) || num <= 0) {
      if (edit.cascade === vehicle.currentCascade) {
        // Remove edit completely
        setPendingEdits((prev) => {
          const next = { ...prev };
          delete next[vehicle.id];
          return next;
        });
      } else {
        // Restore price only
        setPendingEdits((prev) => ({
          ...prev,
          [vehicle.id]: {
            ...prev[vehicle.id],
            price: vehicle.currentPrice.toString(),
            isPriceTouched: false,
            status: 'ok',
            statusMessage: 'Cascade modified',
          },
        }));
      }
      return;
    }

    // Evaluate validation live
    const validation = validatePrice(num, vehicle);
    setPendingEdits((prev) => ({
      ...prev,
      [vehicle.id]: {
        ...prev[vehicle.id],
        isBlurred: true,
        status: validation.status,
        statusMessage: validation.message,
      },
    }));
  };

  const handleCascadeChange = (vehicleId: string, val: string) => {
    const v = vehicles.find((item) => item.id === vehicleId);
    if (!v) return;

    setPendingEdits((prev) => {
      const existing = prev[vehicleId];
      return {
        ...prev,
        [vehicleId]: {
          vehicleId,
          price: existing ? existing.price : v.currentPrice.toString(),
          originalPrice: existing ? existing.originalPrice : v.currentPrice,
          cascade: val,
          originalCascade: existing ? existing.originalCascade : v.currentCascade,
          isBlurred: existing ? existing.isBlurred : true,
          status: 'ok',
          statusMessage: 'Vehicle has been modified',
          isPriceTouched: existing ? existing.isPriceTouched : false,
          isCascadeTouched: val !== v.currentCascade,
        },
      };
    });
  };

  const handleRevertPrice = (vehicle: Vehicle) => {
    const edit = pendingEdits[vehicle.id];
    if (!edit) return;

    if (edit.cascade === vehicle.currentCascade) {
      // Revert completely
      setPendingEdits((prev) => {
        const next = { ...prev };
        delete next[vehicle.id];
        return next;
      });
    } else {
      // Revert price only
      setPendingEdits((prev) => ({
        ...prev,
        [vehicle.id]: {
          ...prev[vehicle.id],
          price: vehicle.currentPrice.toString(),
          isPriceTouched: false,
          status: 'ok',
          statusMessage: 'Cascade modified',
        },
      }));
    }
  };

  const handleRevertCascade = (vehicle: Vehicle) => {
    const edit = pendingEdits[vehicle.id];
    if (!edit) return;

    if (!edit.isPriceTouched || Number(edit.price) === vehicle.currentPrice) {
      // Revert completely
      setPendingEdits((prev) => {
        const next = { ...prev };
        delete next[vehicle.id];
        return next;
      });
    } else {
      // Revert cascade only
      setPendingEdits((prev) => ({
        ...prev,
        [vehicle.id]: {
          ...prev[vehicle.id],
          cascade: vehicle.currentCascade,
          isCascadeTouched: false,
        },
      }));
    }
  };

  const handleResetChanges = () => {
    setPendingEdits({});
    // Also clear save error messages per 4.2.3
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        saveErrorMessage: undefined,
      }))
    );
  };

  // Search Action
  const handleSearch = () => {
    setIsSearching(true);
    setIsBlockingOverlay(true);
    setBlockingMessage('Executing search criteria snapshot...');

    setTimeout(() => {
      setIsSearching(false);
      setIsBlockingOverlay(false);
      setHasExecutedSearch(true);
      setSubmittedCriteria({ ...criteria });
      setCurrentPage(1);
    }, 600);
  };

  const handleClearSearch = () => {
    setCriteria(INITIAL_CRITERIA);
    setSubmittedCriteria(null);
    setHasExecutedSearch(false);
    setPendingEdits({});
  };

  // Save Flow
  const handleSaveClick = () => {
    if (pendingCount === 0) {
      alert('No pricing modifications to save.');
      return;
    }

    if (warningSummary.totalWarnings > 0) {
      setIsSaveModalOpen(true);
    } else {
      executeSave();
    }
  };

  const executeSave = () => {
    setIsSaveModalOpen(false);
    setIsSaving(true);
    setIsBlockingOverlay(true);
    setBlockingMessage('Queueing pricing batch to remarketing background worker...');

    setTimeout(() => {
      setIsSaving(false);
      setIsBlockingOverlay(false);
      const savedCount = pendingCount;
      // Queued semantic per Section 1 & Section 4.6.3:
      setQueuedNotification(`Successfully queued ${savedCount} pricing updates for background processing.`);
      // Clear pending set
      setPendingEdits({});
      setTimeout(() => {
        setQueuedNotification(null);
      }, 5000);
    }, 1000);
  };

  // Import Action
  const handleApplyImport = (records: { vin: string; price: number }[]) => {
    setPendingEdits((prev) => {
      const next = { ...prev };
      records.forEach((r) => {
        const v = vehicles.find((item) => item.vin === r.vin);
        if (v && r.price > 0 && r.price !== v.currentPrice) {
          const val = validatePrice(r.price, v);
          next[v.id] = {
            vehicleId: v.id,
            price: r.price.toString(),
            originalPrice: v.currentPrice,
            cascade: v.currentCascade,
            originalCascade: v.currentCascade,
            isBlurred: true,
            status: val.status,
            statusMessage: val.message,
            isPriceTouched: true,
            isCascadeTouched: false,
          };
        }
      });
      return next;
    });
    setQueuedNotification(`Import applied: ${records.length} vehicles staged for review.`);
    setTimeout(() => setQueuedNotification(null), 4000);
  };

  // Quick State Scenario Loader
  const handleLoadStateScenario = (scenario: 'before_search' | 'all_states' | 'save_modal' | 'import_modal') => {
    if (scenario === 'before_search') {
      setHasExecutedSearch(false);
      setSubmittedCriteria(null);
    } else if (scenario === 'all_states') {
      setHasExecutedSearch(true);
    } else if (scenario === 'save_modal') {
      setHasExecutedSearch(true);
      setIsSaveModalOpen(true);
    } else if (scenario === 'import_modal') {
      setHasExecutedSearch(true);
      setIsImportModalOpen(true);
    }
  };

  const handleJumpToWarning = (type: 'mmr' | 'priceLimit' | 'mandatory' | 'expired') => {
    let targetVin = '';
    if (type === 'mmr') targetVin = 'WMZ83BR00N3N48840';
    else if (type === 'priceLimit') targetVin = 'WMZ53BR0XN3N41297';
    else if (type === 'mandatory') targetVin = 'WMZ83BR06N3N57798';
    else if (type === 'expired') targetVin = 'WBA33AY08PFP44109';

    if (targetVin) {
      const el = document.getElementById(`vehicle-row-${targetVin}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-amber-400');
        setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2500);
      }
    }
  };

  // Determine viewport width constraint style
  let containerWidthClass = 'w-full max-w-[1920px] mx-auto';
  if (viewportWidth === '1920') {
    containerWidthClass = 'w-[1920px] mx-auto border-x border-slate-300 shadow-2xl';
  } else if (viewportWidth === '1366') {
    containerWidthClass = 'w-[1366px] mx-auto border-x border-slate-300 shadow-2xl';
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#5b5b5b] flex flex-col font-sans antialiased">
      {/* Top Portal Header & Navigation Shell */}
      <PortalHeader
        activeDirection={activeDirection}
        onDirectionChange={setActiveDirection}
        viewportWidth={viewportWidth}
        onViewportChange={setViewportWidth}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-4 overflow-x-auto">
        <div className={containerWidthClass}>
          {activeTab === 'specification' ? (
            <ComprehensiveSpecDoc />
          ) : (
            <>
              {/* Quick Scenario Jumper Bar: Demonstrates required states (a) to (e) per section 5 */}
              <div className="bg-slate-200/90 border border-slate-300 rounded px-3 py-1.5 mb-3 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Database className="w-3.5 h-3.5 text-[#173B68]" />
                  <span>Review Mock States:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleLoadStateScenario('before_search')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      !hasExecutedSearch ? 'bg-[#173B68] text-white border-[#173B68]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    (a) Before First Search
                  </button>
                  <button
                    onClick={() => handleLoadStateScenario('all_states')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      hasExecutedSearch && !isSaveModalOpen && !isImportModalOpen ? 'bg-[#173B68] text-white border-[#173B68]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    (b) Results with 10 Target States
                  </button>
                  <button
                    onClick={() => {
                      setInspectVehicle(vehicles[0]);
                      setIsDetailsOpen(true);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  >
                    (c) One Row's Full Details
                  </button>
                  <button
                    onClick={() => handleLoadStateScenario('save_modal')}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  >
                    (d) Save Confirmation (4 Warning Groups)
                  </button>
                  <button
                    onClick={() => handleLoadStateScenario('import_modal')}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  >
                    (e) Import Result Step
                  </button>
                </div>
              </div>

              {/* Success Notification Banner ("Queued" per Section 1) */}
              {queuedNotification && (
                <div className="mb-3 bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{queuedNotification}</span>
                  </div>
                  <button
                    onClick={() => setQueuedNotification(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Section 4.1 Search Criteria Panel */}
              <SearchPanel
                criteria={criteria}
                onCriteriaChange={setCriteria}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isSearching}
                hasExecutedSearch={hasExecutedSearch}
              />

              {/* State (a): Before First Search State */}
              {!hasExecutedSearch ? (
                <div className="bg-white border border-slate-300 rounded-lg p-12 text-center shadow-xs">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-200 text-[#173B68] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Select Vehicle Status & Search Remarketing Inventory
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Choose a status (default: "Awaiting Pricing"), optional model year or series, and click Search to retrieve remarketing units for batch pricing.
                  </p>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#173B68] hover:bg-[#122d50] text-white rounded text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>Execute Search ("Awaiting Pricing")</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Results Toolbar */}
                  <ResultsToolbar
                    totalCount={totalCount}
                    pendingCount={pendingCount}
                    warnings={warningSummary}
                    onOpenExport={() => setIsExportModalOpen(true)}
                    onOpenImport={() => setIsImportModalOpen(true)}
                    onResetChanges={handleResetChanges}
                    onSave={handleSaveClick}
                    isSaving={isSaving}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    sortDirection={sortDirection}
                    onSortDirectionToggle={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    thenBy={thenBy}
                    onThenByChange={setThenBy}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onPageChange={setCurrentPage}
                    onJumpToWarning={handleJumpToWarning}
                  />

                  {/* Dynamic Render of Active Layout Direction */}
                  {activeDirection === 'worksheet' && (
                    <Direction1WorksheetGrid
                      vehicles={vehicles}
                      pendingEdits={pendingEdits}
                      onPriceChange={handlePriceChange}
                      onPriceBlur={handlePriceBlur}
                      onCascadeChange={handleCascadeChange}
                      onRevertPrice={handleRevertPrice}
                      onRevertCascade={handleRevertCascade}
                      onOpenDetails={(v) => {
                        setInspectVehicle(v);
                        setIsDetailsOpen(true);
                      }}
                    />
                  )}

                  {activeDirection === 'masterDetail' && (
                    <Direction2MasterDetail
                      vehicles={vehicles}
                      pendingEdits={pendingEdits}
                      onPriceChange={handlePriceChange}
                      onPriceBlur={handlePriceBlur}
                      onCascadeChange={handleCascadeChange}
                      onRevertPrice={handleRevertPrice}
                      onRevertCascade={handleRevertCascade}
                      onOpenDetails={(v) => {
                        setInspectVehicle(v);
                        setIsDetailsOpen(true);
                      }}
                    />
                  )}

                  {activeDirection === 'actionStrip' && (
                    <Direction3ActionStrip
                      vehicles={vehicles}
                      pendingEdits={pendingEdits}
                      onPriceChange={handlePriceChange}
                      onPriceBlur={handlePriceBlur}
                      onCascadeChange={handleCascadeChange}
                      onRevertPrice={handleRevertPrice}
                      onRevertCascade={handleRevertCascade}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Slide-over Full Details Drawer (~40 fields) */}
      <VehicleDetailsModalOrDrawer
        vehicle={inspectVehicle}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setInspectVehicle(null);
        }}
      />

      {/* Save Confirmation Modal with 4 Warning Groups */}
      <SaveConfirmationModal
        isOpen={isSaveModalOpen}
        warnings={warningSummary}
        totalPendingCount={pendingCount}
        onCancel={() => setIsSaveModalOpen(false)}
        onConfirm={executeSave}
        isSaving={isSaving}
      />

      {/* Batch Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyImport={handleApplyImport}
      />

      {/* Export Snapshot Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalCount={totalCount}
      />

      {/* Full-Page Blocking Overlay during server operations per 4.2.7 */}
      {isBlockingOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-3" />
          <p className="text-sm font-semibold tracking-wide">{blockingMessage}</p>
          <span className="text-xs text-slate-300 mt-1">Please wait while the server updates</span>
        </div>
      )}
    </div>
  );
}
