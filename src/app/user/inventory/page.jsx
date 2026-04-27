"use client";

import React, { useState } from "react";

const inventoryData = [
  {
    id: 1,
    name: "Cement (50kg Bag)",
    category: "Construction Material",
    quantity: 120,
    price: 750,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Steel Rod (10mm)",
    category: "Steel",
    quantity: 15,
    price: 850,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Bricks",
    category: "Block Material",
    quantity: 0,
    price: 12,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Sand (Truck)",
    category: "Construction Material",
    quantity: 8,
    price: 5500,
    status: "In Stock",
  },
];

const statusColor = (status) => {
  switch (status) {
    case "In Stock":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Low Stock":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Out of Stock":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventoryData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Inventory Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: inventoryData.length, color: "bg-indigo-500", icon: "category" },
          { label: "Low Stock", value: inventoryData.filter(i => i.status === "Low Stock").length, color: "bg-amber-500", icon: "warning" },
          { label: "Out of Stock", value: inventoryData.filter(i => i.status === "Out of Stock").length, color: "bg-rose-500", icon: "error" },
          { label: "Inventory Value", value: "৳ 12.4L", color: "bg-[#006a28]", icon: "payments" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-[#06361f]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search materials or categories..."
            className="w-full bg-[#f0fff4] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064]">search</span>
        </div>

        <button className="w-full md:w-auto bg-[#006a28] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-[#006a28]/20 hover:bg-[#005a22] transition-all active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
          New Requisition
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Low Stock Indicator */}
            {item.status === "Low Stock" && (
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-amber-500 rotate-45 flex items-end justify-center pb-2">
                <span className="material-symbols-outlined text-white text-lg">warning</span>
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-[#548064] uppercase tracking-[0.2em]">{item.category}</span>
                <h2 className="font-black text-xl text-[#06361f] mt-1 group-hover:text-[#006a28] transition-colors">{item.name}</h2>
              </div>
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold border ${statusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f0fff4] rounded-2xl p-4 border border-[#006a28]/5">
                <p className="text-[9px] font-black text-[#548064] uppercase tracking-widest mb-1">Quantity</p>
                <p className="text-xl font-black text-[#006a28]">{item.quantity} <span className="text-[10px] font-medium">Units</span></p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[9px] font-black text-[#548064] uppercase tracking-widest mb-1">Unit Price</p>
                <p className="text-xl font-black text-[#06361f]">৳ {item.price}</p>
              </div>
            </div>

            {/* Stock Level Bar */}
            <div className="space-y-2 mb-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#548064]">
                <span>Inventory Level</span>
                <span className={item.quantity === 0 ? "text-rose-500" : "text-[#006a28]"}>
                  {item.quantity === 0 ? "Empty" : `${Math.min(100, item.quantity)}%`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.quantity > 50
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-emerald-200"
                      : item.quantity > 0
                      ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-amber-200"
                      : "bg-rose-500 shadow-rose-200"
                  } shadow-md`}
                  style={{
                    width: item.quantity === 0 ? "5%" : `${Math.min(100, item.quantity)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-slate-200 text-[#06361f] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                Log History
              </button>
              <button className="flex-1 bg-[#006a28] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#005a22] transition-all shadow-lg shadow-[#006a28]/10 active:scale-95">
                Update Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;