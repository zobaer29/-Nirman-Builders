import React from "react";

const Contractor = () => {
    return (
        <div className="p-2 sm:p-6 lg:p-4">
            {/* Page Title */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-on-surface">Contractor Management</h1>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">
                        Manage and monitor contractors
                    </p>
                </div>

                <button className="bg-[#006a28] hover:bg-[#005d22] transition-colors text-white px-5 py-2.5 rounded-full font-medium shadow-sm text-sm">
                    Add Contractor
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Contractors" value="124" />
                <StatCard title="Active" value="86" />
                <StatCard title="On Leave" value="14" />
                <StatCard title="Pending" value="24" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f8fafc] border-b border-surface-container-high text-zinc-500">
                            <tr>
                                <th className="p-5 font-semibold">Name</th>
                                <th className="p-5 font-semibold">Expertise</th>
                                <th className="p-5 font-semibold">Rating</th>
                                <th className="p-5 font-semibold">Project</th>
                                <th className="p-5 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-surface-container-high">
                            <TableRow
                                name="Marcus Thompson"
                                expertise="HVAC"
                                rating="4.9"
                                project="Corporate Tower"
                                status="Active"
                            />

                            <TableRow
                                name="Elena Rodriguez"
                                expertise="Structural"
                                rating="4.8"
                                project="Bridge Phase II"
                                status="Active"
                            />

                            <TableRow
                                name="David Chen"
                                expertise="Electrical"
                                rating="4.7"
                                project="-"
                                status="Inactive"
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Contractor;

/* Reusable Components */

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-high flex flex-col gap-1 hover:shadow-md transition-shadow">
        <p className="text-zinc-500 text-sm font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-zinc-800">{value}</h2>
    </div>
);

const TableRow = ({ name, expertise, rating, project, status }) => (
    <tr className="hover:bg-zinc-50/50 transition-colors">
        <td className="p-5 font-medium text-zinc-800">{name}</td>
        <td className="p-5 text-zinc-600">{expertise}</td>
        <td className="p-5 text-zinc-600 flex items-center gap-1.5 h-full">
            <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            {rating}
        </td>
        <td className="p-5 text-zinc-600">{project}</td>
        <td className="p-5">
            <span
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${status === "Active"
                        ? "bg-[#5cfd80]/20 text-[#006a28]"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
            >
                {status}
            </span>
        </td>
    </tr>
);