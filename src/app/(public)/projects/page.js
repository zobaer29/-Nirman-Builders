import Link from "next/link";
import Image from "next/image";

export default function Projects() {
  return (
    <div className="bg-slate-50 text-slate-900 w-full">
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Our Construction Projects
          </h1>
          <p className="max-w-3xl mx-auto text-slate-200 text-base md:text-lg">
            Explore residential, commercial, and industrial projects delivered
            by Nirman Builders with quality, transparency, and timely execution.
          </p>
        </div>
      </section>

      <section id="featured" className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
          <Link href="#all-projects" className="text-blue-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="Commercial high-rise project"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-blue-600 font-semibold mb-2">Commercial</p>
              <h3 className="text-xl font-bold mb-2">Skyline Business Tower</h3>
              <p className="text-gray-600 mb-4">
                A 20-floor modern office tower with sustainable design, smart
                utility management, and premium workspace facilities.
              </p>
              <p className="text-sm text-gray-500">Location: Banani, Dhaka</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80"
              alt="Residential apartment project"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-emerald-600 font-semibold mb-2">Residential</p>
              <h3 className="text-xl font-bold mb-2">Greenview Residency</h3>
              <p className="text-gray-600 mb-4">
                A family-focused apartment complex featuring landscaped open
                spaces, rooftop amenities, and earthquake-resistant structure.
              </p>
              <p className="text-sm text-gray-500">Location: Uttara, Dhaka</p>
            </div>
          </article>
        </div>
      </section>

      <section id="all-projects" className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Metro Shopping Complex</h3>
            <p className="text-gray-600 text-sm mb-4">
              Retail & lifestyle mall with integrated parking and modern safety
              features.
            </p>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Completed</span>
          </article>
          
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Riverfront Villas</h3>
            <p className="text-gray-600 text-sm mb-4">
              Luxury gated community project with modern duplex villas and clubhouse.
            </p>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Ongoing</span>
          </article>
          
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Tech Park Phase II</h3>
            <p className="text-gray-600 text-sm mb-4">
              Industrial and innovation campus with advanced utility infrastructure.
            </p>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Completed</span>
          </article>
          
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">City Medical Center</h3>
            <p className="text-gray-600 text-sm mb-4">
              Multi-specialty hospital project meeting modern healthcare design standards.
            </p>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Ongoing</span>
          </article>
          
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Lakeside Corporate Hub</h3>
            <p className="text-gray-600 text-sm mb-4">
              Grade-A office spaces built for scalable businesses and startups.
            </p>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Completed</span>
          </article>
          
          <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="font-bold text-lg mb-2">Airport Link Residences</h3>
            <p className="text-gray-600 text-sm mb-4">
              Transit-friendly high-rise residences with smart security and green zones.
            </p>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Ongoing</span>
          </article>
        </div>
      </section>

      <section id="contact-cta" className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Let us discuss your ideas and turn them into a reliable, modern, and
            cost-effective construction solution.
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Contact Nirman Builders
          </Link>
        </div>
      </section>
    </div>
  );
}
