'use client';
import { useState, useEffect } from 'react';

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
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await fetch('/api/contractor/inventory');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error('Failed to fetch contractor materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/contractor/materials');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch contractor material requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchRequests();
  }, []);

  const handleRequestAction = async (requestId, nextStatus) => {
    try {
      const res = await fetch('/api/contractor/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: nextStatus })
      });

      if (res.ok) {
        alert(`Request ${nextStatus.toLowerCase()} successfully!`);
        fetchRequests();
        fetchMaterials(); // In case material database got updated or for sync
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update request.');
      }
    } catch (err) {
      console.error('Error updating material request:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleOrderMaterial = async (materialId) => {
    try {
      const res = await fetch('/api/contractor/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId })
      });
      if (res.ok) {
        alert('Supply order placed and worker verification task generated!');
        fetchMaterials();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to place supply order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('An error occurred. Please try again.');
    }
  };

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
       
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: materials.length.toString(), icon: 'inventory_2', bg: 'bg-primary/10', text: 'text-primary' },
          { label: 'Low Stock', value: materials.filter(m => m.status === 'Low').length.toString(), icon: 'trending_down', bg: 'bg-amber-50', text: 'text-amber-500' },
          { label: 'Out of Stock', value: materials.filter(m => m.status === 'Out').length.toString(), icon: 'remove_shopping_cart', bg: 'bg-red-50', text: 'text-red-500' },
          { label: 'Pending Requests', value: requests.filter(r => r.status === 'Pending').length.toString(), icon: 'receipt_long', bg: 'bg-amber-50', text: 'text-amber-600' },
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
        {[
          { id: 'materials', label: 'Materials' },
          { id: 'requests', label: `Worker Requests (${requests.filter(r => r.status === 'Pending').length})` },
         
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${tab === t.id ? 'premium-gradient text-white shadow-lg shadow-primary/20' : 'glass text-[#548064] hover:bg-white'
              }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'materials' && (
        <div className="glass rounded-[36px] premium-shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h3 className="font-black text-[#06361f] text-lg">Material Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            {loadingMaterials ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-[#006a28] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs font-black uppercase">Loading materials...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="p-10 text-center text-slate-500 font-bold">No materials found in the database.</div>
            ) : (
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
                    const sc = matStatus[m.status] || { bg: 'bg-zinc-100', text: 'text-zinc-500', bar: 'bg-zinc-300 rounded-full' };
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
                          <button 
                            onClick={() => handleOrderMaterial(m.id)}
                            className="text-primary text-xs font-black hover:underline"
                          >
                            Order
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div className="glass rounded-[36px] premium-shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h3 className="font-black text-[#06361f] text-lg">Worker Material Requisitions</h3>
          </div>
          <div className="overflow-x-auto">
            {loadingRequests ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-[#006a28] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs font-black uppercase">Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-10 text-center text-slate-500 font-bold">No material requests submitted yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-[#548064] uppercase tracking-widest bg-[#f8faf9]">
                    <th className="text-left px-6 py-4">Requester</th>
                    <th className="text-left px-6 py-4">Material</th>
                    <th className="text-left px-6 py-4">Site</th>
                    <th className="text-left px-6 py-4">Urgency</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-right px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-50 hover:bg-[#f8faf9] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-sm text-[#06361f]">{r.worker_name}</p>
                        <p className="text-[10px] text-[#548064]">{new Date(r.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-sm text-[#06361f]">{r.material_name}</p>
                        <p className="text-[10px] text-[#548064]">{r.quantity} {r.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#548064]">{r.project_name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                          r.urgency.toLowerCase().includes('emergency') ? 'bg-red-50 text-red-600' :
                          r.urgency.toLowerCase().includes('urgent') ? 'bg-amber-50 text-amber-600' :
                          'bg-[#f0fff4] text-[#006a28]'
                        }`}>
                          {r.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                          r.status === 'Approved' ? 'bg-[#f0fff4] text-[#006a28]' :
                          r.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                          'bg-zinc-100 text-zinc-500'
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {r.status === 'Pending' ? (
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleRequestAction(r.id, 'Approved')}
                              className="bg-[#006a28] text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-[#00521e] transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleRequestAction(r.id, 'Rejected')}
                              className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-rose-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-[#548064] uppercase">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
