"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    photoUrl: "",
    fullName: "",
    phone: "",
    nid: "",
    experience: 0,
    specialization: "",
    address: "",
  });

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 4000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/worker/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          username: data.user.username || "",
          email: data.user.email || "",
          photoUrl: data.user.photoUrl || "",
          fullName: data.details?.full_name || data.user.username || "",
          phone: data.details?.phone || "",
          nid: data.details?.nid || "",
          experience: data.details?.experience || 0,
          specialization: data.details?.specialization || "General Worker",
          address: data.details?.address || "",
        });
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/worker/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile details");
      }

      showToast("Profile credentials updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#006a28] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#548064] font-black uppercase tracking-wider text-xs">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center max-w-md mx-auto">
        <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
        <h3 className="text-lg font-black text-red-800">Error</h3>
        <p className="text-red-600 mt-1 font-medium">{error}</p>
        <button onClick={fetchProfile} className="mt-4 px-6 py-2 bg-red-100 text-red-800 rounded-xl font-bold hover:bg-red-200 transition-colors text-sm">
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto relative pb-12">
      {notification.message && (
        <div className={`fixed top-4 right-4 z-[99999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 ${
          notification.type === "error" 
            ? "bg-red-50 text-red-800 border border-red-200" 
            : "bg-[#eefcf2] text-[#0c6b30] border border-[#d2f7dd]"
        }`}>
          <span className="material-symbols-outlined text-xl">
            {notification.type === "error" ? "error" : "check_circle"}
          </span>
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="px-3 py-1 bg-[#006a28]/10 text-[#006a28] text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Worker Settings
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            My <span className="text-[#006a28]">Profile</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Manage your worker credentials and contact info</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#006a28] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-[#006a28]/20 hover:scale-[1.03] transition-all text-sm border-none cursor-pointer outline-none"
          >
            <span className="material-symbols-outlined text-lg">edit</span> Edit Credentials
          </button>
        )}
      </section>

      {/* Card Body */}
      <div className="bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-[#8be0a5] to-[#006a28]/80 w-full relative flex items-end p-6">
          <div className="absolute inset-0 bg-[#06361f]/10"></div>
        </div>

        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-8 relative z-10">
            {profile.user.photoUrl ? (
              <img 
                src={profile.user.photoUrl} 
                alt="Profile Avatar" 
                className="w-28 h-28 rounded-[24px] object-cover border-4 border-white shadow-xl bg-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-[24px] border-4 border-white shadow-xl bg-[#006a28]/10 flex items-center justify-center text-[#006a28] font-black text-4xl bg-white">
                {profile.user.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-[#06361f] truncate">
                {profile.details?.full_name || profile.user.username}
              </h2>
              <p className="text-[#548064] text-xs font-black uppercase tracking-wider mt-0.5">
                {profile.details?.specialization || "Site Worker"}
              </p>
            </div>
            
            <div className="bg-[#f4f7f6] px-4 py-2 rounded-2xl border border-zinc-200/50 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#006a28] rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-[#06361f] uppercase tracking-wider">Active Field Worker</span>
            </div>
          </div>

          {/* Stats Bar */}
          <section className="grid grid-cols-3 gap-4 border-y border-zinc-100 py-6 mb-8">
            {[
              { label: 'Assigned Sites', value: profile.stats?.projects || 0, icon: 'location_on', color: 'text-[#006a28]' },
              { label: 'Total Tasks', value: profile.stats?.tasks || 0, icon: 'assignment', color: 'text-blue-500' },
              { label: 'Completed Tasks', value: profile.stats?.completedTasks || 0, icon: 'task_alt', color: 'text-[#006a28]' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3">
                <span className={`material-symbols-outlined ${stat.color} text-2xl mb-1`}>{stat.icon}</span>
                <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-[#06361f] mt-0.5">{stat.value}</h3>
              </div>
            ))}
          </section>

          {/* Details / Forms */}
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-black text-[#06361f] border-b border-zinc-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a28]">edit_note</span> Edit Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                      required
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Avatar Image URL</label>
                    <input
                      type="text"
                      value={formData.photoUrl}
                      onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Full Business/Legal Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Specialization */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Specialization / Trade</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Years of Experience</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                      required
                      min="0"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                    />
                  </div>

                  {/* NID */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">National ID (NID)</label>
                    <input
                      type="text"
                      value={formData.nid}
                      onChange={e => setFormData({ ...formData, nid: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Home/Mailing Address</label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-[#006a28] font-bold text-[#06361f]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-none cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#006a28] text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#006a28]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 border-none cursor-pointer outline-none"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Save Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              {/* Column 1 */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-[#06361f] border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a28] font-fill">badge</span> Professional Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Specialization</label>
                    <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.specialization || "General Worker"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Experience</label>
                    <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.experience || 0} Years</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">National ID (NID)</label>
                    <p className="text-[#06361f] font-mono font-bold mt-0.5">{profile.details?.nid || "Not Provided"}</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-[#06361f] border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a28] font-fill">contacts</span> Contact Info & Address
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Phone Number</label>
                      <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.phone || "Not Provided"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Email Address</label>
                      <p className="text-[#06361f] font-bold mt-0.5">{profile.user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Home Address</label>
                    <p className="text-[#06361f] font-bold mt-0.5 leading-relaxed">{profile.details?.address || "Not Provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
