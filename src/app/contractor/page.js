import Image from 'next/image';

export default function ContractorDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full overflow-x-hidden">
      
      {/* Welcome Section */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              Performance Overview
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight">
            Welcome back, <span className="text-primary">Rajesh</span>
          </h2>
          <p className="text-[#548064] font-bold mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            Nirman Builders • Sector 14 Development Phase
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none glass px-8 py-4 rounded-3xl font-black text-[#06361f] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-xl">file_download</span>
            Report
          </button>
          <button className="flex-1 lg:flex-none premium-gradient text-white px-8 py-4 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
            Quick Insights
          </button>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Projects Card */}
        <div className="glass p-8 rounded-[40px] premium-shadow group hover:bg-white transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">engineering</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full">
                +18% Growth
              </span>
            </div>
          </div>
          <p className="text-[#548064] text-xs font-black uppercase tracking-widest mb-1">
            Active Projects
          </p>
          <h3 className="text-4xl font-black text-[#06361f]">12</h3>
          <div className="mt-4 flex -space-x-2">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#f0f4f2] overflow-hidden">
                 <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="team" className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white glass flex items-center justify-center text-[10px] font-black">
               +8
             </div>
          </div>
        </div>

        {/* Total Workforce Card */}
        <div className="glass p-8 rounded-[40px] premium-shadow group hover:bg-white transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
          </div>
          <p className="text-[#548064] text-xs font-black uppercase tracking-widest mb-1">
            Total Workforce
          </p>
          <h3 className="text-4xl font-black text-[#06361f]">148</h3>
          <p className="mt-2 text-[10px] font-bold text-[#548064]">Across 4 active sites</p>
        </div>

        {/* Efficiency Card */}
        <div className="glass p-8 rounded-[40px] premium-shadow group hover:bg-white transition-all duration-500 md:col-span-2">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-secondary px-3 py-1 bg-secondary/10 rounded-full">On Time</span>
              <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full">High Quality</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[#548064] text-xs font-black uppercase tracking-widest mb-1">
                Workflow Efficiency
              </p>
              <h3 className="text-5xl font-black text-[#06361f]">94.2%</h3>
            </div>
            <div className="flex-1 max-w-xs space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-[#548064]">
                <span>Weekly Target</span>
                <span>85%</span>
              </div>
              <div className="h-3 w-full bg-[#f0f4f2] rounded-full overflow-hidden">
                <div className="h-full premium-gradient rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Project Tracking Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[50px] premium-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-[#548064] hover:text-primary transition-colors">
                <span className="material-symbols-outlined">open_in_full</span>
              </button>
            </div>
            <h3 className="text-2xl font-black text-[#06361f] mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Live Assignment Tracking
            </h3>

            <div className="space-y-6">
              {/* Project Card 1 */}
              <div className="bg-white/60 p-6 rounded-[32px] border border-white/80 hover:border-primary/20 transition-all group cursor-pointer">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-black text-[#06361f]">Emerald Heights - Wing B</h4>
                    <p className="text-sm font-bold text-[#548064]">Structural Framework & Concreting</p>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl self-start">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">In Progress</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Progress</p>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-sm font-black text-primary">68%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Labor Force</p>
                    <p className="text-sm font-black text-[#06361f]">42 Personnel</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Next Milestone</p>
                    <p className="text-sm font-black text-secondary">Slab Casting (Apr 28)</p>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-white/60 p-6 rounded-[32px] border border-white/80 hover:border-primary/20 transition-all group cursor-pointer">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-black text-[#06361f]">Central Plaza Flooring</h4>
                    <p className="text-sm font-bold text-[#548064]">Marble installation & finishing</p>
                  </div>
                  <div className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-2xl self-start">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Delayed</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Progress</p>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-error/10 rounded-full overflow-hidden">
                        <div className="h-full bg-error rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm font-black text-error">15%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Labor Force</p>
                    <p className="text-sm font-black text-[#06361f]">18 Personnel</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Critical Issue</p>
                    <p className="text-sm font-black text-error">Material Shortage</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-10 py-5 border-2 border-dashed border-primary/20 rounded-[32px] font-black text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group">
               <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
               View All Ongoing Projects
            </button>
          </div>
        </div>

        {/* Side Panel: Actions & Crew */}
        <div className="space-y-8">
          {/* Quick Log Action */}
          <div className="premium-gradient p-10 rounded-[50px] shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-2xl font-black text-white mb-4 relative z-10">Daily Work Log</h3>
            <p className="text-white/80 font-bold text-sm mb-8 relative z-10 leading-relaxed">
              Submit your daily progress report and material consumption to the central hub.
            </p>
            <button className="w-full bg-white text-primary py-5 rounded-[24px] font-black shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3">
               <span className="material-symbols-outlined text-xl">history_edu</span>
               Submit Now
            </button>
          </div>

          {/* Top Crew Members */}
          <div className="glass p-10 rounded-[50px] premium-shadow">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-[#06361f]">Top Personnel</h3>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Status</span>
             </div>
             <div className="space-y-6">
                {[
                  { name: "Arjun Sharma", role: "Master Mason", img: "11", status: "Active" },
                  { name: "Meera Kapur", role: "Safety Officer", img: "32", status: "Active" },
                  { name: "Siddharth V.", role: "Steel Fixer", img: "44", status: "Away" }
                ].map((crew, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${crew.img}`} 
                        alt={crew.name} 
                        className="w-14 h-14 rounded-2xl object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${crew.status === 'Active' ? 'bg-primary' : 'bg-secondary'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#06361f]">{crew.name}</h4>
                      <p className="text-[10px] font-bold text-[#548064] uppercase tracking-widest">{crew.role}</p>
                    </div>
                    <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#548064] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-4 text-[#548064] font-black text-xs hover:text-primary transition-colors">
               Manage Entire Crew (148)
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}