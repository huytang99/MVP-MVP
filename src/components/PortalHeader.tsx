import React from 'react';
import { User, HelpCircle, LogOut, ChevronRight, Home } from 'lucide-react';

interface PortalHeaderProps {
  activeDirection: string;
  onDirectionChange: (direction: 'worksheet' | 'masterDetail' | 'actionStrip') => void;
  viewportWidth: '1920' | '1366' | 'responsive';
  onViewportChange: (width: '1920' | '1366' | 'responsive') => void;
  activeTab: 'redesign' | 'specification';
  onTabChange: (tab: 'redesign' | 'specification') => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeDirection,
  onDirectionChange,
  viewportWidth,
  onViewportChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Prototype Control Banner: Allows reviewing the 3 genuine directions, viewports, and spec */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white font-semibold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
            BMW / MINI Remarketing MVP
          </span>
          <span className="text-slate-400 font-mono hidden sm:inline">Portal Revision 3.2</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Main Tab Toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700">
            <button
              onClick={() => onTabChange('redesign')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                activeTab === 'redesign' ? 'bg-[#173B68] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Redesigns (3 Directions)
            </button>
            <button
              onClick={() => onTabChange('specification')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                activeTab === 'specification' ? 'bg-[#173B68] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Comprehensive Specification & Contract Review
            </button>
          </div>

          {activeTab === 'redesign' && (
            <>
              {/* Direction Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Direction:</span>
                <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700">
                  <button
                    onClick={() => onDirectionChange('worksheet')}
                    title="Direction 1: Spreadsheet-like pricing worksheet with key numbers and inline price/cascade on every row"
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      activeDirection === 'worksheet'
                        ? 'bg-blue-700 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    1. Financial Worksheet
                  </button>
                  <button
                    onClick={() => onDirectionChange('masterDetail')}
                    title="Direction 2: Master-Detail Split Pane with sticky deep inspection sidebar"
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      activeDirection === 'masterDetail'
                        ? 'bg-blue-700 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    2. Master-Detail Workbench
                  </button>
                  <button
                    onClick={() => onDirectionChange('actionStrip')}
                    title="Direction 3: Compact Action Strip with first-class pricing bar on collapsed row"
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      activeDirection === 'actionStrip'
                        ? 'bg-blue-700 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    3. Smart Action Strip
                  </button>
                </div>
              </div>

              {/* Viewport Width Constraint Toggle */}
              <div className="flex items-center gap-1.5 hidden md:flex">
                <span className="text-slate-400">Preview Viewport:</span>
                <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700">
                  <button
                    onClick={() => onViewportChange('responsive')}
                    className={`px-2 py-0.5 rounded ${viewportWidth === 'responsive' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => onViewportChange('1920')}
                    className={`px-2 py-0.5 rounded font-mono ${viewportWidth === '1920' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    1920px
                  </button>
                  <button
                    onClick={() => onViewportChange('1366')}
                    className={`px-2 py-0.5 rounded font-mono ${viewportWidth === '1366' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    1366px
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legacy Admin Portal Top Menu (Preserved per shell constraint #173B68) */}
      <div className="bg-[#173B68] text-white text-xs select-none">
        <div className="max-w-[1920px] mx-auto px-4 flex items-center justify-between h-10 overflow-x-auto">
          <nav className="flex items-center space-x-1 whitespace-nowrap">
            <span className="font-bold tracking-wider px-2 text-white/90 mr-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>
              REMARKETING PORTAL
            </span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">System Setup</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">News Management</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Reports</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Buyer Management</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">User Management</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Vehicle Management</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Accounts</span>
            <span className="px-2.5 py-1 bg-white/20 text-white font-semibold rounded cursor-pointer border-b-2 border-white">
              Pricing Tools
            </span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Sales Channel</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Session</span>
            <span className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer">Sales Strategy</span>
          </nav>

          <div className="flex items-center space-x-4 whitespace-nowrap pl-4 text-slate-300">
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
              <User className="w-3.5 h-3.5" />
              <span>khang.uot.admin.bmw</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Title Section */}
      <div className="max-w-[1920px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="hover:text-slate-700 cursor-pointer">Pricing Tools</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-medium">Multiple Vehicle Pricing</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#173B68] tracking-tight">
            Multiple Vehicle Pricing
          </h1>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>BMW Financial Services & MINI Financial Services Remarketing</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="font-mono">US Market (Region 01)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
