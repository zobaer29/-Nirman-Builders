'use client';
import { useState, useEffect } from 'react';

export default function ContractorRequests() {
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
            Worker <span className="text-primary">Applications</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Review and approve workers applying to join the platform.</p>
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
      <div className="glass rounded-[36px] premium-shadow p-8 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : roleRequests.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow">
              <span className="material-symbols-outlined text-[#548064] text-4xl">engineering</span>
            </div>
            <h3 className="text-2xl font-black text-[#06361f] mb-2">No pending applications</h3>
            <p className="text-[#548064] font-bold">You have reviewed all worker applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {roleRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                      {req.full_name?.charAt(0) || req.user_username?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{req.full_name || req.user_username}</h3>
                      <p className="text-xs text-gray-500 font-medium">{req.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {req.specialization || 'General Worker'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Experience:</span>
                    <span className="font-bold text-gray-900">{req.experience || 0} Years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">NID:</span>
                    <span className="font-bold text-gray-900">{req.nid || 'Not provided'}</span>
                  </div>
                  {req.documents_url && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <a 
                        href={req.documents_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-center gap-2 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 py-2 rounded-xl transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">description</span>
                        View Document
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleAction(req.id, 'reject')}
                    className="py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'accept')}
                    className="py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
