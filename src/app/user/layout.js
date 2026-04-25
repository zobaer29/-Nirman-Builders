import Link from "next/link";
import Image from "next/image";

export default function ClientLayout({ children }) {
  return (
    <div className="bg-[#dcffe5] text-[#06361f] antialiased min-h-screen font-body">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#c7fdd8] flex flex-col p-4 gap-2 z-50 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#006a28] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#cfffce]">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#06361f] font-headline leading-none">
              Nirman Builders
            </h1>
            <p className="text-[10px] font-medium tracking-widest text-[#548064] uppercase mt-1">
              Editorial Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/client"
            className="flex items-center gap-3 px-4 py-3 bg-[#ffffff] text-[#006a28] rounded-lg font-bold transition-transform active:scale-95 font-headline text-sm"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">architecture</span>
            Projects
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">assignment</span>
            Tasks
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Inventory
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">chat</span>
            Messages
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-[#548064]/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 mb-4 bg-[#006a28] text-[#cfffce] rounded-lg font-bold text-sm shadow-sm transition-transform active:scale-95">
            <span className="material-symbols-outlined">add</span>
            New Project
          </button>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg transition-colors font-headline text-sm"
          >
            <span className="material-symbols-outlined">help</span>
            Help Center
          </Link>
          <button className="flex w-full items-center gap-3 px-4 py-3 text-[#b02500] font-headline text-sm hover:bg-[#b02500]/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-[#dcffe5]/70 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-emerald-900/10">
          <div className="flex items-center gap-8">
            <h2 className="text-[#06361f] font-headline font-bold text-lg">
              Project Management
            </h2>
            <nav className="hidden md:flex gap-6 relative top-[1px]">
              <Link
                href="#"
                className="text-[#006a28] border-b-2 border-[#006a28] font-headline font-semibold py-5"
              >
                Overview
              </Link>
              <Link
                href="#"
                className="text-[#548064] hover:text-[#006a28] font-headline font-semibold py-5 transition-all"
              >
                Schedule
              </Link>
              <Link
                href="#"
                className="text-[#548064] hover:text-[#006a28] font-headline font-semibold py-5 transition-all"
              >
                Documents
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input
                className="bg-[#c7fdd8] border-none outline-none rounded-full px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#006a28] transition-all"
                placeholder="Search project data..."
                type="text"
              />
              <span className="material-symbols-outlined absolute right-3 top-2 text-[#548064]">
                search
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#06361f] hover:bg-[#b2f1c7] p-2 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#b02500] rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-[#548064]/20">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold font-headline leading-none">
                    Ar. Rajiv Nirman
                  </p>
                  <p className="text-[10px] text-[#548064] font-medium">Head Architect</p>
                </div>
                <img
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border-2 border-[#5cfd80] shadow-sm object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ5SCJyy3yE3jJ26uyB8Z76Fa1ZnD5XNISGGGRQE5IKOqSJxLIjhoLzIMKdKVB7VKo0wdF4BEvIW_3u4pllA6ImobyBrhaynKJ7P0KETqwfPYaNNNrN3e425nmHYB5J37SVZZpehBiDWJMIVvni9UhBv_GGwRTH0had4iosqYbDSReKhI6rxnSy2fDxApiRcyrhn-zBE_YvDv1BfbResv7Hl8zr6QihzCV4QecBVfYzFyYGHkjXFCRNgqy8R6j8BZN3RkthEMWUy8"
                />
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#006a28] text-[#cfffce] rounded-full shadow-2xl flex items-center justify-center group transition-all hover:w-48 hover:rounded-2xl z-50">
        <span className="material-symbols-outlined group-hover:hidden" style={{ fontVariationSettings: '"FILL" 1' }}>
          add_business
        </span>
        <span className="hidden group-hover:inline font-bold font-headline pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
          New Request
        </span>
      </button>
    </div>
  );
}
