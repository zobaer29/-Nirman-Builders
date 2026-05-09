"use client";
import React, { useState, useEffect } from "react";

const Contractor = () => {
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContractors = async () => {
            try {
                const response = await fetch('/api/admin/contractors');
                if (response.ok) {
                    const data = await response.json();
                    setContractors(data.contractors);
                }
            } catch (error) {
                console.error("Error fetching contractors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContractors();
    }, []);

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


            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Contractors" value={contractors.length} />
                <StatCard title="Active" value={contractors.length} /> {/* Simplified for now */}
                <StatCard title="On Leave" value="0" />
                <StatCard title="Pending" value="0" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f8fafc] border-b border-surface-container-high text-zinc-500">
                            <tr>
                                <th className="p-5 font-semibold">Name</th>
                                <th className="p-5 font-semibold">Expertise</th>
                                <th className="p-5 font-semibold">Experience</th>
                                <th className="p-5 font-semibold">Contact</th>
                                <th className="p-5 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-surface-container-high">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-zinc-500">Loading contractors...</td>
                                </tr>
                            ) : contractors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-zinc-500">No contractors found.</td>
                                </tr>
                            ) : (
                                contractors.map((c) => (
                                    <TableRow
                                        key={c.id}
                                        name={c.full_name || c.username}
                                        expertise={c.specialization || "General"}
                                        experience={c.experience ? `${c.experience} Years` : "-"}
                                        contact={c.phone || c.email}
                                        status="Active"
                                    />
                                ))
                            )}
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

const TableRow = ({ name, expertise, experience, contact, status }) => (
    <tr className="hover:bg-zinc-50/50 transition-colors">
        <td className="p-5 font-medium text-zinc-800">{name}</td>
        <td className="p-5 text-zinc-600">{expertise}</td>
        <td className="p-5 text-zinc-600">{experience}</td>
        <td className="p-5 text-zinc-600">{contact}</td>
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