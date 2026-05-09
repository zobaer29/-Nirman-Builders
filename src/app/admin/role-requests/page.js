"use client";
import React, { useState, useEffect } from "react";

export default function AdminRoleRequests() {
  const [roleRequests, setRoleRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const fetchRoleRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRoleRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch role requests", error);
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/requests/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        // Remove processed request from state
        setRoleRequests(prev => prev.filter(req => req.id !== id));
      } else {
        alert("Failed to process request");
      }
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Recruitment
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Contractor <span className="text-primary">Applications</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Review and approve users applying to become Contractors.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchRoleRequests}
            className="glass px-6 py-3 rounded-2xl font-black text-[#06361f] flex items-center gap-2 hover:bg-white transition-all shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 border border-gray-100 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : roleRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-3xl">inbox</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No pending applications</h3>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Experience & NID
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Trade License
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {roleRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-surface-container-lowest transition-colors border-b border-gray-50 last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-bold text-on-surface">{req.full_name}</p>
                      <p className="text-xs text-on-surface-variant">{req.phone}</p>
                      <p className="text-xs text-on-surface-variant">{req.user_email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-sm">{req.experience} Years</p>
                      <p className="text-xs text-gray-500">NID: {req.nid}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium">{req.trade_license}</p>
                      {req.documents_url && (
                        <a href={req.documents_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">link</span> View Document
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleAction(req.id, 'accept')}
                          className="px-3 py-1.5 bg-[#006a28]/10 text-[#006a28] hover:bg-[#006a28] hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'reject')}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
