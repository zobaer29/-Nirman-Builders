import Image from 'next/image';

export default function WorkerDashboard() {
  return (
    <main className="p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
      {/* Welcome Header */}
      <section className="mb-10">
        <h1 className="font-headline text-4xl font-extrabold text-[#06361f] tracking-tight mb-2">
          Worker Dashboard
        </h1>
        <p className="text-[#39644a] font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006a28]">location_on</span>
          Current Site: Emerald Heights Tower B, Floor 14
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Daily Tasks List (Col 1-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl text-[#06361f]">
              Daily Tasks List
            </h3>
            <div className="flex gap-2">
              <span className="bg-[#a8ecbf] px-3 py-1 rounded-full text-xs font-bold text-[#39644a]">
                Today: Oct 24
              </span>
            </div>
          </div>

          {/* Task Cards */}
          <div className="space-y-4">
            {/* Task 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#89b898]/10 group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[#4bee74] text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#006a28]">High Priority</span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-[#06361f]">
                    Install HVAC Ducts in Corridor A
                  </h4>
                  <p className="text-[#39644a] text-sm mt-1">
                    Ensure compliance with the architectural blueprints for central cooling units.
                  </p>
                </div>
                <span className="bg-[#78f5ae] text-[#005a35] px-3 py-1 rounded-full text-xs font-bold">
                  In Progress
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#89b898]/10">
                <div className="flex -space-x-2">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt="Worker"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB99KPanY3GMsTLeILf7WR9-7j0lDCWMXjbAbe-jJtPUl6-w9HomuhZRXWYZ04-uW4VnIrfdwjul8QtxWfsmn00bQ3tUfXhU-MTb5g9Muy2MdlcE3Fq0SX_E2vbMxcDZsG-IrUMCo29xW7fczfOwlKewoOjyYNbkLgJbRhLLGxK-Ve34RR9mD3lXiP30CMXKpgUT-XZLJT7GmmQrkipnH7NPlz1-vbZEXoDtcxMMdQ0GCXWMlyofOGMpTHQ2rYv9HgF_pyGLZZokbs"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt="Contractor"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2PCWqGrMRO7XAxr7nyuiEylH6wDKQIWLGI6Hcvi3qB0ntFo_EcvSkailgyZPV3N55kpi_fE-k-Hw_me_e2_pSnpMjXQPM7P_gkekgoFMMOQiidhohb1SgPVQz2A_f-pH7ICW95Tl_ZvZAW5SXLsfMmA34Wz0-snyZzEXm_ey99r3VVpu6cFtB5r2ohrOPh9ot4JZR-44jY6zynli2pgm8QAbVA-ge2_Fab63dxyLKk-Jw0SL_UVj5G4sz6ITO-NJwRebLM6O8xEc"
                  />
                  <div className="w-8 h-8 rounded-full bg-[#b2f1c7] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#06361f]">
                    +2
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-xs font-bold border border-[#89b898]/20 hover:bg-[#bbf6ce] transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-[#006a28] text-[#cfffce] rounded-lg text-xs font-bold active:scale-95 transition-transform">
                    Complete Task
                  </button>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#89b898]/10 group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-headline font-bold text-lg text-[#06361f] opacity-50 line-through">
                    Reinforce North-West Foundation Pillar
                  </h4>
                  <p className="text-[#39644a] text-sm mt-1">
                    Wait for inspector approval before proceeding to next section.
                  </p>
                </div>
                <span className="bg-[#a8ecbf] text-[#39644a] px-3 py-1 rounded-full text-xs font-bold">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#89b898]/10">
                <span className="text-xs text-[#39644a] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Finished at 10:45 AM
                </span>
                <button className="text-[#006a28] text-xs font-bold hover:underline">
                  Reopen Task
                </button>
              </div>
            </div>

            {/* Task 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#89b898]/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-headline font-bold text-lg text-[#06361f]">
                    Material Inspection: Cement Batch 204
                  </h4>
                  <p className="text-[#39644a] text-sm mt-1">
                    Cross-verify density and moisture levels for the base layer.
                  </p>
                </div>
                <span className="bg-[#b2f1c7] text-[#39644a] px-3 py-1 rounded-full text-xs font-bold">
                  Pending
                </span>
              </div>
              <div className="flex gap-2 pt-4 border-t border-[#89b898]/10">
                <button className="flex-1 py-2 bg-[#00693f] text-[#cbffda] rounded-lg text-xs font-bold transition-all hover:opacity-90">
                  Start Progress
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Location (Col 9-12) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Work Schedule Widget */}
          <div className="bg-[#c7fdd8] p-6 rounded-xl border border-[#89b898]/10">
            <h3 className="font-headline font-bold text-lg text-[#06361f] mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-[#006a28] rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-[#006a28]">08:00 AM - 12:00 PM</p>
                  <p className="text-sm font-bold text-[#06361f]">Floor 14 Ducting</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-2 h-12 bg-[#89b898] rounded-full"></div>
                <div>
                  <p className="text-xs font-bold">12:00 PM - 01:00 PM</p>
                  <p className="text-sm font-bold">Lunch Break</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-[#00693f] rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-[#00693f]">01:00 PM - 05:00 PM</p>
                  <p className="text-sm font-bold text-[#06361f]">Safety Drill & Review</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-[#a8ecbf]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#39644a]">Site Location</span>
                <button className="text-[#006a28] text-[10px] font-bold underline">
                  Directions
                </button>
              </div>
              <div className="h-32 rounded-lg bg-[#9ce4b6] overflow-hidden relative border border-[#548064]/20">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[#006a28] text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                    location_on
                  </span>
                </div>
                {/* Mock map background */}
                <div className="w-full h-full bg-gradient-to-tr from-[#b2f1c7] to-[#9ce4b6]"></div>
              </div>
              <p className="mt-2 text-xs font-medium text-[#39644a] text-center">
                Plot 42, Sector 8, Emerald Heights
              </p>
            </div>
          </div>

          {/* Work Log Submission Area */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#89b898]/10">
            <h3 className="font-headline font-bold text-lg text-[#06361f] mb-4">
              Submit Work Log
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#39644a] mb-2">Task Details</label>
                <select className="w-full bg-[#c7fdd8] border-none outline-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-[#006a28]">
                  <option>Select Completed Task</option>
                  <option>HVAC Installation</option>
                  <option>Foundation Reinforcement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#39644a] mb-2">Add Photo (Optional)</label>
                <div className="border-2 border-dashed border-[#89b898]/30 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#006a28]/50 transition-colors">
                  <span className="material-symbols-outlined text-[#89b898] mb-1">photo_camera</span>
                  <span className="text-[10px] font-bold text-[#89b898]">TAP TO UPLOAD</span>
                </div>
              </div>
              <button
                className="w-full py-3 bg-[#06361f] text-white rounded-lg font-headline font-bold text-sm tracking-wide transition-all hover:bg-black active:scale-95"
                type="button"
              >
                Submit Log
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
