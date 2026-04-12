import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 border-t border-gray-100 pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="w-6 h-1.5 bg-black"></div>
              <div className="w-6 h-4 bg-black"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Nirman Builders</span>
          </div>
          <nav className="flex gap-8 text-sm font-medium text-gray-500">
            <Link href="/projects" className="hover:text-black transition-colors">Projects</Link>
            <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
            <Link href="/#contact" className="hover:text-black transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-black transition-colors">Login Portals</Link>
          </nav>
        </div>
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Nirman Builders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
