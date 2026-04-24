import React from "react";

const WorkerPage = () => {
    return (
        <div className="p-2 sm:p-6 lg:p-4">
            {/* Page Title */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-on-surface">Worker Management</h1>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">
                        Oversee field workers and site assignments
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-white border border-surface-container-high hover:bg-zinc-50 transition-colors text-zinc-700 px-5 py-2.5 rounded-full font-medium shadow-sm text-sm">
                        Export List
                    </button>
                   
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Field Workers" value="482" />
                <StatCard title="Active On Site" value="315" />
                <StatCard title="On Leave" value="42" />
                <StatCard title="Safety Issues" value="3" icon="warning" isAlert={true} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f8fafc] border-b border-surface-container-high text-zinc-500">
                            <tr>
                                <th className="p-5 font-semibold">Worker ID</th>
                                <th className="p-5 font-semibold">Name</th>
                                <th className="p-5 font-semibold">Trade / Skill</th>
                                <th className="p-5 font-semibold">Current Site</th>
                                <th className="p-5 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-surface-container-high">
                            <TableRow
                                id="W-10492"
                                name="James Patterson"
                                trade="Masonry"
                                site="Corporate Tower P-3"
                                status="On Site"
                            />

                            <TableRow
                                id="W-10501"
                                name="Michael Chang"
                                trade="Welder"
                                site="Bridge Phase II"
                                status="On Site"
                            />

                            <TableRow
                                id="W-10433"
                                name="Robert O'Neil"
                                trade="Carpenter"
                                site="-"
                                status="Off Duty"
                            />
                            
                            <TableRow
                                id="W-10319"
                                name="Samuel L. Jackson"
                                trade="Heavy Equipment"
                                site="Metro Expansion"
                                status="On Leave"
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkerPage;

/* Reusable Components */

const StatCard = ({ title, value, icon, isAlert, className }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isAlert ? 'border-red-200' : 'border-surface-container-high'} flex flex-col gap-1 hover:shadow-md transition-shadow relative overflow-hidden ${className || ''}`}>
        {isAlert && icon && (
            <div className="absolute -top-2 -right-2 p-4 opacity-10 ">
                <span className="material-symbols-outlined text-6xl text-red-600" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
            </div>
        )}
        <p className={`${isAlert ? 'text-red-500' : 'text-zinc-500'} text-sm font-medium`}>{title}</p>
        <h2 className={`text-3xl font-bold ${isAlert ? 'text-red-500' : 'text-zinc-800'}`}>{value}</h2>
    </div>
); 

const TableRow = ({ id, name, trade, site, status }) => {
    let statusStyle = "";
    if (status === "On Site") statusStyle = "bg-[#5cfd80]/20 text-[#006a28]";
    else if (status === "On Leave") statusStyle = "bg-amber-100 text-amber-700";
    else statusStyle = "bg-zinc-100 text-zinc-500";

    return (
        <tr className="hover:bg-zinc-50/50 transition-colors">
            <td className="p-5 font-mono text-xs text-zinc-400">{id}</td>
            <td className="p-5 font-medium text-zinc-800">{name}</td>
            <td className="p-5 text-zinc-600">{trade}</td>
            <td className="p-5 text-zinc-600 font-medium">{site}</td>
            <td className="p-5">
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusStyle}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
};