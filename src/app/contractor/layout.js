import Link from 'next/link';

export default function ContractorLayout({ children }) {
  return (
    <div className="bg-[#dcffe5] text-[#06361f] flex min-h-screen font-body antialiased">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#c7fdd8] flex flex-col p-4 gap-2 z-50 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-[#006a28] rounded-lg flex items-center justify-center text-[#cfffce]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#06361f] leading-tight font-headline">
              Nirman Builders
            </h1>
            <p className="font-headline text-xs font-medium tracking-tight text-[#548064]">
              Editorial Dashboard
            </p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <Link
            href="/contractor"
            className="bg-[#ffffff] text-[#006a28] rounded-lg font-bold flex items-center gap-3 p-3 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-headline text-sm font-medium tracking-tight">Dashboard</span>
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">architecture</span>
            <span className="font-headline text-sm font-medium tracking-tight">Projects</span>
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">assignment</span>
            <span className="font-headline text-sm font-medium tracking-tight">Tasks</span>
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-headline text-sm font-medium tracking-tight">Inventory</span>
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">chat</span>
            <span className="font-headline text-sm font-medium tracking-tight">Messages</span>
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3 transition-colors duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-headline text-sm font-medium tracking-tight">Settings</span>
          </Link>
        </nav>
        
        <button className="mt-4 mb-8 w-full py-3 bg-[#006a28] text-[#cfffce] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm">
          <span className="material-symbols-outlined">add</span>
          New Project
        </button>
        
        <div className="mt-auto flex flex-col gap-1 border-t border-[#006a28]/10 pt-4">
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 p-3"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-headline text-sm font-medium tracking-tight">Help Center</span>
          </Link>
          <button
            className="text-[#b02500] flex items-center gap-3 p-3 hover:bg-[#b02500]/5 rounded-lg transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-headline text-sm font-medium tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="sticky top-0 bg-[#dcffe5]/70 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-[#06361f]/10 z-40">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-bold text-lg text-[#006a28]">
              Project Management
            </h2>
            <nav className="flex gap-6 h-full relative top-[1px]">
              <Link
                href="#"
                className="font-headline font-semibold text-[#006a28] border-b-2 border-[#006a28] h-16 flex items-center"
              >
                Overview
              </Link>
              <Link
                href="#"
                className="font-headline font-semibold text-[#548064] hover:text-[#006a28] h-16 flex items-center transition-all"
              >
                Schedule
              </Link>
              <Link
                href="#"
                className="font-headline font-semibold text-[#548064] hover:text-[#006a28] h-16 flex items-center transition-all"
              >
                Documents
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#548064]">
                search
              </span>
              <input
                className="bg-[#c7fdd8] outline-none border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] w-64 transition-all"
                placeholder="Search projects..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center text-[#06361f] hover:bg-[#a8ecbf] rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-[#548064]/20">
                <img
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#5cfd80]"
                  alt="Contractor Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3L7pkH_7FMaxKJg89KtwSxcZajf2JvQJo5c-yiRgPJysEzbV69MhNNbCL14aWqBPQJPP6voJIwgOONtNnYIq_MEshHmFtsuUKa18aIokBMVHQu5aWcerZNo4-XUmLSv2t9x43KUYs1owUGrDxEhGtFXI8lTJqAvEmMXuwWVkFs9jEhle60OhOLLjG_l5SjSqpXMIhQpEPFjk5sEusbku6hwGRSMFkVzOd_FVkjPINCVN-M33XDKTTixYvB_LNfoOUb5yuiTzyxqQ"
                />
                <span className="material-symbols-outlined text-[#548064]">
                  account_circle
                </span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 bg-[#006a28] text-[#cfffce] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>
          add
        </span>
      </button>
    </div>
  );
}
