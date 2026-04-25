"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  const roleName = profile.roleId === 1 ? 'Super Admin' : profile.roleId === 2 ? 'User' : profile.roleId === 3 ? 'Contractor' : 'Worker';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-[4px] rounded-full bg-gradient-to-b from-blue-600 via-emerald-400 to-green-400"></div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline leading-tight bg-gradient-to-r from-blue-600 via-emerald-400 to-green-400 bg-clip-text text-transparent tracking-tight">
          My Profile
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-400 w-full relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        {/* Profile Info */}
        <div className="px-8 pb-10 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-8 relative z-10">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-5xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-slate-800">{profile.username}</h2>
              <p className="text-slate-500 font-medium">{roleName}</p>
            </div>
            
            <div className="pb-2 flex gap-3">
              <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">
                Edit Profile
              </button>
              <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-sm shadow-emerald-500/20">
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Full Name</label>
                  <p className="text-slate-800 font-medium mt-1">{profile.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Email Address</label>
                  <p className="text-slate-800 font-medium mt-1">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Account ID</label>
                  <p className="text-slate-800 font-mono text-sm mt-1 bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">
                    USR-{profile.id.toString().padStart(5, '0')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">System Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Role</label>
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                      {roleName}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Status</label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-800 font-medium">Active</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Authentication</label>
                  <p className="text-slate-800 font-medium mt-1">
                    {profile?.photoUrl ? 'Google OAuth (Firebase)' : 'Native Credentials (MySQL)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
