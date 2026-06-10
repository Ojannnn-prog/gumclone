import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSlideOver from '@/components/cart/CartSlideOver';
import LoginModal from '@/components/auth/LoginModal';
import AuthProvider from '@/components/auth/AuthProvider';
import Toast from '@/components/ui/Toast';
import ProfileSettingsModal from '@/components/profile/ProfileSettingsModal';

export const metadata: Metadata = {
  title: 'Gumclone - Neo-Brutalist E-Commerce',
  description: 'Single-vendor e-commerce platform with Neo-Brutalism design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </main>
          <Footer />
          <CartSlideOver />
          <LoginModal />
          <ProfileSettingsModal />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
