"use client";

import React, { useState, useEffect } from "react";

const MaterialRequest = () => {
  const [commonMaterials, setCommonMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("Normal (End of Day)");
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/worker/materials");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch worker material request history:", err);
    }
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch("/api/auth/profile");
        if (profileRes.ok && active) {
          const profileData = await profileRes.json();
          setProfile(profileData.user);
        }

        // Fetch sites
        const sitesRes = await fetch("/api/worker/projects");
        if (sitesRes.ok && active) {
          const sitesData = await sitesRes.json();
          const activeSites = sitesData.sites || [];
          setSites(activeSites);
          if (activeSites.length > 0) {
            setSelectedSiteId(activeSites[0].id.toString());
          }
        }

        // Fetch materials
        const matsRes = await fetch("/api/worker/materials?type=available_materials");
        if (matsRes.ok && active) {
          const matsData = await matsRes.json();
          const mapped = (matsData.materials || []).map((m) => {
            let icon = "category";
            if (m.name.includes("Cement")) icon = "category";
            else if (m.name.includes("Steel") || m.name.includes("Rebar")) icon = "architecture";
            else if (m.name.includes("Marble") || m.name.includes("Tiles")) icon = "grid_view";
            else if (m.name.includes("Concrete")) icon = "layers";
            else if (m.name.includes("Pipes") || m.name.includes("Conduit")) icon = "settings_input_hdmi";
            else icon = "construction";

            return {
              id: m.id,
              name: m.name,
              unit: m.unit,
              icon: icon
            };
          });
          setCommonMaterials(mapped);
        }
      } catch (err) {
        console.error("Failed to load request form data:", err);
      }
    };
    loadData();
    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      alert("Please select a material first.");
      return;
    }
    if (!quantity) {
      alert("Please specify quantity.");
      return;
    }
    if (!selectedSiteId) {
      alert("Please select a site.");
      return;
    }

    setSubmitting(true);
    const selectedMaterial = commonMaterials.find(m => m.id === selected);

    try {
      const res = await fetch("/api/worker/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedSiteId,
          materialName: selectedMaterial.name,
          quantity: quantity,
          unit: selectedMaterial.unit,
          urgency: urgency,
          reason: reason,
        }),
      });

      if (res.ok) {
        alert("Requisition submitted successfully!");
        setQuantity("");
        setReason("");
        setSelected(null);
        loadHistory();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Error submitting material request:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceiveRequest = async (requestId) => {
    try {
      const res = await fetch("/api/worker/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: "Received" }),
      });
      if (res.ok) {
        alert("Material marked as received!");
        loadHistory();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error confirming receipt:", err);
    }
  };

  const selectedMaterial = commonMaterials.find(m => m.id === selected);
  const activeSite = sites.find(s => s.id.toString() === selectedSiteId) || (sites.length > 0 ? sites[0] : null);

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Material Requisition</h1>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">Request tools or materials from the site office</p>
        </div>
        <button 
          onClick={() => setShowHistoryModal(true)}
          className="bg-[#006a28] text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-[#006a28]/20 cursor-pointer hover:scale-105 transition-all outline-none border-none font-bold"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-xs font-black uppercase tracking-[0.2em]">View History ({history.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        
        {/* Selection Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <h3 className="text-2xl font-black text-[#06361f] tracking-tight flex items-center gap-4">
            Quick Select
            <div className="h-px flex-1 bg-slate-100"></div>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {commonMaterials.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`group p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  selected === item.id 
                  ? "bg-[#006a28] border-[#006a28] text-white shadow-2xl shadow-[#006a28]/20 -translate-y-2" 
                  : "bg-white border-slate-100 hover:border-[#006a28]/30 hover:bg-[#f0fff4]"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${
                  selected === item.id ? "bg-white/20" : "bg-[#f0fff4] text-[#006a28]"
                }`}>
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                
                <h4 className="text-2xl font-black tracking-tight mb-2">{item.name}</h4>
                <p className={`text-xs font-bold uppercase tracking-widest ${selected === item.id ? "text-white/60" : "text-[#548064]"}`}>Unit: {item.unit}</p>
                
                {selected === item.id && (
                  <div className="absolute bottom-6 right-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="text-xl font-black text-[#06361f] mb-6 tracking-tight">Request Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Select Assigned Site</label>
                <select 
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none appearance-none cursor-pointer"
                >
                  {sites.length > 0 ? (
                    sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  ) : (
                    <option value="">No Active Sites Assigned</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Quantity Needed</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter amount..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none" 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Urgency Level</label>
                <select 
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none appearance-none cursor-pointer"
                >
                  <option>Normal (End of Day)</option>
                  <option>Urgent (Within 1 Hour)</option>
                  <option>Emergency (Immediate)</option>
                </select>
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Reason for Request</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain briefly why you need this..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none min-h-[120px]"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <div className="bg-[#06361f] p-10 rounded-[3rem] text-white shadow-2xl shadow-[#06361f]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
              
              <h3 className="text-2xl font-black mb-8 relative z-10">Summary</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Site</p>
                  <p className="font-bold">{activeSite ? activeSite.name : "Plot TBD"}</p>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Requester</p>
                  <p className="font-bold">{profile ? profile.username : "Arjun Kumar"}</p>
                </div>
                {selectedMaterial && (
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Material</p>
                    <p className="font-bold">{selectedMaterial.name}</p>
                  </div>
                )}
                {quantity && (
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Quantity</p>
                    <p className="font-bold">{quantity} {selectedMaterial ? selectedMaterial.unit : ""}</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-10 py-5 bg-[#4bee74] text-[#06361f] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#4bee74]/10 hover:bg-[#3ddb66] transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Requisition"}
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex gap-4">
              <span className="material-symbols-outlined text-amber-600 text-3xl">info</span>
              <div>
                <p className="text-amber-900 font-black text-sm uppercase tracking-tight">Pro-Tip</p>
                <p className="text-amber-800/80 text-xs font-bold mt-1 leading-relaxed">Request materials 24 hours in advance to avoid site delays.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <h2 className="text-3xl font-black text-[#06361f] mb-6">Requisition History</h2>

            {history.length === 0 ? (
              <p className="text-slate-500 py-10 text-center font-bold">No requisition history found.</p>
            ) : (
              <div className="space-y-4">
                {history.map((req) => (
                  <div key={req.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          req.status === 'Approved' ? 'bg-[#f0fff4] text-[#006a28]' :
                          req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                          req.status === 'Received' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[10px] font-bold text-[#548064]">
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-[#06361f]">{req.material_name}</h4>
                      <p className="text-[#548064] text-xs mt-1">
                        Quantity: <span className="font-bold text-[#06361f]">{req.quantity} {req.unit}</span> | Site: <span className="font-bold text-[#06361f]">{req.project_name}</span>
                      </p>
                      {req.reason && <p className="text-slate-500 text-xs italic mt-2">&ldquo;{req.reason}&rdquo;</p>}
                    </div>
                    {req.status === 'Approved' && (
                      <button
                        onClick={() => handleReceiveRequest(req.id)}
                        className="bg-[#006a28] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-[#005a22] transition-all"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MaterialRequest;
