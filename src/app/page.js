"use client";

import Link from 'next/link';
import Slider from '@/components/Slider';
import Card from '@/components/card';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "45+", label: "Expert Architects" },
    { value: "12", label: "Years of Excellence" }
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Homeowner",
      content: "Nirman Builders exceeded our expectations! Their attention to detail and commitment to quality is outstanding.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Business Owner",
      content: "Professional team, timely delivery, and excellent communication throughout the project. Highly recommended!",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "Real Estate Developer",
      content: "One of the best construction partners we've worked with. Quality materials and skilled workforce.",
      rating: 5
    }
  ];

  return (
    <>
      {/* Hero Section with Slider */}

      <Slider />




      {/* Features/Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive construction solutions tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏗️",
                title: "Residential Construction",
                description: "Custom homes, apartments, and luxury villas built with precision and care."
              },
              {
                icon: "🏭",
                title: "Commercial Projects",
                description: "Office buildings, shopping malls, and industrial complexes."
              },
              {
                icon: "🔧",
                title: "Renovation & Remodeling",
                description: "Transform existing spaces with modern designs and quality materials."
              }
            ].map((service, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/services" className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Projects Section */}

      <Card />


      {/* Who We Are Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Who We Are</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-[400px] object-cover"
                  src="/img/building-construction-worker-site-with-architect.jpg"
                  alt="Who We Are"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white p-4 rounded-xl shadow-lg hidden lg:block">
                <div className="text-3xl font-bold">12+</div>
                <div className="text-sm">Years of Trust</div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Nirman Builders is a leading construction company dedicated to delivering high-quality building solutions.
                With a team of experienced professionals and a commitment to excellence, we strive to exceed our clients'
                expectations in every project we undertake.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "✓", text: "Experienced Team: Our skilled professionals have years of experience" },
                  { icon: "✓", text: "Quality Materials: We use only the best materials for durability" },
                  { icon: "✓", text: "Customer Satisfaction: We prioritize our clients' needs" },
                  { icon: "✓", text: "Timely Delivery: We complete projects within deadlines" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 text-sm font-bold">{item.icon}</span>
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/about">
                <button className="bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                  Learn More About Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">What makes us the preferred choice for construction projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "👥",
                title: "Experienced Team",
                description: "Professionals dedicated to excellence with 12+ years of expertise."
              },
              {
                icon: "⏱️",
                title: "On-time Delivery",
                description: "Strict adherence to project timelines with efficient management."
              },
              {
                icon: "💰",
                title: "Cost Transparency",
                description: "Clear budgets with no hidden fees and competitive pricing."
              },
              {
                icon: "🔧",
                title: "Modern Technology",
                description: "Using the latest tools and techniques for precision work."
              }
            ].map((item, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 border border-white/10">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Consultation Section */}
      <section className="bg-[#f8faf9] py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#006a28]/[0.02] -skew-x-12 transform translate-x-32"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 bg-[#f0fff4] border border-[#006a28]/10 px-4 py-2 rounded-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006a28] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006a28]"></span>
                </span>
                <span className="text-[10px] font-black text-[#006a28] uppercase tracking-widest">Nirman AI Assistant Online</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-[#06361f] leading-[1.1] tracking-tight">
                Ready to Start Your <span className="text-[#006a28]">Dream Project?</span>
              </h2>
              <p className="text-lg text-[#548064] font-medium leading-relaxed max-w-xl">
                Skip the wait. Chat with our intelligent assistant to get instant estimates, design suggestions, and project insights in real-time.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-[#006a28] text-white font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-[#006a28]/20 hover:bg-[#06361f] transition-all active:scale-95 group text-sm uppercase tracking-widest">
                  Start Consultation
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <div className="flex -space-x-3 items-center ml-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Expert" />
                    </div>
                  ))}
                  <div className="pl-6 text-[11px] font-black text-[#548064] uppercase tracking-wider">
                    Joined by 200+ clients today
                  </div>
                </div>
              </div>
            </div>

            {/* Right Chat Interface */}
            <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-[#006a28] to-cyan-500 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

              <div className="relative bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[520px]">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#006a28] flex items-center justify-center text-white shadow-lg">
                      <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div>
                      <p className="font-black text-sm text-[#06361f]">Nirman AI Expert</p>
                      <p className="text-[10px] font-bold text-[#006a28] uppercase tracking-widest">Always Active</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-8 space-y-6 overflow-y-auto hide-scrollbar">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm text-[#006a28]">smart_toy</span>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-3xl rounded-tl-none text-sm font-medium text-[#06361f] leading-relaxed max-w-[80%] shadow-sm">
                      Hello! I'm your Nirman AI assistant. How can I help you build your dream project today? 🏗️
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <div className="bg-[#006a28] p-5 rounded-3xl rounded-tr-none text-sm font-medium text-white leading-relaxed max-w-[80%] shadow-xl shadow-[#006a28]/10">
                      I'm looking to build a 3-bedroom villa in Banani. Can I get a rough estimate?
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm text-[#006a28]">smart_toy</span>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-3xl rounded-tl-none text-sm font-medium text-[#06361f] leading-relaxed max-w-[90%] shadow-sm">
                      Exciting choice! For a premium 3-bedroom villa in Banani (~2500 sqft), the estimated cost would be around <span className="font-black text-[#006a28]">৳ 1.2Cr - 1.8Cr</span> depending on the finishes.
                      <br /><br />
                      Would you like to see some recent villa designs we completed in that area?
                    </div>
                  </div>

                  <div className="flex gap-2 ml-12">
                    <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask about materials, cost, or designs..."
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 text-sm outline-none focus:ring-4 focus:ring-[#006a28]/5 focus:border-[#006a28] transition-all font-medium"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#006a28] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#06361f] transition-all">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Ready to start your next project? Contact us today for a consultation or any inquiries.
                Our team is here to help you bring your vision to life.
              </p>

              <div className="space-y-6">
                {[
                  { icon: "📞", title: "Phone", info: "+880 1234 567890", detail: "Mon-Fri, 9am-6pm" },
                  { icon: "✉️", title: "Email", info: "contact@nirmanbuilders.com", detail: "We'll respond within 24h" },
                  { icon: "📍", title: "Location", info: "Level 4, Summit Tower, Banani, Dhaka 1213", detail: "Visit our office" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="text-gray-600">{item.info}</p>
                      <p className="text-sm text-gray-400">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-10">
                {["Facebook", "LinkedIn", "Instagram", "YouTube"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-200 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <span className="text-gray-600 hover:text-white text-sm">{social.charAt(0)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+880 1234 567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-300 resize-none"
                    required
                  ></textarea>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 active:scale-[0.98]">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </>
  );
}