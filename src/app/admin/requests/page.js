"use client";
import Image from "next/image";

export default function AdminRequests() {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Primary Content */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface font-headline">Platform Requests</h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Monitor project proposals and contractor applications.
            </p>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-headline">Recent Project Requests</h3>
            <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                        Client Details
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                        Type & Budget
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                        Status
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    <tr className="group hover:bg-surface-container-lowest transition-colors">
                      <td className="px-4 py-6">
                        <p className="font-bold text-on-surface">TechNova Ltd.</p>
                        <p className="text-xs text-on-surface-variant">Banani, Dhaka</p>
                      </td>
                      <td className="px-4 py-6">
                        <p className="font-medium">Office Interior</p>
                        <p className="text-xs text-tertiary">45 Lakh</p>
                      </td>
                      <td className="px-4 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary-dim">
                          Estimating
                        </span>
                      </td>
                      <td className="px-4 py-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button className="text-xs font-bold text-primary hover:underline transition-all">Approve</button>
                          <button className="text-xs font-bold text-error hover:underline transition-all">Decline</button>
                        </div>
                      </td>
                    </tr>
                    <tr className="group hover:bg-surface-container-lowest transition-colors">
                      <td className="px-4 py-6">
                        <p className="font-bold text-on-surface">Apex Holdings</p>
                        <p className="text-xs text-on-surface-variant">Gulshan 2, Dhaka</p>
                      </td>
                      <td className="px-4 py-6">
                        <p className="font-medium">Residential Complex</p>
                        <p className="text-xs text-tertiary">12 Cr</p>
                      </td>
                      <td className="px-4 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
                          New Request
                        </span>
                      </td>
                      <td className="px-4 py-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button className="text-xs font-bold text-primary hover:underline transition-all">Approve</button>
                          <button className="text-xs font-bold text-error hover:underline transition-all">Decline</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
        </div>

        {/* Create Project Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-dim p-8 flex flex-col md:flex-row items-start md:items-center justify-between text-white shadow-lg gap-6">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold font-headline mb-2">Ready to start a new build?</h3>
            <p className="text-on-primary opacity-90 max-w-md">
              Initialize new project workflows, assign contractors, and set milestones in seconds.
            </p>
          </div>
          <button className="relative z-10 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-transform active:scale-95 shadow-xl hover:shadow-2xl whitespace-nowrap">
            <span className="material-symbols-outlined font-black">add</span>
            Create Project
          </button>
          
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              construction
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Sidebar */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 min-h-[400px] border border-gray-100">
          <h3 className="text-lg font-bold font-headline mb-6">Completed Projects</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="mt-1 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-dim" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">City Shopping Mall</p>
                <p className="text-xs text-on-surface-variant mb-1">Shopping Mall</p>
                <p className="text-sm font-bold text-tertiary">45 Cr</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="mt-1 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-dim" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">Golf Club</p>
                <p className="text-xs text-on-surface-variant mb-1">Playground</p>
                <p className="text-sm font-bold text-tertiary">50 Cr</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="mt-1 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-dim" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">Lakeside Villas</p>
                <p className="text-xs text-on-surface-variant mb-1">Luxury Housing</p>
                <p className="text-sm font-bold text-tertiary">28 Cr</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="mt-1 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-dim" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">Green Valley Bridge</p>
                <p className="text-xs text-on-surface-variant mb-1">Infrastructure</p>
                <p className="text-sm font-bold text-tertiary">115 Cr</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-10 py-3 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container-low transition-colors">
            VIEW ARCHIVE
          </button>
        </div>

        {/* Additional Context Card */}
        <div className="bg-tertiary-container/10 border border-tertiary/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-tertiary">insights</span>
            <h4 className="font-bold font-headline text-tertiary-dim">Quarterly Insight</h4>
          </div>
          <p className="text-xs text-tertiary-dim leading-relaxed">
            Project requests are up by <span className="font-bold text-primary">12.5%</span> compared to last
            month. Consider expanding the contractor pool for Interior works.
          </p>
        </div>
      </div>
    </div>
  );
}
