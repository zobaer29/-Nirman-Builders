"use client";

import React, { useState, useEffect } from "react";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worker/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Failed to fetch worker tasks", err);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/worker/materials");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch worker orders", err);
    }
  };

  const handleReceiveOrder = async (requestId) => {
    try {
      const res = await fetch("/api/worker/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: "Received" }),
      });
      if (res.ok) {
        loadOrders();
        fetchTasks();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update order status");
      }
    } catch (err) {
      console.error("Error receiving order", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
      loadOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStatus = async (task, resultValue = null) => {
    let nextStatus = "";
    if (resultValue) {
      nextStatus = "Completed";
    } else if (task.status === "Pending") {
      nextStatus = "In Progress";
    } else if (task.status === "In Progress") {
      nextStatus = "Completed";
    } else {
      return; // Already completed
    }

    try {
      const res = await fetch(`/api/worker/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, result: resultValue }),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status", err);
    }
  };

  const columns = ["Pending", "In Progress", "Completed"];

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Field Task Board</h1>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">Manage your daily construction activities</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-2 rounded-2xl flex gap-1 shadow-sm border border-slate-100">
            <button className="px-6 py-2 bg-[#006a28] text-white rounded-xl text-xs font-black uppercase tracking-widest">My View</button>
            <button className="px-6 py-2 text-[#548064] hover:bg-[#f0fff4] rounded-xl text-xs font-black uppercase tracking-widest transition-all">Team View</button>
          </div>
          <button 
            type="button"
            onClick={() => {
              loadOrders();
              setShowOrdersModal(true);
            }}
            className="bg-[#006a28] hover:bg-[#005a22] text-white px-6 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#006a28]/20 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer border-none outline-none"
          >
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            View All Orders
          </button>
          <button className="bg-[#006a28] text-white p-4 rounded-2xl shadow-lg shadow-[#006a28]/20 active:scale-90 transition-transform">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {columns.map((column) => (
          <div key={column} className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  column === "Pending" ? "bg-amber-400" : column === "In Progress" ? "bg-[#006a28]" : "bg-slate-300"
                }`}></div>
                <h3 className="text-lg font-black text-[#06361f] tracking-tight">{column}</h3>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-[#548064] border border-slate-100 shadow-sm">
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>

            <div className="space-y-6 min-h-[500px] bg-[#f8faf9] p-6 rounded-[2.5rem] border border-slate-100/50">
              {tasks.filter(t => t.status === column).map((task) => (
                <div key={task.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  
                  {task.priority === "High" && column !== "Completed" && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full m-6 animate-ping"></div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-[#548064] uppercase tracking-widest">{task.site}</span>
                    <span className="text-[10px] font-bold text-[#006a28] bg-[#f0fff4] px-2 py-0.5 rounded-full">{task.time}</span>
                  </div>
                  
                  <h4 className="font-black text-lg text-[#06361f] tracking-tight mb-4 group-hover:text-[#006a28] transition-colors leading-tight">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                      ))}
                    </div>
                    {task.status !== 'Completed' && (
                      (task.title.startsWith('Verify Order:') || task.title.startsWith('Receive:')) ? (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleUpdateStatus(task, 'Accepted')}
                            className="text-[#006a28] text-xs font-black uppercase tracking-widest hover:underline"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(task, 'Rejected')}
                            className="text-rose-600 text-xs font-black uppercase tracking-widest hover:underline"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(task)}
                          className="text-[#006a28] text-xs font-black uppercase tracking-widest hover:underline"
                        >
                          Update
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
              
              <button className="w-full py-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-[#548064] hover:border-[#006a28] hover:text-[#006a28] hover:bg-white transition-all flex flex-col items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-500">add_circle</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Quick Log</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowOrdersModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors border-none bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <h2 className="text-3xl font-black text-[#06361f] mb-6">Requisition History / Orders</h2>

            {orders.length === 0 ? (
              <p className="text-slate-500 py-10 text-center font-bold">No orders or requisitions found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((req) => (
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
                        onClick={() => handleReceiveOrder(req.id)}
                        className="bg-[#006a28] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-[#005a22] transition-all border-none cursor-pointer"
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

export default TaskBoard;
