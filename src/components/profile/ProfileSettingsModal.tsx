"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSettingsModal() {
  const { 
    isProfileModalOpen, closeProfileModal, 
    theme, setTheme, 
    profileBorderColor, setProfileBorderColor 
  } = useAppStore();
  
  const { user, setUser } = useAuthStore();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'about'>('profile');
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
    }
  }, [user]);

  // Apply dark mode to body globally
  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#2c2424'; // Very dark neo-brutalist brown/grey
      document.body.style.color = '#fff';
    } else {
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
    }
  }, [theme]);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true);
      
      let avatarUrl = user?.user_metadata?.avatar_url;
      
      // Upload avatar if a file is selected
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        // Upload ke Supabase Storage (bucket 'avatars')
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      // Update user metadata di Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        }
      });

      if (error) throw error;
      
      // Update local store
      setUser(data.user);
      
      import("@/store/useToastStore").then(mod => 
        mod.useToastStore.getState().showToast("Profile updated successfully!", "success")
      );
    } catch (error: any) {
      import("@/store/useToastStore").then(mod => 
        mod.useToastStore.getState().showToast(error.message, "error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const borderColors = [
    { label: 'Black', value: '#111111' },
    { label: 'Dark Brown', value: '#3B2F2F' },
    { label: 'Red', value: '#EF4444' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Yellow', value: '#EAB308' },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProfileModal} />
      
      {/* Modal Box */}
      <div className={`relative w-full max-w-lg border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] flex flex-col ${theme === 'dark' ? 'bg-[#3B2F2F] text-white' : 'bg-[#F5EDE6] text-black'} animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b-4 border-black bg-white text-black">
          <h2 className="text-3xl font-black uppercase tracking-tight">Settings</h2>
          <button onClick={closeProfileModal} className="w-10 h-10 flex justify-center items-center border-2 border-black bg-red-400 font-black hover:bg-red-500 active:translate-y-[2px]">
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-black bg-gray-100 text-black font-black uppercase text-sm">
          <button 
            className={`flex-1 py-4 border-r-4 border-black transition-colors ${activeTab === 'profile' ? 'bg-yellow-300' : 'hover:bg-yellow-100'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`flex-1 py-4 border-r-4 border-black transition-colors ${activeTab === 'appearance' ? 'bg-emerald-300' : 'hover:bg-emerald-100'}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`flex-1 py-4 transition-colors ${activeTab === 'about' ? 'bg-pink-300' : 'hover:bg-pink-100'}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 min-h-[320px] max-h-[60vh] overflow-y-auto">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block font-black uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border-4 border-black font-bold bg-white text-black focus:outline-none focus:ring-4 ring-blue-400 transition-shadow"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block font-black uppercase mb-2">Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  className="w-full p-2 border-4 border-black font-bold bg-white text-black file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-2 file:border-black file:text-sm file:font-black file:uppercase file:bg-yellow-300 hover:file:bg-yellow-400 cursor-pointer"
                />
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isUploading}
                className="w-full py-4 mt-4 border-4 border-black bg-blue-400 text-black font-black text-lg uppercase hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none transition-all"
              >
                {isUploading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <label className="block font-black uppercase mb-4 text-xl">Theme</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-4 font-black uppercase text-black border-4 transition-transform active:translate-y-[2px] ${theme === 'light' ? 'bg-yellow-300 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-white border-black hover:bg-gray-100'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-4 font-black uppercase text-white border-4 transition-transform active:translate-y-[2px] ${theme === 'dark' ? 'bg-[#222] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-gray-600 border-black hover:bg-gray-700'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block font-black uppercase mb-4 text-xl">Avatar Border Color</label>
                <div className="flex flex-wrap gap-4">
                  {borderColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setProfileBorderColor(color.value)}
                      style={{ backgroundColor: color.value }}
                      className={`w-14 h-14 rounded-full border-4 transition-transform hover:scale-110 ${profileBorderColor === color.value ? 'border-white ring-4 ring-black scale-110 shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'border-black'}`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 pt-6">
              <div className="text-center">
                <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter">Gum<span className="text-pink-500">clone</span></h3>
                <p className="font-bold border-4 border-black p-4 bg-yellow-300 text-black inline-block transform -rotate-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-lg">
                  The best way to sell digital products. v1.0
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
