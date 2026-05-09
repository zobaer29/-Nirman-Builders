import Slider from "@/components/Slider";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Slider></Slider>

      <section className="py-14 md:py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <img
              className="w-full rounded-2xl shadow-lg"
              src="/img/civil-engineer-construction-worker-architects-wearing-hardhats-safety-vests-are-working-together-construction-site-building-home-cooperation-teamwork-concept.jpg"
              alt="Nirman Builders team"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-justify">
              Nirman Builders is a trusted construction company focused on
              quality, transparency, and on-time delivery. From residential
              homes to commercial spaces, our experienced team manages every
              step with care.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>10+ Years Experience</strong> in the construction sector</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Client-Centered Approach</strong> with clear communication</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Modern Engineering</strong> and quality materials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Reliable Delivery</strong> within planned timelines</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">
                M
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver durable, innovative, and cost-effective construction
                solutions that exceed customer expectations at every stage. We focus on continuous improvement and excellence.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">
                V
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a leading name in modern construction by creating spaces
                that combine function, beauty, and sustainability, while fostering a safe and rewarding environment for our workforce.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
