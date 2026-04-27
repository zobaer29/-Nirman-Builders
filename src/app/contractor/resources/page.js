'use client';
import { useState } from 'react';

const materials = [
  { id: 1, name: 'Portland Cement (OPC 53)', category: 'Cement', stock: 340, unit: 'Bags', threshold: 200, site: 'Emerald Heights', status: 'OK' },
  { id: 2, name: 'TMT Rebar – Fe 500D', category: 'Steel', stock: 18, unit: 'MT', threshold: 25, site: 'Central Plaza', status: 'Low' },
  { id: 3, name: 'Marble Tiles (Italian White)', category: 'Finishing', stock: 0, unit: 'Sq.ft', threshold: 500, site: 'Central Plaza', status: 'Out' },
  { id: 4, name: 'River Sand (M Sand)', category: 'Aggregate', stock: 620, unit: 'Cu.ft', threshold: 300, site: 'Sector 14', status: 'OK' },
  { id: 5, name: 'Ready Mix Concrete M30', category: 'Concrete', stock: 45, unit: 'Cu.m', threshold: 30, site: 'Green Valley', status: 'OK' },
  { id: 6, name: 'Electrical Conduit Pipes', category: 'Electrical', stock: 80, unit: 'Pcs', threshold: 150, site: 'Green Valley', status: 'Low' },
];

const equipment = [
  { name: 'Tower Crane', site: 'Emerald Heights', operator: 'Suresh P.', status: 'Active', hours: '6h 40m' },
  { name: 'Concrete Mixer (8 cu.ft)', site: 'Green Valley', operator: 'Ramesh K.', status: 'Active', hours: '4h 10m' },
  { name: 'Excavator JCB 3DX', site: 'Airport Road', operator: 'Vijay M.', status: 'Active', hours: '3h 55m' },
  { name: 'Bar Bending Machine', site: 'Central Plaza', operator: 'Unassigned', status: 'Idle', hours: '—' },
  { name: 'Transit Mixer', site: 'Sector 14', operator: 'Manoj T.', status: 'Maintenance', hours: '—' },
];

const matStatus = {
  OK: { bg: 'bg-primary/10', text: 'text-[#006a28]', bar: 'bg-primary rounded-full' },
  Low: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-400 rounded-full' },
  Out: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500 rounded-full' },
};
const eqStatus = {
  Active: { bg: 'bg-primary/10', text: 'text-[#006a28]' },
  Idle: { bg: 'bg-zinc-100', text: 'text-zinc-500' },
  Maintenance: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

export default function ContractorResources() {
  const [tab, setTab] = useState('materials');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Resource Hub</span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Materials & <span className="text-primary">Equipment</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Track inventory and machinery across all sites</p>
        </div>
        <button className="premium-gradient text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all text-sm">
          <span className="material-symbols-outlined text-lg">add_shopping_cart</span> Request Supply
        </button>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-[24px] p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 shrink-0">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="flex-1">
          <p className="font-black text-red-700 text-sm">2 Critical Supply Alerts</p>
          <p className="text-xs font-bold text-red-500">Marble Tiles are out of stock · TMT Rebar below threshold at Central Plaza</p>
        </div>
        <button className="text-xs font-black text-red-600 hover:underline whitespace-nowrap">Order Now →</button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: '6', icon: 'inventory_2', bg: 'bg-primary/10', text: 'text-primary' },
          { label: 'Low Stock', value: '2', icon: 'trending_down', bg: 'bg-amber-50', text: 'text-amber-500' },
          { label: 'Out of Stock', value: '1', icon: 'remove_shopping_cart', bg: 'bg-red-50', text: 'text-red-500' },
          { label: 'Equipment Live', value: '3', icon: 'construction', bg: 'bg-primary/10', text: 'text-[#006a28]' },
        ].map(s => (
          <div key={s.label} className="glass p-6 rounded-[28px] premium-shadow flex items-center gap-4">
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center ${s.text}`}>
              <span className="material-symbols-outlined text-2xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-[#06361f]">{s.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-2">
        {['materials', 'equipment'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${tab === t ? 'premium-gradient text-white shadow-lg shadow-primary/20' : 'glass text-[#548064] hover:bg-white'
              }`}>
            {t === 'materials' ? 'Materials' : 'Equipment'}
          </button>
        ))}
      </div>

      {tab === 'materials' && (
        <div className="glass rounded-[36px] premium-shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h3 className="font-black text-[#06361f] text-lg">Material Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-[#548064] uppercase tracking-widest bg-[#f8faf9]">
                  <th className="text-left px-6 py-4">Material</th>
                  <th className="text-left px-6 py-4 hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-4 hidden lg:table-cell">Site</th>
                  <th className="text-left px-6 py-4">Level</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => {
                  const sc = matStatus[m.status];
                  const pct = m.stock === 0 ? 0 : Math.min(100, (m.stock / (m.threshold * 2)) * 100);
                  return (
                    <tr key={m.id} className="border-b border-zinc-50 hover:bg-[#f8faf9] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-sm text-[#06361f]">{m.name}</p>
                        <p className="text-[10px] text-[#548064]">{m.stock} {m.unit}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs font-bold text-[#548064] bg-[#f0f4f2] px-2 py-1 rounded-full">{m.category}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm font-bold text-[#548064]">{m.site}</td>
                      <td className="px-6 py-4">
                        <div className="w-24">
                          <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
                            <div className={`h-full ${sc.bar}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${sc.bg} ${sc.text}`}>{m.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary text-xs font-black hover:underline">Order</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'equipment' && (
        <div className="glass rounded-[36px] premium-shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h3 className="font-black text-[#06361f] text-lg">Equipment Status</h3>
          </div>
          {equipment.map((eq, i) => {
            const sc = eqStatus[eq.status] || { bg: 'bg-zinc-100', text: 'text-zinc-500' };
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 border-b border-zinc-50 hover:bg-[#f8faf9] transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">build</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-[#06361f]">{eq.name}</p>
                  <p className="text-[10px] text-[#548064]">{eq.site} · {eq.operator}</p>
                </div>
                <div className="flex items-center gap-4">
                  {eq.hours !== '—' && <span className="text-xs font-black text-[#548064]">⏱ {eq.hours}</span>}
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${sc.bg} ${sc.text}`}>{eq.status}</span>
                  <button className="text-xs font-black text-primary hover:underline">Details</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
