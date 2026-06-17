'use client';
import { useState, useEffect } from 'react';

const riskBadge = {
  Low:    'bg-primary/10 text-[#006a28]',
  Medium: 'bg-amber-50 text-amber-600',
  High:   'bg-red-50 text-red-600',
};

export default function ContractorAnalytics() {
  const [metric, setMetric] = useState('tasks');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real data
  useEffect(() => {
    fetch('/api/contractor/analytics')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!data || data.error) {
    return <div className="p-10 text-center text-red-500">Failed to load analytics data.</div>;
  }

  const { weeklyData, projectHealth, kpis, efficiencyRings } = data;
  const maxVal = Math.max(...(weeklyData || []).map(d => d[metric] || 0), 1);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Analytics
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Performance <span className="text-primary">Insights</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Real-time data across all your active projects</p>
        </div>
        
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="glass p-6 rounded-[28px] premium-shadow hover:bg-white transition-all group">
            <div className={`w-12 h-12 ${k.bg} rounded-2xl flex items-center justify-center ${k.color} group-hover:scale-110 transition-transform mb-4`}>
              <span className="material-symbols-outlined text-2xl">{k.icon}</span>
            </div>
            <h3 className="text-3xl font-black text-[#06361f]">{k.value}</h3>
            <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mt-1">{k.label}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </section>

      {/* Bar Chart + Project Health */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-3 glass p-8 rounded-[36px] premium-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#06361f]">Weekly Activity</h3>
            <div className="flex gap-2">
              {['tasks', 'hours'].map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    metric === m ? 'premium-gradient text-white shadow-md' : 'bg-[#f0f4f2] text-[#548064] hover:bg-white'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-44 mt-4">
            {weeklyData.map(d => {
              const val = d[metric];
              const pct = (val / maxVal) * 100;
              const isTop = val === maxVal;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                  <span className="text-[10px] font-black text-[#548064] opacity-0 group-hover:opacity-100 transition-opacity mb-1">{val}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className={`w-full rounded-t-2xl transition-all duration-500 ${isTop ? 'premium-gradient' : 'bg-primary/20 group-hover:bg-primary/40'}`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#548064] mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Health */}
        <div className="lg:col-span-2 glass p-8 rounded-[36px] premium-shadow">
          <h3 className="text-xl font-black text-[#06361f] mb-6">Project Health</h3>
          <div className="space-y-5">
            {projectHealth.map(p => (
              <div key={p.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-xs font-black text-[#06361f] truncate flex-1">{p.name}</p>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${riskBadge[p.risk]}`}>{p.risk}</span>
                    <span className="text-xs font-black text-[#006a28]">{p.progress}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[#f0f4f2] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${p.onTime ? 'bg-primary' : 'bg-red-400'}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efficiency Rings */}
      <div className="glass p-8 rounded-[36px] premium-shadow">
        <h3 className="text-xl font-black text-[#06361f] mb-8">Efficiency Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {efficiencyRings.map(e => (
            <div key={e.label} className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f4f2" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={e.stroke}
                    strokeWidth="10"
                    strokeDasharray={`${e.value * 2.513} 251.3`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-[#06361f]">{e.value}%</span>
                </div>
              </div>
              <p className="text-xs font-black text-[#548064] uppercase tracking-widest text-center">{e.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
