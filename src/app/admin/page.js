import Image from 'next/image';

export default function AdminDashboard() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-on-surface-variant font-body mt-1">
          Monitor your company's active projects and pending requests.
        </p>
      </div>

      {/* Row 1: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined text-primary">business_center</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium font-body mb-1">
            Total Projects
          </p>
          <h3 className="text-4xl font-extrabold font-headline text-on-surface">24</h3>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container rounded-full">
              <span className="material-symbols-outlined text-on-primary-container">pending_actions</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium font-body mb-1">
            Ongoing
          </p>
          <h3 className="text-4xl font-extrabold font-headline text-on-surface">12</h3>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/20 rounded-full">
              <span className="material-symbols-outlined text-tertiary">task_alt</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium font-body mb-1">
            Completed
          </p>
          <h3 className="text-4xl font-extrabold font-headline text-on-surface">8</h3>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error-container/20 rounded-full">
              <span className="material-symbols-outlined text-error">priority_high</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium font-body mb-1">
            Pending Requests
          </p>
          <h3 className="text-4xl font-extrabold font-headline text-on-surface text-error">4</h3>
        </div>
      </div>

      {/* Row 2: Recent Requests & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-8">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 overflow-hidden border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold font-headline text-on-surface">Recent Project Requests</h4>
            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="py-3 px-4 rounded-l-lg text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Client Details
                  </th>
                  <th className="py-3 px-4 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Type & Budget
                  </th>
                  <th className="py-3 px-4 rounded-r-lg text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-label">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-body">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                      RU
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Rahim Uddin</p>
                      <p className="text-xs text-on-surface-variant">Commercial Renovation</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-on-surface">Interior Fit-out</p>
                    <p className="text-xs text-on-surface-variant">$45,000</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[11px] font-bold rounded-full uppercase">
                      Pending Review
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                      TN
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">TechNova Ltd.</p>
                      <p className="text-xs text-on-surface-variant">Office Expansion</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-on-surface">Structural Build</p>
                    <p className="text-xs text-on-surface-variant">$280,000</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[11px] font-bold rounded-full uppercase">
                      Estimating
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                      KH
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Karim Hasan</p>
                      <p className="text-xs text-on-surface-variant">Residential Villa</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-on-surface">Ground Up</p>
                    <p className="text-xs text-on-surface-variant">$1.2M</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[11px] font-bold rounded-full uppercase">
                      Pending Review
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col border border-gray-100">
          <h4 className="text-xl font-bold font-headline text-on-surface mb-8">Project Milestones</h4>
          <div className="space-y-8 flex-1">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-on-surface">Skyline Tower</p>
                <p className="text-xs font-bold text-primary">65%</p>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-gradient rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-on-surface">Green Valley Villa</p>
                <p className="text-xs font-bold text-primary">85%</p>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-gradient rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-on-surface">City Mall Renovation</p>
                <p className="text-xs font-bold text-primary">15%</p>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-gradient rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-container-low text-center">
            <p className="text-xs text-on-surface-variant italic font-body">Next review: May 24, 2026</p>
          </div>
        </div>
      </div>

      {/* Row 3: Create Project & Contractors */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-7 relative overflow-hidden rounded-xl bg-primary-gradient p-10 flex items-center group cursor-pointer shadow-xl hover:shadow-2xl transition-all active:scale-[0.99]">
          <div className="relative z-10 flex-1">
            <h3 className="text-3xl font-extrabold font-headline text-white mb-4 leading-tight">
              Ready to start a new build?
            </h3>
            <p className="text-on-primary text-sm max-w-md mb-8">
              Initiate a new project workflow, assign initial staff, and set baseline milestones in one unified interface.
            </p>
            <button className="bg-primary-container text-on-primary-container font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-lg group-hover:bg-white transition-colors text-lg font-headline">
              <span className="material-symbols-outlined font-bold">add</span>
              Create Project
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 scale-150 rotate-12">
            <span className="material-symbols-outlined text-[300px]">architecture</span>
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col border border-gray-100">
          <h4 className="text-xl font-bold font-headline text-on-surface mb-6">Available Contractors</h4>
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtj4SAd8nMylozm0Aa6vfx26BgzOgnAxW-0buFYTYtaRMRd6hn62aHtz8aNV2tvLvbw8xuzfZWlHI9nZSFTI4TI6ClRcYHOp3PNBdEbnW69acSLsfPlMsiTHdGHBLO7NTVHwli1IUw0V-R6ECdndRhJMUX8WO8G51LFld9l1Ruqp8VArQHjXtxBdvTuQw-7ZbsasXn0tbV2CASgoakauh12jem7KWsIq6QUO164ONT-RlUHjogrfv8_q0n49KMvyLmXvdeEZxP1ws"
                  alt="Contractor"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Jamal Electricals</p>
                <p className="text-[11px] text-primary font-medium">Available Now</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden grayscale">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtmzd4836IbicagH1V31RVBfhmLl3s6mGxe7DS0hJkxY4UCw3_hWWqfdHfI9tpKAE0ku6MN1MXV-y7aIyFUKqQrG85aZ1ASZJQoPnM9VmtubBt0YHs0WUBm5iLUwp2wTy-fgQSb3wRd3wUTSgb4zOTA3skfpaeiOHvAyNyKlQnqDqMzsRZBeKLM3E2ntP0_tIhsFuRwe2Qrdwg-KgIxPOxngku8Mg-0fK1T-38KFtIZSonzsnBgvO5pZ0FdP3X1Te1TRqu_KLzwx8"
                  alt="Contractor"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">M/S Haque Builders</p>
                <p className="text-[11px] text-error font-medium">Busy until June 1</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVQM8aqmXA3MAe8O3wrqpoxPbml-iP9CTNqVYwtIoQnlD1u_mt72aMmd3r5cH0YuBIbGAr0aovbMmqXSMw_2rSKAgH5PbFRobWGInUKC-vo8Hi6Tee3TE-2E8WTxvf5oSiocBkhSvlHjoPxkdjiIeSN9q81AaIm6JVji52KN-9CCRC9GPhsioDqz0XhymBnuvQcErSNqeSCGavQy0ykmvpf5iLVCc1BprLsABx1ISggxJNvZMVZbWeMv_j0wPtl35srSO9_J_fE4M"
                  alt="Contractor"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Rana Plumbing</p>
                <p className="text-[11px] text-primary font-medium">Available Now</p>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-3 rounded-full border border-gray-200 text-sm font-bold text-on-surface hover:bg-surface-container transition-colors font-headline tracking-wide uppercase">
            View Directory
          </button>
        </div>
      </div>
    </>
  );
}
