"use client";

import React, { useState } from "react";

const commonMaterials = [
  { id: 1, name: "Cement Bags", unit: "50kg Bag", icon: "category" },
  { id: 2, name: "TMT Steel Rods", unit: "10mm", icon: "architecture" },
  { id: 3, name: "Safety Helmets", unit: "Pcs", icon: "engineering" },
  { id: 4, name: "Drill Bits", unit: "Set", icon: "construction" },
];

const MaterialRequest = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Material Requisition</h1>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">Request tools or materials from the site office</p>
        </div>
        <div className="bg-[#006a28] text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-[#006a28]/20">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-xs font-black uppercase tracking-[0.2em]">View History</span>
        </div>
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
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Quantity Needed</label>
                <input type="number" placeholder="Enter amount..." className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Urgency Level</label>
                <select className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none appearance-none cursor-pointer">
                  <option>Normal (End of Day)</option>
                  <option>Urgent (Within 1 Hour)</option>
                  <option>Emergency (Immediate)</option>
                </select>
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest px-2">Reason for Request</label>
                <textarea placeholder="Explain briefly why you need this..." className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/10 outline-none min-h-[120px]"></textarea>
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
                  <p className="font-bold">Emerald Heights B</p>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Requester</p>
                  <p className="font-bold">Arjun Kumar</p>
                </div>
              </div>

              <button className="w-full mt-10 py-5 bg-[#4bee74] text-[#06361f] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#4bee74]/10 hover:bg-[#3ddb66] transition-all active:scale-95">
                Send Requisition
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
    </div>
  );
};

export default MaterialRequest;
