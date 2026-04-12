import Image from "next/image";
import Link from "next/link";

export default function AdminProjects() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
            Projects Repository
          </h2>
          <p className="text-on-surface-variant font-body mt-1">
            Manage and monitor all construction projects.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dim text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-colors font-headline">
          <span className="material-symbols-outlined">add</span> Create New Project
        </button>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold font-headline text-on-surface mb-6">Featured Projects</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Skyline Business Tower"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Commercial
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h4 className="text-xl font-bold font-headline text-on-surface mb-2">Skyline Business Tower</h4>
              <p className="text-sm text-on-surface-variant mb-6 flex-1">
                A 20-floor modern office tower with sustainable design, smart utility management, and premium workspace facilities.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant border-t border-surface-container-highest pt-4">
                <span className="material-symbols-outlined text-[16px]">location_on</span> Banani, Dhaka
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80"
                alt="Greenview Residency"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Residential
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h4 className="text-xl font-bold font-headline text-on-surface mb-2">Greenview Residency</h4>
              <p className="text-sm text-on-surface-variant mb-6 flex-1">
                A family-focused apartment complex featuring landscaped open spaces, rooftop amenities, and earthquake-resistant structure.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant border-t border-surface-container-highest pt-4">
                <span className="material-symbols-outlined text-[16px]">location_on</span> Uttara, Dhaka
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold font-headline text-on-surface">All Projects</h3>
          <div className="flex gap-2">
            <button className="bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">Metro Shopping Complex</h4>
              <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[11px] font-bold rounded-full uppercase">Completed</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Retail & lifestyle mall with integrated parking and modern safety features.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">Riverfront Villas</h4>
              <span className="px-3 py-1 bg-primary-container/20 text-primary-dim text-[11px] font-bold rounded-full uppercase">Ongoing</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Luxury gated community project with modern duplex villas and clubhouse.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">Tech Park Phase II</h4>
              <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[11px] font-bold rounded-full uppercase">Completed</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Industrial and innovation campus with advanced utility infrastructure.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">City Medical Center</h4>
              <span className="px-3 py-1 bg-primary-container/20 text-primary-dim text-[11px] font-bold rounded-full uppercase">Ongoing</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Multi-specialty hospital project meeting modern healthcare design standards.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">Lakeside Corporate Hub</h4>
              <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[11px] font-bold rounded-full uppercase">Completed</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Grade-A office spaces built for scalable businesses and startups.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-all flex flex-col border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg font-headline text-on-surface">Airport Link Residences</h4>
              <span className="px-3 py-1 bg-primary-container/20 text-primary-dim text-[11px] font-bold rounded-full uppercase">Ongoing</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              Transit-friendly high-rise residences with smart security and green zones.
            </p>
            <button className="text-primary font-semibold text-sm hover:underline self-start">View Details</button>
          </div>
        </div>
      </div>
    </>
  );
}
