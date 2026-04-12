import Image from 'next/image';

export default function ContractorDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header Section */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-[#06361f] tracking-tight">
            Contractor Dashboard
          </h2>
          <p className="text-[#548064] font-medium mt-1">
            Nirman Builders • Sector 14 Development Phase
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#a8ecbf] text-[#39644a] font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">chat</span>
            Chat Admin
          </button>
          <button className="bg-[#006a28] text-[#cfffce] font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center gap-2">
            <span className="material-symbols-outlined">add_task</span>
            Update Milestone
          </button>
        </div>
      </section>

      {/* Stats Grid (High-end Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#548064]/10 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#78f5ae] rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#005a35]">engineering</span>
            </div>
            <span className="text-xs font-bold text-[#006a28] px-2 py-1 bg-[#5cfd80]/20 rounded-full">
              +2 this week
            </span>
          </div>
          <p className="text-[#548064] text-sm font-semibold uppercase tracking-wider mb-1">
            Active Projects
          </p>
          <p className="text-3xl font-headline font-extrabold text-[#06361f]">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#548064]/10 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#00e3fe] rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#004d57]">groups</span>
            </div>
          </div>
          <p className="text-[#548064] text-sm font-semibold uppercase tracking-wider mb-1">
            Total Workers
          </p>
          <p className="text-3xl font-headline font-extrabold text-[#06361f]">148</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#548064]/10 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#f95630]/20 rounded-lg group-hover:scale-110 transition-transform text-[#b02500]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
            </div>
          </div>
          <p className="text-[#548064] text-sm font-semibold uppercase tracking-wider mb-1">
            Pending Tasks
          </p>
          <p className="text-3xl font-headline font-extrabold text-[#06361f]">24</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#548064]/10 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#5cfd80] rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#006a28]">verified</span>
            </div>
          </div>
          <p className="text-[#548064] text-sm font-semibold uppercase tracking-wider mb-1">
            Completed
          </p>
          <p className="text-3xl font-headline font-extrabold text-[#06361f]">82%</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Left: Projects & Assignments */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#c7fdd8] p-1 rounded-3xl">
            <div className="p-6">
              <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a28]">analytics</span>
                Recent Assignments
              </h3>
              <div className="space-y-4">
                {/* Project Card 1 */}
                <div className="bg-white p-5 rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">Emerald Heights - Wing B</h4>
                      <p className="text-sm text-[#548064]">Structural Framework & Concreting</p>
                    </div>
                    <span className="bg-[#78f5ae] text-[#005a35] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                      On Schedule
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-[#548064] mb-1.5">
                        <span>Overall Progress</span>
                        <span className="text-[#006a28]">68%</span>
                      </div>
                      <div className="h-2 w-full bg-[#b2f1c7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#006a28] rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      <img
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                        alt="worker"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqTPqH0nSLnPNzIZeB457Q5ivhDTkHVDwBLiWk4vJrSsmHP57tB4bz12fQQCf_Q4Hc1yl9UzNN5pooejHhVfZsbySWYA6wyXzn_IkVptnJ1eUgj6rm15iYtIKU8VfFgp_x_4oocEfWaYIJJVpAKRV5-0CIkOVxBSoGxpfyqLssuhroP9SK0_5BesAQIbfYPz1zt13okvNPUngE6qowtx6ufS4DYZqbdouIgoia0chhVHF9yAAiCIbsmGk8umHHIj4SE36IjcLTZ24"
                      />
                      <img
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                        alt="worker"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUn-7YGZGz8JXuIEmy42YLIBUCPe_JsNknWWlhf6oO8LYZUumxSmEi8omSd47FWZZQtiPYI0CLMzb6x5RQ97s7CDcARlSCWgML-JO5TSRBMHQplKl03dtnL2S2mRe7TFxzDiZjG-7j5gwbjRhI_y99HWeHdAi_IeBRy0F-XpoLCo8oW_2mzVEICDsfNpHAmsrIQwg0e6KQ8Y5vub6orSGYcAYdW3lmWOhN50kpU8tIKT4fT9ul9auNjpaE9vJkMaTElJ-GRNb7h-g"
                      />
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-[#a8ecbf] flex items-center justify-center text-[10px] font-bold">
                        +12
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Card 2 */}
                <div className="bg-white p-5 rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">Central Plaza Flooring</h4>
                      <p className="text-sm text-[#548064]">Marble installation & finishing</p>
                    </div>
                    <span className="bg-[#a8ecbf] text-[#39644a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                      Action Needed
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-[#548064] mb-1.5">
                        <span>Overall Progress</span>
                        <span className="text-[#006a28]">15%</span>
                      </div>
                      <div className="h-2 w-full bg-[#b2f1c7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#006a28] rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      <img
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                        alt="manager"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKZVK8DZuq173DsNidAB0e9D30R_fkkrPVP-WOrL-wosh05wTPTn91d9OTohBwQpvVqRZjxuuEprtb5M2V1jGt_pDEo8fY33aHT3mh1snDCw-9s4MzY3OvTfbWul51uzCI1jhYVcklUgqXP3Iifo1pNqgrGvW3rmcfBYfhmqdtYpEel45VLhsPmf5gU5O-0Sa-9i8k2SI68KWfT4Aeh6G0YDudoO-uuzVaINAdpJC1ajj-U7bvx7t4FbCtB0b--eO9eX3zhmdYGCo"
                      />
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-[#a8ecbf] flex items-center justify-center text-[10px] font-bold">
                        +5
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Work Log Section */}
          <section className="bg-[#c7fdd8] p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#006a28]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a28]">history_edu</span>
              Daily Work Log
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#39644a] uppercase tracking-widest mb-2 ml-1">
                    Today's Task progress
                  </label>
                  <textarea
                    className="w-full bg-white border-none outline-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#006a28] shadow-sm placeholder-[#548064]/50"
                    placeholder="Describe today's achievements and roadblocks..."
                    rows={3}
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#39644a] uppercase tracking-widest mb-2 ml-1">
                      Labor count
                    </label>
                    <input
                      className="w-full bg-white border-none outline-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#006a28] shadow-sm"
                      placeholder="124"
                      type="number"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#39644a] uppercase tracking-widest mb-2 ml-1">
                      Weather
                    </label>
                    <select className="w-full bg-white border-none outline-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#006a28] shadow-sm text-[#06361f]">
                      <option>Sunny - 32°C</option>
                      <option>Cloudy</option>
                      <option>Rainy (Reduced activity)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-inner border border-[#548064]/5 flex flex-col">
                <h4 className="text-sm font-bold mb-4 flex items-center justify-between">
                  Material Usage
                  <button className="text-[#006a28] text-xs font-bold hover:underline">
                    + Add Material
                  </button>
                </h4>
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-center p-3 bg-[#dcffe5]/50 rounded-lg">
                    <span className="text-sm font-medium">OPC Cement (Grade 43)</span>
                    <span className="text-sm font-bold text-[#006a28]">420 Bags</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#dcffe5]/50 rounded-lg">
                    <span className="text-sm font-medium">TMT Reinforcement Bars</span>
                    <span className="text-sm font-bold text-[#006a28]">2.4 Tons</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-[#006a28] text-[#cfffce] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-sm">send</span>
                  Submit Daily Log
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Crew Management & Quick Actions mb-8 */}
        <div className="space-y-8">
          {/* Crew Management */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#548064]/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-headline font-bold">Crew Management</h3>
              <button className="w-8 h-8 rounded-full bg-[#5cfd80] text-[#006a28] flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">person_add</span>
              </button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Arjun Sharma"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARHwfHSDWqACybcy84fweFft4J1DPGFj9f-TmFFAfejfb3Jzt7LNBEp1I7C0ihkvRHbczmRRI2w0D435eLnfEKS-Y8GIMjaRuuERNWJSJiNlBqJ06rDeVCJZ7-HjztUKweqGpUZNKFCeB7PHbRIk0Vxf7ZO2dnA-hOkFCGt0owA0J4sIem43c3xMm5Y9nGWG8j28TIVJdvGMvsb1Ronee6y9SUGOFrBwuZqz78lwvUAzfJfkSLpLcwMrGj96rwv8GxQ1H5d3JILZc"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00693f] border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">Arjun Sharma</h4>
                  <p className="text-xs text-[#548064] font-medium">
                    Master Mason • <span className="text-[#00693f] font-bold">Active</span>
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 bg-[#dcffe5] text-[#006a28] rounded-lg transition-all border border-[#006a28]/20">
                  <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                </button>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Meera Kapur"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkP4GoeKkEB-MHFdaLydpOrlIbO97rJd9OEEcNJcXMt9ag0olz8cpj91kUhOEkdewZDgg_NEnCZw_MAl5owRBHTLaKnVsJX3PG5eQAt-6mpwj_Aag3Erpsmzeja6s3bLbdxMqEtJLwNPZ2Sstxn5NW-44ul_Hh5_oBy5qmttrGl5HSuMEgDxxLhoDuCR1svBVSkPZ2GR-zE-N4UXHleBV1rPBEwCHZ8KSWd1mTou6cbzJs1fBI4wExkN2kwHFIc4Jl-_Rxto9BOT8"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00693f] border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">Meera Kapur</h4>
                  <p className="text-xs text-[#548064] font-medium">
                    Safety Officer • <span className="text-[#00693f] font-bold">Active</span>
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 bg-[#dcffe5] text-[#006a28] rounded-lg transition-all border border-[#006a28]/20">
                  <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                </button>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Siddharth V."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYNrlp3ER9xzypaAakOmuq3GM0zcuEWjrRI5X1PhCKHB1ghtsTrOtliR6_AEFMucOqtuyIaPtJMvtuZOSjjCd4pwc84IPDTRtdtXpiE2g-49zzZkV8Cp0_kWAf8WOhyfEJL2i6DV_vS3oHARIRpY7FVVDEp2KplTIKIyyx1hopBXgY6JPFSzzz1ThkRdszx8QiYaATPFwmi7dWfxpAACHeb62XwqoF-XxI520oN_W6UMZOVwjHnOu7g8IR0FyKvVkZCvM6ebukEjo"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#89b898] border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">Siddharth V.</h4>
                  <p className="text-xs text-[#548064] font-medium">
                    Steel Fixer • <span className="text-[#89b898] font-bold">Idle</span>
                  </p>
                </div>
                <button className="opacity-100 p-2 bg-[#006a28] text-[#cfffce] rounded-lg transition-all shadow-sm">
                  <span className="material-symbols-outlined text-base">add_task</span>
                </button>
              </div>
            </div>
            <button className="w-full mt-8 py-3 border border-[#548064]/20 rounded-xl font-bold text-sm hover:bg-[#c7fdd8] transition-colors">
              View All Crew (148)
            </button>
          </section>

          {/* Quick Actions */}
          <div className="bg-[#006a28]/5 p-6 rounded-3xl border border-[#006a28]/10">
            <h3 className="text-lg font-headline font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/40 transition-all gap-2 group">
                <span className="material-symbols-outlined text-[#006a28] group-hover:scale-110 transition-transform">receipt_long</span>
                <span className="text-xs font-bold text-center">New Bill</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/40 transition-all gap-2 group">
                <span className="material-symbols-outlined text-[#006a28] group-hover:scale-110 transition-transform">engineering</span>
                <span className="text-xs font-bold text-center">Equipment</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/40 transition-all gap-2 group">
                <span className="material-symbols-outlined text-[#006a28] group-hover:scale-110 transition-transform">priority_high</span>
                <span className="text-xs font-bold text-center">Issue Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#548064]/5 hover:border-[#006a28]/40 transition-all gap-2 group">
                <span className="material-symbols-outlined text-[#006a28] group-hover:scale-110 transition-transform">calendar_month</span>
                <span className="text-xs font-bold text-center">Leave Req.</span>
              </button>
            </div>
          </div>

          {/* Location Insight */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#548064]/10 h-48 relative overflow-hidden group">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:opacity-30 transition-opacity"
              alt="map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1QuBZ1dNrwttRqhu5ZIGCHTSF7P3abIKpCBf53291sMHoP0FPxQ8IoSJXZRR9GFVvMDz3SRDXcvSmBwC4OeC5NY3FoONvb2TuBSFPsnsX-wQR_W-0AKducAledLNaLI5Fp6-y3BcmP_jzw7CXgoPFYdz6RlHeeSS0kXLBusj8mbd_T3kVP_gjbA93KJsbNItcXGHWExXJF5IoNoF__85WYPB8rEhgwZsCxSVv3i0LEtkrdfQjYYS2ZQUeH-j-m5Sj_W6Sk9OQb9Q"
            />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <h4 className="font-headline font-bold text-sm">Site Map: Sector 14</h4>
              <div className="flex items-center gap-2 bg-[#dcffe5]/80 backdrop-blur-sm self-start px-3 py-1.5 rounded-full border border-[#006a28]/20 mt-2">
                <span className="w-2 h-2 bg-[#006a28] rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#06361f]">LIVE FEED ACTIVE</span>
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs font-medium text-[#548064]">Gugrugram, Haryana</p>
                <span className="material-symbols-outlined text-[#006a28]">map</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
