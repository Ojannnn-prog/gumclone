"use client";

import { useState } from 'react';
import Link from 'next/link';
import CartButton from './CartButton';
import { useAuthUIStore } from '@/store/useAuthUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openLoginModal = useAuthUIStore((state) => state.openLoginModal);
  const { user, isLoading } = useAuthStore();
  const { language, setLanguage, profileBorderColor, openProfileModal } = useAppStore();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ID' : 'EN');
  };

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email}`;
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* LOGO (Kiri) */}
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase relative z-50" onClick={() => setIsMobileMenuOpen(false)}>
              Gum<span className="text-pink-500">clone</span>
            </Link>

            {/* AREA KANAN */}
            <div className="flex items-center gap-3 sm:gap-4 relative z-50">
              {/* CartButton selalu tampil di mobile & desktop */}
              <CartButton />

              {/* Hamburger Button (Hanya Mobile) */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1 border-2 border-black bg-yellow-300 hover:bg-yellow-400 active:translate-y-[2px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform"
                aria-label="Toggle Menu"
              >
                <div className={`w-5 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </button>

              {/* Desktop Menu (Sembunyi di Mobile) */}
              <div className="hidden md:flex items-center space-x-4">
                {isLoading ? (
                  <div className="neo-box px-3 py-1.5 font-bold text-sm bg-gray-200">
                    ...
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={toggleLanguage}
                      className="neo-box px-3 py-2 font-black text-sm bg-purple-300 border-2 border-black hover:bg-purple-400 active:translate-y-[2px]"
                    >
                      {language === 'EN' ? '🇺🇸 EN' : '🇮🇩 ID'}
                    </button>
                    
                    <div 
                      onClick={openProfileModal}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 active:translate-y-[2px] transition-transform"
                      title="Profile Settings"
                    >
                      <img 
                        src={getAvatarUrl()} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full border-4 bg-white object-cover shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                        style={{ borderColor: profileBorderColor }}
                      />
                      <span className="font-black text-sm uppercase bg-yellow-300 border-2 border-black px-2 py-1 transform -rotate-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                        Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="neo-box px-4 py-2 font-black uppercase text-sm bg-black text-white hover:bg-neutral-800 active:translate-y-[2px]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }}
                    className="neo-box px-4 py-2 font-bold text-sm bg-black text-white hover:bg-neutral-800 active:translate-y-[2px]"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY (Slide dari atas di bawah Navbar) */}
      <div 
        className={`fixed inset-0 z-40 bg-[#F5EDE6] transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 pb-6 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto text-black">
          {isLoading ? (
            <div className="p-4 border-4 border-black bg-gray-200 font-bold text-center">Loading...</div>
          ) : user ? (
            <>
              {/* Mobile Profile Card */}
              <div 
                onClick={() => {
                  openProfileModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center p-4 bg-white border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                <img 
                  src={getAvatarUrl()} 
                  alt="User Avatar" 
                  className="w-16 h-16 rounded-full border-4 bg-white object-cover mr-4 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  style={{ borderColor: profileBorderColor }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-1">Logged in as</span>
                  <span className="font-black text-xl uppercase truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
              </div>

              {/* Mobile Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="w-full py-4 bg-purple-300 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] font-black text-lg uppercase active:translate-y-[2px] hover:bg-purple-400 transition-all"
              >
                {language === 'EN' ? '🇺🇸 English (EN)' : '🇮🇩 Bahasa (ID)'}
              </button>

              {/* Mobile Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-black border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] text-white font-black text-lg uppercase active:translate-y-[2px] hover:bg-neutral-800 transition-all mt-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                openLoginModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-4 bg-blue-400 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] font-black text-lg uppercase active:translate-y-[2px] hover:bg-blue-500 transition-all mt-4"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
}
