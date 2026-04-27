import Link from "next/link";
import Image from "next/image";

export default function WorkerLayout({ children }) {
  return (
    <div className="bg-[#dcffe5] text-[#06361f] antialiased min-h-screen font-body flex">
      {/* SideNavBar Anchor */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#c7fdd8] flex flex-col p-4 gap-2 z-50 overflow-y-auto">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#006a28] flex items-center justify-center text-[#cfffce]">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          <div>
            <h1 className="font-headline text-xl font-bold text-[#06361f] leading-none">
              Nirman Builders
            </h1>
            <p className="font-headline text-xs font-medium tracking-tight opacity-70 mt-1">
              Editorial Dashboard
            </p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <Link
            href="/worker"
            className="bg-[#ffffff] text-[#006a28] rounded-lg font-bold flex items-center gap-3 px-4 py-3 font-headline text-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-3 font-headline text-sm transition-colors duration-200"
          >
            <span className="material-symbols-outlined">architecture</span>
            Projects
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-3 font-headline text-sm transition-colors duration-200"
          >
            <span className="material-symbols-outlined">assignment</span>
            Tasks
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-3 font-headline text-sm transition-colors duration-200"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Inventory
          </Link>
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-3 font-headline text-sm transition-colors duration-200"
          >
            <span className="material-symbols-outlined">chat</span>
            Messages
          </Link>

        </nav>
        <button className="mt-4 bg-[#006a28] text-[#cfffce] py-3 px-4 rounded-lg font-headline font-bold flex items-center justify-center gap-2 transition-transform active:scale-90">
          <span className="material-symbols-outlined">add</span>
          New Project
        </button>
        <div className="mt-auto border-t border-[#89b898]/20 pt-4 flex flex-col gap-1">
          <Link
            href="#"
            className="text-[#06361f] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-2 font-headline text-sm"
          >
            <span className="material-symbols-outlined">help</span>
            Help Center
          </Link>
          <button className="text-[#b02500] hover:bg-[#a8ecbf]/50 rounded-lg flex items-center gap-3 px-4 py-2 font-headline text-sm w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* TopAppBar Anchor & Main Content wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="flex justify-between items-center h-16 px-8 bg-[#dcffe5]/70 backdrop-blur-md sticky top-0 z-40 border-b border-[#06361f]/5 shadow-sm">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-semibold text-[#006a28] text-lg">
              Project Management
            </h2>
            <nav className="hidden lg:flex items-center gap-6 h-full relative top-[1px]">
              <Link
                href="#"
                className="text-[#006a28] border-b-2 border-[#006a28] py-5 font-headline font-semibold"
              >
                Overview
              </Link>
              <Link
                href="#"
                className="text-[#548064] hover:text-[#006a28] py-5 font-headline font-semibold transition-all"
              >
                Schedule
              </Link>
              <Link
                href="#"
                className="text-[#548064] hover:text-[#006a28] py-5 font-headline font-semibold transition-all"
              >
                Documents
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <input
                className="bg-[#c7fdd8] outline-none border-none rounded-full px-10 py-2 text-sm focus:ring-2 focus:ring-[#006a28] w-64 transition-all"
                placeholder="Search project logs..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-[#89b898] text-lg">
                search
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center text-[#548064] hover:bg-[#b2f1c7] rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#b02500] rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-2 border-l border-[#89b898]/20">
                <img
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX5NT86IkP7CGz2_PvuqsegQojw1qrphEbDW8mCi3GICpx55gWfkZt7Y7bLTVl-UyC71qB3T_-6bgf9khuR9pFmHUxVZOKwqcepLOqEDO80KckqYy6UZepImHKEJU9oLmWrwlDlqI0JSRAsyjKfed3bG92SWJ5UaC9E_4kC_eQ-uhGg0F2AlMnm-vWvfGCvFFXglIMiriRXAkK-AP8x0rs6sK2qoNHHQR10EfTPbo3oq2Gcg1KFNZM3HwJkaKQwoKbFq1mOnxiBzI"
                />
                <span className="material-symbols-outlined text-[#548064]">
                  account_circle
                </span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>

      {/* Chat Widget Default (similar to Quick Action) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button className="w-14 h-14 bg-[#006a28] text-[#cfffce] rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-90 group">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>chat</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b02500] text-[10px] text-white font-bold rounded-full flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
