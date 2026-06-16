'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContractorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Form states
  const [formData, setFormData] = useState({
    photoUrl: '',
    fullName: '',
    phone: '',
    nid: '',
    experience: 0,
    specialization: '',
    tradeLicense: '',
    address: '',
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contractor/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          photoUrl: data.user.photoUrl || '',
          fullName: data.details?.full_name || data.user.username,
          phone: data.details?.phone || '',
          nid: data.details?.nid || '',
          experience: data.details?.experience || 0,
          specialization: data.details?.specialization || 'General Contractor',
          tradeLicense: data.details?.trade_license || '',
          address: data.details?.address || '',
        });
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update contractor details');
      }

      showToast('Profile credentials updated successfully!');
      setIsEditing(false);
      fetchProfile(); // reload to sync layout name/details
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error');
      return;
    }

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setFormData((current) => ({ ...current, photoUrl: data.url }));
      showToast('Photo uploaded. Save credentials to update your profile.');
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[#548064] font-black uppercase tracking-wider text-xs">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-[32px] text-center border-red-200 bg-red-50/50 max-w-md mx-auto">
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
  const previewPhotoUrl = isEditing ? formData.photoUrl : profile.user.photoUrl;
  const previewName = isEditing
    ? formData.fullName
    : profile.details?.full_name || profile.user.username;
  const previewSpecialization = isEditing
    ? formData.specialization
    : profile.details?.specialization || 'Lead Contractor';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto relative pb-12">
      {/* Toast Notification Banner */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-[#eefcf2] text-[#0c6b30] border border-[#d2f7dd]'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {notification.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Contractor Settings
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            My <span className="text-primary">Profile</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">Manage your professional credentials and business info</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="premium-gradient text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all text-sm"
          >
            <span className="material-symbols-outlined text-lg">edit</span> Edit Credentials
          </button>
        )}
      </section>

      {/* Card Body */}
      <div className="bg-white rounded-[32px] premium-shadow border border-zinc-100 overflow-hidden">
        {/* Cover Canvas Area */}
        <div className="h-40 bg-gradient-to-r from-[#5cfd80] to-primary/80 w-full relative flex items-end p-6">
          <div className="absolute inset-0 bg-[#06361f]/10"></div>
        </div>

        {/* Profile Info Summary */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-8 relative z-10">
            {previewPhotoUrl ? (
              <img 
                src={previewPhotoUrl} 
                alt="Profile Avatar" 
                className="w-28 h-28 rounded-[24px] object-cover border-4 border-white shadow-xl bg-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-[24px] border-4 border-white shadow-xl bg-[#5cfd80]/20 flex items-center justify-center text-primary font-black text-4xl bg-white">
                {(previewName || 'C').charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-[#06361f] truncate">
                {previewName}
              </h2>
              <p className="text-[#548064] text-xs font-black uppercase tracking-wider mt-0.5">
                {previewSpecialization}
              </p>
            </div>
            
            <div className="bg-[#f4f7f6] px-4 py-2 rounded-2xl border border-zinc-200/50 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#006a28] rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-[#06361f] uppercase tracking-wider">Authorized Contractor</span>
            </div>
          </div>

          {/* Stats Bar */}
          <section className="grid grid-cols-3 gap-4 border-y border-zinc-100 py-6 mb-8">
            {[
              { label: 'Active Sites', value: profile.stats.projects, icon: 'architecture', color: 'text-primary' },
              { label: 'Active Crew', value: profile.stats.workforce, icon: 'groups_2', color: 'text-blue-500' },
              { label: 'Total Tasks', value: profile.stats.tasks, icon: 'task_alt', color: 'text-purple-500' },
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
                <span className="material-symbols-outlined text-primary">edit_note</span> Edit Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Profile Photo</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl premium-gradient px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-lg">upload</span>
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadPhoto}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={uploading || !formData.photoUrl}
                        onClick={() => setFormData({ ...formData, photoUrl: '' })}
                        className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-black text-sm transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.photoUrl}
                      onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="Uploaded image URL"
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Full Business Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                      required
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Specialization / Role</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
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
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                    />
                  </div>

                  {/* NID */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">National ID (NID)</label>
                    <input
                      type="text"
                      value={formData.nid}
                      onChange={e => setFormData({ ...formData, nid: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                    />
                  </div>

                  {/* Trade License */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Trade License Number</label>
                    <input
                      type="text"
                      value={formData.tradeLicense}
                      onChange={e => setFormData({ ...formData, tradeLicense: e.target.value })}
                      className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#548064] uppercase tracking-wider">Business Address</label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#f4f7f6] outline-none border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary font-bold text-[#06361f]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl font-black text-sm uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="premium-gradient text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2"
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
                  <span className="material-symbols-outlined text-primary font-fill">badge</span> Professional Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Specialization</label>
                    <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.specialization || 'General Contractor'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Experience</label>
                    <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.experience || 0} Years</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Trade License</label>
                    <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.trade_license || 'Not Provided'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">National ID (NID)</label>
                    <p className="text-[#06361f] font-mono font-bold mt-0.5">{profile.details?.nid || 'Not Provided'}</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-[#06361f] border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary font-fill">contacts</span> Contact Info & Address
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Phone Number</label>
                      <p className="text-[#06361f] font-bold mt-0.5">{profile.details?.phone || 'Not Provided'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Email Address</label>
                      <p className="text-[#06361f] font-bold mt-0.5">{profile.user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Business Address</label>
                    <p className="text-[#06361f] font-bold mt-0.5 leading-relaxed">{profile.details?.address || 'Not Provided'}</p>
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
