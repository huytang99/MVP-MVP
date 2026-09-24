import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Keyboard, 
  AlertTriangle, 
  Code, 
  FileSpreadsheet, 
  SplitSquareVertical, 
  CreditCard 
} from 'lucide-react';

export const ComprehensiveSpecDoc: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 text-slate-800 text-xs sm:text-sm space-y-8 leading-relaxed max-w-5xl mx-auto shadow-xs">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-[#173B68] font-bold text-xs uppercase tracking-wider mb-1">
          <span>Remarketing Architecture & UX Specification</span>
          <span>•</span>
          <span>BMW / MINI Remarketing US</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Multiple Vehicle Pricing (MVP) Redesign Specification
        </h1>
        <p className="text-slate-600 mt-2 text-sm">
          A definitive evaluation of three distinct layout paradigms, keyboard execution paths, 
          pre-save warning surfacing, component mappings, and exhaustive Section 4 contract compliance.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <span className="font-bold text-slate-900 block mb-2 uppercase text-xs tracking-wider">
          Specification Document Index
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800 font-medium">
          <a href="#section-1" className="hover:underline">1. The Three Distinct Layout Paradigms & Rationale</a>
          <a href="#section-2" className="hover:underline">2. Viewport Mockups & State Visualizations</a>
          <a href="#section-3" className="hover:underline">3. Unexpanded Row Information Architecture</a>
          <a href="#section-4" className="hover:underline">4. Keyboard Execution Path & Focus Order (25-Vehicle Batch)</a>
          <a href="#section-5" className="hover:underline">5. Pre-Save Warning Surfacing System</a>
          <a href="#section-6" className="hover:underline">6. Bootstrap 4 / React-Select / Styled-Components Mapping</a>
          <a href="#section-7" className="hover:underline">7. Strict Section 4 Interaction Contract Matrix</a>
          <a href="#section-8" className="hover:underline">8. Open Questions & Vendor Rule Inquiries</a>
        </div>
      </div>

      {/* Section 1: The Three Directions */}
      <section id="section-1" className="space-y-6 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">1</span>
          The Three Genuinely Different Layout Directions
        </h2>

        {/* Direction 1 */}
        <div className="bg-slate-50 border-l-4 border-blue-700 p-4 rounded-r-lg space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <FileSpreadsheet className="w-5 h-5 text-blue-700" />
            <h3>Direction 1: "The Remarketing Worksheet Grid" (Inline Financial Grid)</h3>
          </div>
          <p className="text-slate-700">
            <strong>Concept & Architecture:</strong> A spreadsheet-dense financial trading grid where each row represents a vehicle with key reference numbers (Cond Adj MMR, Base MMR, Last BGD Price, DP at Consignment) aligned in strict vertical columns, alongside an inline Sales Cascade dropdown and inline Price input. Full vehicle details (~40 fields) are accessible on-demand via a slide-over inspection drawer without causing page reflow or losing scroll position.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-emerald-800 block mb-1">Analyst Problem Solved:</strong>
              Completely eliminates row expansion for pricing. In the legacy page, pricing 25 vehicles required 25 accordion clicks and continuous vertical scrolling past 40 fields. In Direction 1, the analyst can price an entire 25-vehicle batch strictly using the keyboard (<kbd className="bg-slate-100 px-1 py-0.5 rounded font-mono">Tab</kbd> or <kbd className="bg-slate-100 px-1 py-0.5 rounded font-mono">Enter</kbd> moves directly down the pricing column). Aligned vertical numbers enable rapid comparison across adjacent rows.
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-amber-800 block mb-1">What It Gives Up:</strong>
              Vertical whitespace and passive visibility of secondary narrative text (such as long installed package lists or detailed repair notes). Analysts who regularly rely on notes to make pricing decisions must open the slide-over drawer.
            </div>
          </div>
        </div>

        {/* Direction 2 */}
        <div className="bg-slate-50 border-l-4 border-indigo-700 p-4 rounded-r-lg space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <SplitSquareVertical className="w-5 h-5 text-indigo-700" />
            <h3>Direction 2: "Master-Detail Workbench" (Dual-Pane Split Screen)</h3>
          </div>
          <p className="text-slate-700">
            <strong>Concept & Architecture:</strong> A 42%/58% split-pane workbench. The left pane provides a ultra-compact queue of vehicles showing Title, VIN, Grade, MMR, and status flags. The right pane is a persistent, sticky inspection & pricing cockpit that immediately updates whenever a vehicle is selected or focused via keyboard navigation (<kbd className="bg-slate-100 px-1 py-0.5 rounded font-mono">ArrowUp</kbd> / <kbd className="bg-slate-100 px-1 py-0.5 rounded font-mono">ArrowDown</kbd> or <kbd className="bg-slate-100 px-1 py-0.5 rounded font-mono">Enter</kbd>).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-emerald-800 block mb-1">Analyst Problem Solved:</strong>
              Solves the "deep context" off-lease pricing scenario where an analyst cannot price based solely on MMR without reviewing condition deductions, prior BGD lane bids, and inspection comments. Eliminates the jarring accordion shift of the legacy page while keeping all 40+ fields visible alongside the price input.
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-amber-800 block mb-1">What It Gives Up:</strong>
              Horizontal table scanning. Analysts cannot view 15 market pricing numbers across 5 vehicles simultaneously; only the currently active vehicle has its deep breakdown visible. On 1366px screens, horizontal space requires compact typography and tabbed detail grouping.
            </div>
          </div>
        </div>

        {/* Direction 3 */}
        <div className="bg-slate-50 border-l-4 border-sky-700 p-4 rounded-r-lg space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <CreditCard className="w-5 h-5 text-sky-700" />
            <h3>Direction 3: "Smart Action Strip" (Hybrid Accordion with First-Class Pricing Bar)</h3>
          </div>
          <p className="text-slate-700">
            <strong>Concept & Architecture:</strong> Preserves the familiar card/accordion mental model of the legacy application, but completely revamps the collapsed card header into a two-tier pricing action bar. Tier 1 displays VIN (last 7 bold), Make/Model/Trim, OpenLoop Mandatory tag, EV battery score, and legacy links. Tier 2 integrates the 4 key market numbers, the Sales Cascade select, and the Price input right on the collapsed card.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-emerald-800 block mb-1">Analyst Problem Solved:</strong>
              Eliminates the legacy flaw where the collapsed card was an empty title bar requiring expansion to see anything. Analysts can now price 100% of vehicles while remaining collapsed, but can still toggle the chevron to inspect packages and notes in-place without opening modals or drawers.
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-amber-800 block mb-1">What It Gives Up:</strong>
              Vertical screen density compared to Direction 1. Each collapsed card requires ~75px of vertical height (due to the two-tier structure), meaning ~7-9 vehicles fit on a 1080p screen without scrolling, versus 18-20 in the Worksheet Grid.
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Mockups & States */}
      <section id="section-2" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">2</span>
          Responsive Viewports (1920×1080 vs 1366×768) & The 10 Target States
        </h2>
        <p className="text-slate-600">
          All three directions are fully responsive and engineered specifically for 1920×1080 (analyst multi-monitor workstation) and 1366×768 (enterprise laptop). The live prototype above allows toggling between 1920px, 1366px, and responsive layouts.
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-2.5">Row State</th>
                <th className="p-2.5">Visual Signal & Tokens</th>
                <th className="p-2.5">Behavior & Contract Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-2.5 font-bold">1. Untouched</td>
                <td className="p-2.5">Neutral white/gray background, gray border, default price value</td>
                <td className="p-2.5">Original price loaded from database; not in pending changes set</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-800">2. Modified</td>
                <td className="p-2.5">Green left border (4px #15803d), green tinted background, "Vehicle has been modified" label</td>
                <td className="p-2.5">User entered price or touched blur; queued in pending changes set; revert icon visible</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-amber-800">3. MMR Warning</td>
                <td className="p-2.5">Amber border (4px #b45309), amber tinted background, amber message under input with allowed range</td>
                <td className="p-2.5">Triggered when price is outside ±6% of Cond Adj MMR (e.g. $25,200 vs $26,950). Does NOT block save, but prompts in confirmation modal</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-red-800">4. Hard Error</td>
                <td className="p-2.5">Red border (4px #dc3545), red background, bold error text citing broken rule</td>
                <td className="p-2.5">Price &le; $0, or below $15,000, or above $100,000 vendor limit. Flagged as "will not be saved"</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-red-700">5. OpenLoop Mandatory</td>
                <td className="p-2.5">Red "Mandatory" badge on title line; previous OpenLoop tactic preselected</td>
                <td className="p-2.5">Must be repriced before closing remarketing batch. Flagged in pre-save bar if unpriced</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-orange-800">6. Expired Inspection</td>
                <td className="p-2.5">Red eye inspection icon + "Expired Inspection" badge + server text tooltip</td>
                <td className="p-2.5">MMR warning is skipped per Rule 4.5.3; saving sends vehicle back to inspection queue</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">7. Vehicle Sold</td>
                <td className="p-2.5">Muted gray inputs, disabled cursor, strike/disabled styling</td>
                <td className="p-2.5">Price input and cascade dropdown disabled per Rule 4.5.2</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-red-900">8. Save Failed</td>
                <td className="p-2.5">Row-level red alert banner visible while collapsed with server error message</td>
                <td className="p-2.5">Retains pending edit; error message clears on re-edit or retry per Rule 4.3.5</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-600">9. Not Cascade Eligible</td>
                <td className="p-2.5">Cascade select omitted; replaced with subtle "N/A" text</td>
                <td className="p-2.5">Status not cascade-eligible or tactics non-existent per Rule 4.5.1</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-700">10. EV with Battery Score</td>
                <td className="p-2.5">Green battery icon with score (e.g. 92) + clickable popover trigger</td>
                <td className="p-2.5">Displays SoH, SoC, usable capacity, range, and report date per Rule 4.3.3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Information Architecture */}
      <section id="section-3" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">3</span>
          Unexpanded Row Information Architecture
        </h2>
        <p className="text-slate-700">
          To achieve the contract requirement that an analyst can price 25 vehicles without expanding any row, we selected the following fields for the unexpanded view:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded p-3 bg-slate-50">
            <span className="font-bold text-slate-900 block mb-1">1. Vehicle Identity & Differentiation</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><strong>VIN with last 7 bold</strong>: Resolves the issue where 5 rows named "2022 MINI COUNTRYMAN COOPER S" were previously indistinguishable.</li>
              <li><strong>Model Year, Make, Model, Trim</strong>: Immediate identification of vehicle series.</li>
              <li><strong>Exterior Color & Location State</strong>: Critical for remarketing regional demand.</li>
              <li><strong>Condition Grade & Odometer</strong>: Directly governs condition-based pricing.</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded p-3 bg-slate-50">
            <span className="font-bold text-slate-900 block mb-1">2. Core Remarketing Pricing Numbers</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><strong>Condition Adjusted MMR</strong>: The primary statistical benchmark driving remarketing prices in the US market.</li>
              <li><strong>Base MMR</strong>: Baseline reference to quantify condition deductions/premiums.</li>
              <li><strong>Last BGD Offered Price & Times Offered</strong>: Informs whether previous price points failed in lane/digital auctions.</li>
              <li><strong>Consignment DP (Dealer Price)</strong>: Benchmark floor for wholesale consignment.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Keyboard Execution Path */}
      <section id="section-4" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">4</span>
          The Keyboard Path: Pricing 25 Vehicles Without a Mouse
        </h2>
        <p className="text-slate-700">
          Remarketing analysts spend hours in batch pricing sessions. The keyboard workflow is designed with strict tabular predictability:
        </p>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs space-y-2">
          <div className="text-blue-400 font-bold font-sans text-sm">Target Workflow: Pricing Vehicle 1 through 25</div>
          <p>1. Initial Focus: Analyst hits search; focus lands on the first price input.</p>
          <p>2. Key sequence on Vehicle N:</p>
          <div className="pl-4 border-l-2 border-slate-700 space-y-1 text-slate-300">
            <div>• Analyst evaluates Cond Adj MMR ($34,200) vs Last BGD ($33,800).</div>
            <div>• Analyst types: <code className="text-emerald-400 font-bold">34100</code></div>
            <div>• Analyst hits <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Enter</kbd>:</div>
            <div className="pl-4 text-slate-400">
              ➔ Price is confirmed & formatted.<br />
              ➔ Validation evaluates live (green OK or amber warning message).<br />
              ➔ Focus immediately moves to <strong>Vehicle N+1's Price input</strong> with text pre-selected.
            </div>
          </div>
          <p>3. Changing Cascade without mouse:</p>
          <div className="pl-4 border-l-2 border-slate-700 text-slate-300">
            <div>• From Price input, hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Shift + Tab</kbd> ➔ Focus lands on Sales Cascade dropdown.</div>
            <div>• Hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Alt + Down</kbd> or <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">ArrowDown</kbd> to change tactic.</div>
            <div>• Hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Tab</kbd> to return to Price input.</div>
          </div>
          <p>4. Reverting Price: Hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Alt + R</kbd> or clear input (<kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Backspace</kbd> + <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Blur</kbd>) to restore original price.</p>
          <p>5. Opening Full Details: Hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Alt + D</kbd> to slide open the complete 40-field drawer.</p>
          <p>6. Saving Batch: Hit <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white font-bold">Ctrl + S</kbd> anywhere on page to trigger Save Confirmation.</p>
        </div>
      </section>

      {/* Section 5: Pre-Save Warnings */}
      <section id="section-5" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">5</span>
          Pre-Save Warning Surfacing System
        </h2>
        <p className="text-slate-700">
          In the legacy application, warnings only appeared at save time inside a modal listing 22+ rows. Analysts could not see which vehicles needed attention beforehand.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-amber-50 border border-amber-300 rounded p-3 space-y-1.5">
            <span className="font-bold text-amber-900 block text-sm">Page-Level Pre-Save Warning Bar</span>
            <p className="text-amber-800">
              Positioned directly above the results list. Summarizes all warning conditions across the active batch:
            </p>
            <div className="bg-white p-2 rounded border border-amber-200 font-mono text-[11px] text-amber-900">
              "3 mandatory not priced • 1 outside ±6% MMR • 1 price limit violation"
            </div>
            <p className="text-slate-600 text-[11px]">
              Clicking any pill immediately scrolls and focuses the first offending vehicle row on the page.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">Row-Level Live Visual Badging</span>
            <p className="text-slate-700">
              Offending rows display immediate visual hierarchy before save:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
              <li><strong>Amber border + message</strong>: MMR warning displayed directly under the price input with the exact allowed tolerance range.</li>
              <li><strong>Red border + message</strong>: Vendor price limit violations ($15k - $100k).</li>
              <li><strong>Red Mandatory tag</strong>: OpenLoop vehicles requiring price updates.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Component Mapping */}
      <section id="section-6" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">6</span>
          Component Mapping to Tech Stack
        </h2>
        <p className="text-slate-700">
          Direct mapping of all UI elements to React Bootstrap 4.6, react-select, styled-components, and FontAwesome 5:
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-2.5">UI Component</th>
                <th className="p-2.5">Target Implementation</th>
                <th className="p-2.5">Notes & Custom Component Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-2.5 font-semibold">Search Criteria Panel</td>
                <td className="p-2.5"><code>Card</code>, <code>Collapse</code>, <code>Form</code></td>
                <td className="p-2.5">Custom collapse header with persistent search snapshot summary</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Dropdown Filters</td>
                <td className="p-2.5"><code>react-select</code></td>
                <td className="p-2.5">Configured with compact custom styles (28px height, 12px font) for high density</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Virtual Results Table</td>
                <td className="p-2.5"><code>@tanstack/react-virtual</code> + <code>styled-components</code></td>
                <td className="p-2.5">Custom <code>TableWrapper</code> styled component maintaining fixed header and sticky columns</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Price Input & Cascade</td>
                <td className="p-2.5"><code>Form.Control</code> + <code>styled-components</code></td>
                <td className="p-2.5">Custom input component with input filtering (digits and . only), blur validation, and focus ring</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">EV Battery Telemetry</td>
                <td className="p-2.5"><code>OverlayTrigger</code>, <code>Popover</code></td>
                <td className="p-2.5">Lazy-loaded on first click; renders certified state of health and charge telemetry</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Save Confirmation Modal</td>
                <td className="p-2.5"><code>Modal</code> (backdrop="static", keyboard={false})</td>
                <td className="p-2.5">Non-dismissible backdrop per 4.6.2; custom accordion for 4 warning groups</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Batch Import Dialog</td>
                <td className="p-2.5"><code>Modal</code> + custom dropzone hook</td>
                <td className="p-2.5">File validation parser (CSV / XLSX) with row error reporting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 7: Interaction Contract */}
      <section id="section-7" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">7</span>
          Section 4 Interaction Contract Compliance Check
        </h2>
        <p className="text-slate-700">
          Exhaustive verification of every functional clause in Section 4.1 through 4.8:
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <div className="divide-y divide-slate-100">
            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.1 Search Panel Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Vehicle Status required & Any status validation:</strong> Kept, shown differently. Status is required. Selecting "Any" (value 0) without a VIN displays an inline red alert banner instead of blocking <code>window.alert()</code>.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cascade chain & dependencies:</strong> Kept as-is. Status change reloads dependent lists and resets criteria. Model Year change resets Model Range, Model, and Trim without server call. Manufacturer ➔ Model Range ➔ Model ➔ Trim cascade disables children until parent is selected.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Location Type rule:</strong> Kept as-is. Choosing "Upstream Location" hides Vehicle Location and clears its selection.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Snapshot criteria behavior:</strong> Kept as-is. Paging, sorting, and export use the search snapshot, not live dirty form state.
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.2 Results Toolbar, Sorting, Paging Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Consolidated counts & pending changes:</strong> Kept, shown differently. Fixes duplicate count ("1,688 vehicles found" and "Showing 1-25 of 1,688") into a unified status bar with pending count badge.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Edit preservation:</strong> Kept as-is. Pending edits survive sorting and page transitions.
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.3 & 4.4 Vehicle Row & Details Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>VIN last 7 bold & status indicators:</strong> Kept, shown differently. VIN last 7 is bolded directly on the collapsed row. OpenLoop Mandatory, EV battery score popover, and red expired inspection icon are visible without expanding.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Save failed banner:</strong> Kept, shown differently. Instead of relying on a toast, failed rows display an error message directly within the collapsed row header.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>All 40+ fields preserved:</strong> Kept as-is. Complete valuation numbers (MMR, Cond Adj, Color Adj, Option Adj, CarFax, DP at Consignment, DP - EWT), BGD history, sanitized notes, packages, and options are preserved.
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.5 Pricing Controls Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Input validation & blur rules:</strong> Kept as-is. Strips non-digit/period characters. Validation appears only after first blur. Blur with empty/0 restores original. Blur with any value counts as confirmed edit. Expired inspection vehicles skip MMR range warning per 4.5.3 rule.
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.6 Save Flow Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Save Confirmation with 4 Warning Groups:</strong> Kept as-is. Non-dismissible backdrop, grouped by Expired Inspection, MMR Range, Price Limit, and Mandatory Not Priced.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Queuing semantics:</strong> Kept as-is. UI explicitly uses "Queued", never "Saved".
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 font-bold text-slate-900">4.7 & 4.8 Import & Export Contract</div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Import & "Show N Vehicles":</strong> Kept as-is. Isolates imported VINs, replaces pending prices, validates rows, and reports unfound VINs.
              </div>
            </div>
            <div className="p-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Export:</strong> Kept as-is. Exports submitted search snapshot to Excel, CSV, or PDF.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Open Questions */}
      <section id="section-8" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#173B68] text-white flex items-center justify-center text-xs font-bold">8</span>
          Open Questions & Architectural Clarifications
        </h2>
        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>1. Vendor-Specific MMR Tolerance Bands:</strong> The current rules specify &plusmn;6% for MMR warnings. Does BMW Financial Services intend to allow analysts to configure asymmetric tolerances (e.g. +4% / -8%) by vehicle category (e.g., CPO vs wholesale auction units)?
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>2. Virtualized List Dynamic Row Height in Direction 3:</strong> In Direction 3 (Smart Action Strip), expanding a card changes row height from 75px to ~240px. <code>@tanstack/react-virtual</code> handles dynamic row measurement via <code>measureElement</code>, but scrolling speed is fastest in Direction 1 where row heights are fixed (42px). We recommend Direction 1 for batches &gt; 500 records.
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>3. Async Save Queue Polling:</strong> Since saving prices queues a background job rather than executing synchronously, should the UI subscribe to a WebSocket event or provide a floating status drawer to show when the backend batch worker completes processing?
          </div>
        </div>
      </section>
    </div>
  );
};
