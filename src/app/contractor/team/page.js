'use client';

import { useState, useEffect } from 'react';

const statusCfg = {
  Active:   { dot: 'bg-[#006a28]', badge: 'bg-primary/10 text-[#006a28]', text: 'Active' },
  Away:     { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600', text: 'Away' },
  'Off Duty': { dot: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-500', text: 'Off Duty' },
};

const shiftColors = {
  Morning: 'bg-blue-50 text-blue-600 border border-blue-100',
  Evening: 'bg-purple-50 text-purple-600 border border-purple-100',
  Night: 'bg-slate-800 text-slate-100 border border-slate-700',
};

export default function ContractorTeam() {
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI Filters
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [search, setSearch] = useState('');

  // Notification Toast State
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form states
  const [newMember, setNewMember] = useState({
    workerId: '',
    projectId: '',
    roleOnSite: '',
    shift: 'Morning',
  });

  const [editForm, setEditForm] = useState({
    roleOnSite: '',
    shift: 'Morning',
    status: 'Active',
  });

  const [submitting, setSubmitting] = useState(false);

  // Show auto-dismiss notification toast
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  };

  // Fetch all team data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contractor/team');
      if (!res.ok) {
        throw new Error('Failed to load team data');
      }
      const data = await res.json();
      setTeam(data.team || []);
      setProjects(data.projects || []);
      setAvailableWorkers(data.availableWorkers || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter team
  const visible = team.filter(m =>
    (siteFilter === 'All Sites' || m.site === siteFilter) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic sites list for filter bar
  const uniqueSites = ['All Sites', ...new Set(team.map(m => m.site))];

  // Dynamic statistics
  const activeCount = team.filter(m => m.status === 'Active').length;
  const awayCount = team.filter(m => m.status !== 'Active').length;
  const avgAttendance = team.length 
    ? Math.round(team.reduce((a, m) => a + m.attendance, 0) / team.length) 
    : 0;

  // Add (Assign) Member Action
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.workerId || !newMember.projectId) {
      showToast('Please select both a worker and a project.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractor/projects/assign-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: Number(newMember.projectId),
          workerId: Number(newMember.workerId),
          roleOnSite: newMember.roleOnSite || undefined,
          shift: newMember.shift,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to assign worker');
      }

      showToast('Worker successfully assigned to project!');
      setIsAddModalOpen(false);
      // Reset form
      setNewMember({ workerId: '', projectId: '', roleOnSite: '', shift: 'Morning' });
      fetchData(); // Reload roster
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditForm({
      roleOnSite: member.role,
      shift: member.shift,
      status: member.status,
    });
    setIsEditModalOpen(true);
  };

  // Edit Member Action
  const handleEditMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractor/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedMember.projectId,
          workerId: selectedMember.id,
          roleOnSite: editForm.roleOnSite,
          shift: editForm.shift,
          status: editForm.status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update crew member');
      }

      showToast('Crew member updated successfully!');
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Remove (Unassign) Member Action
  const handleRemoveMember = async (projectId, workerId) => {
    if (!confirm('Are you sure you want to unassign and remove this worker from the project?')) {
      return;
    }
    try {
      const res = await fetch(`/api/contractor/team?projectId=${projectId}&workerId=${workerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to unassign worker');
      }

      showToast('Worker successfully unassigned from the project.');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Toast Notification Banner */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-[#eefcf2] text-[#0c6b30] border border-[#d2f7dd]'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {notification.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Team Management
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Your <span className="text-primary">Crew</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">
            {team.length} personnel across {projects.length} managed project sites
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="premium-gradient text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">person_add</span> Add Member
        </button>
      </section>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[#548064] font-black uppercase tracking-wider text-xs">Loading Crew Roster...</p>
        </div>
      ) : error ? (
        <div className="glass p-8 rounded-[32px] text-center border-red-200 bg-red-50/50">
          <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
          <h3 className="text-lg font-black text-red-800">Error Loading Team</h3>
          <p className="text-red-600 mt-1 font-medium">{error}</p>
          <button onClick={fetchData} className="mt-4 px-6 py-2 bg-red-100 text-red-800 rounded-xl font-bold hover:bg-red-200 transition-colors text-sm">
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Crew', value: team.length, icon: 'groups', bg: 'bg-primary/10', text: 'text-primary' },
              { label: 'Active Now', value: activeCount, icon: 'person_check', bg: 'bg-primary/10', text: 'text-[#006a28]' },
              { label: 'Away / Off', value: awayCount, icon: 'person_off', bg: 'bg-amber-50', text: 'text-amber-500' },
              { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: 'calendar_today', bg: 'bg-blue-50', text: 'text-blue-500' },
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
                className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {uniqueSites.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSiteFilter(s)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    siteFilter === s 
                      ? 'premium-gradient text-white shadow-lg shadow-primary/20' 
                      : 'glass text-[#548064] hover:bg-white hover:text-[#06361f]'
                  }`}
                >
                  {s === 'All Sites' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Member Grid */}
          {visible.length === 0 ? (
            <div className="glass p-12 rounded-[32px] text-center">
              <span className="material-symbols-outlined text-[#548064] text-5xl mb-3">group_off</span>
              <h3 className="text-xl font-black text-[#06361f]">No Crew Members Found</h3>
              <p className="text-[#548064] mt-1 font-bold">Try adjusting your filters or assign a new worker.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visible.map(m => {
                const sc = statusCfg[m.status] || statusCfg['Off Duty'];
                return (
                  <div key={`${m.projectId}-${m.id}`} className="glass p-6 rounded-[32px] premium-shadow hover:bg-white transition-all duration-300 group flex flex-col justify-between">
                    <div>
                      {/* Top Header info */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative shrink-0">
                          <img
                            src={m.photoUrl || `https://i.pravatar.cc/150?img=${m.img}`}
                            alt={m.name}
                            className="w-14 h-14 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${sc.dot} rounded-full border-2 border-white`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-[#06361f] text-base truncate">{m.name}</h3>
                          <p className="text-xs font-bold text-[#548064] uppercase tracking-widest">{m.role}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1 font-bold">
                            <span className="material-symbols-outlined text-xs">location_on</span>{m.site}
                          </p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${sc.badge}`}>
                          {sc.text}
                        </span>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-[#f8faf9] rounded-xl p-3 text-center">
                          <p className="text-[9px] font-black text-[#548064] uppercase tracking-widest">Attendance</p>
                          <p className="text-base font-black text-[#06361f]">{m.attendance}%</p>
                        </div>
                        <div className="bg-[#f8faf9] rounded-xl p-3 text-center">
                          <p className="text-[9px] font-black text-[#548064] uppercase tracking-widest">Tasks</p>
                          <p className="text-base font-black text-[#06361f]">{m.tasks}</p>
                        </div>
                        <div className="bg-[#f8faf9] rounded-xl p-3 text-center flex flex-col justify-center">
                          <p className="text-[9px] font-black text-[#548064] uppercase tracking-widest">Shift</p>
                          <span className={`text-[10px] font-black rounded-lg py-0.5 px-1 mt-1 block ${shiftColors[m.shift] || shiftColors.Morning}`}>
                            {m.shift}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-zinc-100 pt-4 mt-auto">
                      <button 
                        onClick={() => openEditModal(m)}
                        className="flex-1 py-2.5 bg-primary/10 text-primary text-xs font-black rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span> Edit
                      </button>
                      <button 
                        onClick={() => handleRemoveMember(m.projectId, m.id)}
                        className="flex-1 py-2.5 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">person_remove</span> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Roster Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden border border-zinc-100 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#06361f] tracking-tight">Assign Worker</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              {/* Select Worker */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Select Worker</label>
                <select
                  value={newMember.workerId}
                  onChange={e => {
                    const selected = availableWorkers.find(w => String(w.id) === e.target.value);
                    setNewMember(prev => ({
                      ...prev,
                      workerId: e.target.value,
                      roleOnSite: selected ? selected.trade : ''
                    }));
                  }}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold"
                  required
                >
                  <option value="">-- Choose Roster Worker --</option>
                  {availableWorkers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.trade}) - {w.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Project */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Project / Site Location</label>
                <select
                  value={newMember.projectId}
                  onChange={e => setNewMember(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Enter Role On Site */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Role On Site</label>
                <input
                  type="text"
                  placeholder="e.g. Master Mason, Electrician"
                  value={newMember.roleOnSite}
                  onChange={e => setNewMember(prev => ({ ...prev, roleOnSite: e.target.value }))}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold"
                  required
                />
              </div>

              {/* Shift */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Shift Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Morning', 'Evening', 'Night'].map(shiftOption => (
                    <button
                      key={shiftOption}
                      type="button"
                      onClick={() => setNewMember(prev => ({ ...prev, shift: shiftOption }))}
                      className={`py-2 px-3 text-xs font-black rounded-lg border uppercase tracking-wider transition-all ${
                        newMember.shift === shiftOption 
                          ? 'premium-gradient text-white border-transparent' 
                          : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {shiftOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full premium-gradient text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Assign Roster
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Roster Member Modal */}
      {isEditModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden border border-zinc-100 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#06361f] tracking-tight">Edit Assignment</h3>
                <p className="text-xs text-[#548064] font-bold mt-0.5">Crew: {selectedMember.name}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleEditMember} className="space-y-4">
              {/* Role on Site */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Role On Site</label>
                <input
                  type="text"
                  value={editForm.roleOnSite}
                  onChange={e => setEditForm(prev => ({ ...prev, roleOnSite: e.target.value }))}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Roster Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Active', 'Away', 'Off Duty'].map(statusOption => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, status: statusOption }))}
                      className={`py-2 px-3 text-xs font-black rounded-lg border uppercase tracking-wider transition-all ${
                        editForm.status === statusOption 
                          ? 'premium-gradient text-white border-transparent' 
                          : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Shift Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Morning', 'Evening', 'Night'].map(shiftOption => (
                    <button
                      key={shiftOption}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, shift: shiftOption }))}
                      className={`py-2 px-3 text-xs font-black rounded-lg border uppercase tracking-wider transition-all ${
                        editForm.shift === shiftOption 
                          ? 'premium-gradient text-white border-transparent' 
                          : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {shiftOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full premium-gradient text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
