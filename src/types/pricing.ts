export interface Note {
  id: string;
  user: string;
  dateTime: string;
  noteType: 'External' | 'Internal' | 'Back Office' | 'Physical Auction' | 'Announcement' | string;
  text: string;
}

export interface BatteryInfo {
  score: number; // e.g. 92
  stateOfHealth: number; // e.g. 96.5%
  stateOfCharge: number; // e.g. 84%
  capacityKwh: number; // e.g. 83.9 kWh
  rangeMiles: number; // e.g. 295 miles
  reportDate: string; // e.g. 2026-09-18
}

export interface BgdHistory {
  timesOffered: number;
  lastOfferedDate: string;
  initialOfferedPrice: number;
  lastOfferedPrice: number;
  lastSalesChannel: string;
  lastLaneSaleDate: string;
  inLaneHighBid: number | null;
  inServiceDate: string;
}

export interface MarketPricingNumbers {
  mmr: number;
  condAdjMmr: number;
  rmr: number;
  conditionAdj: number;
  colorAdj: number;
  optionAdj: number;
  carFaxAdj: number;
  mmrSampleSize: number;
  outOfWarrAdj: number;
  marketDerivative: number;
  mmrp: number;
  invoicePrice: number;
  mmrDate: string;
  dpAtConsignment: number;
  dp: number;
  payoffDamageDiscountEwt: number;
  dpEwt: number;
  secondChancePayoffDiscountEwt: number;
  pricingMethod: string;
  fsBase: number;
  formulaPrice?: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  reg?: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vehicleStatus: string;
  exteriorColor: string;
  interiorColor: string;
  transmission: string;
  roof: string;
  inventoryAge: number;
  workOrder: string;
  fsFinalInspectionType: string;
  odometer: number;
  conditionGrade: number;
  disclosureIndicator: string;
  disclosureDocUrl?: string;
  carFaxIndicator: string;
  location: string;
  currentCascade: string;
  previousOpenLoopCascade?: string;
  termType: string;
  titleState: string;
  originationType: string;
  bgdHistory: BgdHistory;
  packages: string[];
  options: string[];
  marketPricing: MarketPricingNumbers;
  remarketingReason: string;
  warrantyText: string;
  notes: Note[];
  
  // Specific condition flags matching Section 4
  isOpenLoop: boolean; // "Mandatory" tag
  inspectionExpired: boolean; // Inspection icon red + server text tooltip
  isSold: boolean; // price input & cascade disabled
  isCascadeEligible: boolean; // false hides the cascade select
  fuelType: 'ICE' | 'EV' | 'PHEV' | 'HYDROGEN';
  batteryInfo?: BatteryInfo;
  saveErrorMessage?: string; // row level error if save failed
  vehicleSource: 'bmwfs' | 'other';
  currentPrice: number;
  allowedCascadeOptions?: string[];
}

export type ValidationStatus = 'pristine' | 'ok' | 'warning' | 'error';

export interface PendingEdit {
  vehicleId: string;
  price: string; // string for input handling
  originalPrice: number;
  cascade: string;
  originalCascade: string;
  isBlurred: boolean;
  status: ValidationStatus;
  statusMessage: string;
  isPriceTouched: boolean;
  isCascadeTouched: boolean;
}

export interface SearchCriteria {
  vehicleStatus: string;
  modelYear: string;
  manufacturer: string;
  modelRange: string;
  model: string;
  trim: string;
  vin: string;
  salesChannel: string;
  exteriorColor: string;
  disclosurePresent: string;
  conditionGrade: string;
  vehicleSource: string;
  locationType: string;
  vehicleLocation: string;
  termType: string;
  originationType: string;
  mileageFrom: string;
  mileageTo: string;
  options: string[];
  pendingAgeMetStatus: string;
  excludeErrorQueue: boolean;
  zeroPricedVehicles: boolean;
  vehiclesOnSale: boolean;
}

export interface WarningSummary {
  expiredInspection: { count: number; items: { vin: string; message: string }[] };
  mmrRange: { count: number; items: { vin: string; price: number; mmr: number; min: number; max: number; message: string }[] };
  priceLimit: { count: number; items: { vin: string; price: number; limitMessage: string; willNotBeSaved: boolean }[] };
  mandatoryNotPriced: { count: number; items: { vin: string; message: string }[] };
  totalWarnings: number;
}
