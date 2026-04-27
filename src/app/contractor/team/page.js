'use client';
import { useState } from 'react';

const members = [
  { id: 1, name: 'Arjun Sharma', role: 'Master Mason', site: 'Emerald Heights', img: '11', status: 'Active', shift: 'Morning', attendance: 96, tasks: 8 },
  { id: 2, name: 'Meera Kapur', role: 'Safety Officer', site: 'All Sites', img: '32', status: 'Active', shift: 'Morning', attendance: 99, tasks: 5 },
  { id: 3, name: 'Siddharth Verma', role: 'Steel Fixer', site: 'Nirman Trade', img: '44', status: 'Away', shift: 'Evening', attendance: 88, tasks: 3 },
  { id: 4, name: 'Priya Nair', role: 'Civil Engineer', site: 'Sector 14', img: '56', status: 'Active', shift: 'Morning', attendance: 100, tasks: 12 },
  { id: 5, name: 'Ravi Patel', role: 'Electrician', site: 'Green Valley', img: '65', status: 'Active', shift: 'Morning', attendance: 92, tasks: 6 },
  { id: 6, name: 'Kavya Reddy', role: 'Plumber Lead', site: 'Airport Road', img: '20', status: 'Off Duty', shift: 'Night', attendance: 84, tasks: 4 },
  { id: 7, name: 'Manoj Tiwari', role: 'Crane Operator', site: 'Emerald Heights', img: '77', status: 'Active', shift: 'Morning', attendance: 97, tasks: 2 },
  { id: 8, name: 'Suresh Pillai', role: 'Foreman', site: 'Central Plaza', img: '33', status: 'Active', shift: 'Morning', attendance: 95, tasks: 10 },
];

const sites = ['All Sites', 'Emerald Heights', 'Central Plaza', 'Sector 14', 'Green Valley', 'Nirman Trade', 'Airport Road'];

const statusCfg = {
  Active:   { dot: 'bg-primary', badge: 'bg-primary/10 text-[#006a28]' },
  Away:     { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600' },
  'Off Duty': { dot: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-500' },
};

export default function ContractorTeam() {
  const [site, setSite] = useState('All Sites');
  const [search, setSearch] = useState('');

  const visible = members.filter(m =>
    (site === 'All Sites' || m.site === site) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = members.filter(m => m.status === 'Active').length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Team Management
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Your <span className="text-primary">Crew</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">{members.length} personnel across {sites.length - 1} active sites</p>
        </div>
        <button className="premium-gradient text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all text-sm">
          <span className="material-symbols-outlined text-lg">person_add</span> Add Member
        </button>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Crew', value: members.length, icon: 'groups', bg: 'bg-primary/10', text: 'text-primary' },
          { label: 'Active Now', value: active, icon: 'person_check', bg: 'bg-primary/10', text: 'text-[#006a28]' },
          { label: 'Away / Off', value: members.length - active, icon: 'person_off', bg: 'bg-amber-50', text: 'text-amber-500' },
          { label: 'Avg Attendance', value: `${Math.round(members.reduce((a, m) => a + m.attendance, 0) / members.length)}%`, icon: 'calendar_today', bg: 'bg-blue-50', text: 'text-blue-500' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search crew members..."
            className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {sites.slice(0, 4).map(s => (
            <button key={s} onClick={() => setSite(s)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                site === s ? 'premium-gradient text-white shadow-lg shadow-primary/20' : 'glass text-[#548064] hover:bg-white'
              }`}>
              {s === 'All Sites' ? 'All' : s.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visible.map(m => {
          const sc = statusCfg[m.status] || statusCfg['Off Duty'];
          return (
            <div key={m.id} className="glass p-6 rounded-[32px] premium-shadow hover:bg-white transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative shrink-0">
                  <img
                    src={`https://i.pravatar.cc/150?img=${m.img}`}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${sc.dot} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#06361f] text-base truncate">{m.name}</h3>
                  <p className="text-xs font-bold text-[#548064] uppercase tracking-widest">{m.role}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>{m.site}
                  </p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${sc.badge}`}>{m.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-[#f8faf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Attendance</p>
                  <p className="text-lg font-black text-[#06361f]">{m.attendance}%</p>
                </div>
                <div className="bg-[#f8faf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Tasks</p>
                  <p className="text-lg font-black text-[#06361f]">{m.tasks}</p>
                </div>
                <div className="bg-[#f8faf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Shift</p>
                  <p className="text-xs font-black text-[#06361f] mt-1">{m.shift}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-primary/10 text-primary text-xs font-black rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">chat_bubble</span> Message
                </button>
                <button className="flex-1 py-2 glass text-[#548064] text-xs font-black rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">open_in_new</span> Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
