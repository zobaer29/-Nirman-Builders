import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 px-4 md:px-10 py-4 bg-gray-100">
      <Link href="/">
        <h3 className="text-2xl font-bold cursor-pointer hover:text-emerald-500 transition-colors">Nirman Builders</h3>
      </Link>
      <div className="flex flex-wrap items-center gap-4 md:gap-10 w-full md:w-auto justify-between md:justify-end">
        <ul className="flex flex-wrap gap-4 md:gap-10 text-sm md:text-base items-center">
          <li>
            <Link href="/" className="cursor-pointer hover:text-blue-500 transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/projects" className="cursor-pointer hover:text-blue-500 transition-colors">Projects</Link>
          </li>
          <li>
            <Link href="/about" className="cursor-pointer hover:text-blue-500 transition-colors">About</Link>
          </li>

        </ul>
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded transition-colors shadow-sm">
          Login
        </Link>
      </div>
    </header>
  );
}
