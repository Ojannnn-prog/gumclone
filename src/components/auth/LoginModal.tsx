"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthUIStore } from "@/store/useAuthUIStore";

export default function LoginModal() {
  const isOpen = useAuthUIStore((state) => state.isLoginModalOpen);
  const onClose = useAuthUIStore((state) => state.closeLoginModal);
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setMessage("");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
      
      const { useToastStore } = await import("@/store/useToastStore");
      useToastStore.getState().showToast("Magic link sent! Check your email.", "success");
      onClose(); // Automatically close modal
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-yellow-300 border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border-2 border-black font-black hover:bg-red-400 active:translate-y-[2px]"
          aria-label="Close"
        >
          X
        </button>

        <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">Login</h2>

        {message && (
          <div className="mb-6 p-4 bg-white border-2 border-black font-bold text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full neo-box py-3 bg-white border-2 border-black font-black uppercase text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:translate-y-[2px]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[2px] bg-black flex-1"></div>
            <span className="font-bold uppercase text-sm">OR</span>
            <div className="h-[2px] bg-black flex-1"></div>
          </div>

          {/* Email Magic Link Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white border-2 border-black font-bold focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors"
              required
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full neo-box py-3 bg-emerald-400 border-2 border-black font-black uppercase text-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px]"
            >
              {isLoading ? "Loading..." : "Login with Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
