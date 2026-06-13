'use client';
import React, { useState, useEffect } from 'react';

const ReportPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/report')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!data || data.error) {
    return <div className="p-10 text-center text-red-500">Failed to load report data.</div>;
  }

  const { overviewStats, projectPerformance, budgetAllocation, contractorPerformance } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      {/* Page Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
  <div className="flex items-center gap-3 mb-2">
    <div className="h-10 w-[4px] rounded-full bg-gradient-to-b from-blue-600 via-emerald-400 to-green-400"></div>

    <h1 className="text-3xl md:text-4xl font-bold font-headline leading-tight 
      bg-gradient-to-r from-blue-600 via-emerald-400 to-green-400 
      bg-clip-text text-transparent tracking-tight">
      Executive Performance Overview
    </h1>
  </div>

  <p className="text-slate-500 mt-1 ml-5 text-sm md:text-base">
    Real-time operational and financial insights across all active job sites.
  </p>
</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
            {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
              <button
                key={period}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  period === 'Monthly' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:shadow-lg transition-all hover:border-slate-300">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:opacity-95">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'TOTAL REVENUE', value: overviewStats?.totalRevenue || '$0', change: '+12.4%', changeType: 'up', icon: 'payments', color: 'emerald' },
          { title: 'COMPLETION RATE', value: overviewStats?.completionRate || '0%', change: 'On Track', changeType: 'neutral', icon: 'task_alt', color: 'blue' },
          { title: 'ACTIVE RESOURCES', value: String(overviewStats?.activeResources || 0), change: '94% Capacity', changeType: 'neutral', icon: 'engineering', color: 'amber' },
          { title: 'SAFETY INCIDENTS', value: overviewStats?.safetyIncidents || '0.0', change: '-20% YoY', changeType: 'down', icon: 'health_and_safety', color: 'rose' },
        ].map((stat) => (
          <div key={stat.title} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-tighter ${
                stat.changeType === 'up' ? 'bg-emerald-100 text-emerald-700' :
                stat.changeType === 'down' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.title}</p>
            <h3 className="text-3xl font-bold font-headline text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Bento Grid Section 1: Main Chart & Financials */}
      <div className="grid grid-cols-12 gap-6">
        {/* Project Performance Chart - Enhanced */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline text-slate-900">Project Progress vs. Schedule</h3>
              <p className="text-sm text-slate-500 mt-0.5">Timeline performance across top 5 active sites</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"></div>
                <span className="text-xs font-bold text-slate-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-600">Target</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {projectPerformance && projectPerformance.length > 0 ? projectPerformance.map((project) => (
              <div key={project.name} className="group">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>{project.name}</span>
                  <span className="text-emerald-600">{project.actual}%</span>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-slate-200 rounded-full transition-all duration-500"
                    style={{ width: `${project.target}%` }}
                  />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${project.actual}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-center text-sm text-slate-500 font-bold py-4">No active projects found.</p>
            )}
          </div>
        </div>

        {/* Financial Summary - Enhanced Donut */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold font-headline text-slate-900 mb-1">Budget Allocation</h3>
          <p className="text-sm text-slate-500 mb-6">Spend by category (Actuals)</p>
          <div className="flex-1 flex flex-col justify-center items-center relative py-6">
            {/* Enhanced SVG Donut */}
            <svg className="w-48 h-48 transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="100.48" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#2b6954" strokeDasharray="251.2" strokeDashoffset="200.96" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#34d399" strokeDasharray="251.2" strokeDashoffset="238.64" strokeWidth="12" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center bg-white/80 backdrop-blur-sm p-3 rounded-full">
              <span className="text-2xl font-bold text-slate-900">{budgetAllocation?.total || '$0'}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {[
              { label: 'Materials', percent: `${budgetAllocation?.materials?.percent}%`, amount: budgetAllocation?.materials?.amount, color: 'bg-emerald-500' },
              { label: 'Labor', percent: `${budgetAllocation?.labor?.percent}%`, amount: budgetAllocation?.labor?.amount, color: 'bg-teal-600' },
              { label: 'Equipment', percent: `${budgetAllocation?.equipment?.percent}%`, amount: budgetAllocation?.equipment?.amount, color: 'bg-emerald-300' },
              { label: 'Other', percent: `${budgetAllocation?.other?.percent}%`, amount: budgetAllocation?.other?.amount, color: 'bg-slate-200' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700">{item.label}</p>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.percent}</span>
                    <span>{item.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contractor Performance Table - Enhanced */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-sm">groups</span>
              </div>
              <h3 className="text-xl font-bold font-headline text-slate-900">Contractor Performance Matrix</h3>
            </div>
            <p className="text-sm text-slate-500 mt-1 ml-8">Efficiency ratings based on project delivery milestones</p>
          </div>
          <button className="text-emerald-600 font-bold text-sm flex items-center space-x-1 hover:gap-2 transition-all group">
            <span>View Full Directory</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-slate-50 to-white">
              <tr>
                {['CONTRACTOR', 'RATING', 'ON-TIME %', 'COST VARIANCE', 'STATUS'].map((header) => (
                  <th key={header} className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contractorPerformance && contractorPerformance.length > 0 ? contractorPerformance.map((contractor) => (
                <tr key={contractor.name} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm group-hover:scale-105 transition-transform">
                        {contractor.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{contractor.name}</p>
                        <p className="text-[10px] text-slate-500 tracking-wide">{contractor.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm">
                            {i < Math.floor(contractor.rating) ? 'star' : i < contractor.rating ? 'star_half' : 'star_outline'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{contractor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${contractor.onTime}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{contractor.onTime}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${contractor.varianceType === 'negative' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {contractor.variance > 0 ? '+' : ''}{contractor.variance}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      contractor.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700' : contractor.statusColor === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {contractor.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm font-bold text-slate-500">No contractors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button - Enhanced */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 hover:shadow-emerald-500/25 group">
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'wght' 600" }}>
          add_chart
        </span>
      </button>
    </div>
  );
};

export default ReportPage;