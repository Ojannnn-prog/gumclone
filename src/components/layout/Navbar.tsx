"use client";

import Link from 'next/link';
import CartButton from './CartButton';
import { useAuthUIStore } from '@/store/useAuthUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const openLoginModal = useAuthUIStore((state) => state.openLoginModal);
  const { user, isLoading } = useAuthStore();
  const { language, setLanguage, profileBorderColor, openProfileModal } = useAppStore();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ID' : 'EN');
  };

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email}`;
  };

  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase">
            Gum<span className="text-pink-500">clone</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CartButton />
            {isLoading ? (
              <div className="neo-box px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-sm bg-gray-200">
                ...
              </div>
            ) : user ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={toggleLanguage}
                  className="neo-box px-2 py-1.5 sm:px-3 sm:py-2 font-black text-sm bg-purple-300 border-2 border-black hover:bg-purple-400 active:translate-y-[2px]"
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
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 bg-white object-cover shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    style={{ borderColor: profileBorderColor }}
                  />
                  <span className="hidden sm:inline-block font-black text-sm uppercase bg-yellow-300 border-2 border-black px-2 py-1 transform -rotate-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="neo-box px-3 py-1.5 sm:px-4 sm:py-2 font-black uppercase text-sm bg-black text-white hover:bg-neutral-800 active:translate-y-[2px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={openLoginModal}
                className="neo-box px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-sm bg-black text-white hover:bg-neutral-800 active:translate-y-[2px]"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
