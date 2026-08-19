/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CmsProvider } from './context/CmsContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { MenuTeaser } from './components/MenuTeaser';
import { QuoteSection } from './components/QuoteSection';
import { MenuPage } from './components/MenuPage';
import { GalleryAndReviews } from './components/GalleryAndReviews';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { DishDetailModal } from './components/DishDetailModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { MenuItem } from './types';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Synchronize URL pathname / hash with admin and page state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setCurrentPage('admin');
      } else if (path === '/menu' || hash === '#menu-page') {
        setCurrentPage('menu');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleOpenLocation = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const el = document.getElementById('location');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById('location');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToMenu = () => {
    setCurrentPage('menu');
    window.scrollTo(0, 0);
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo(0, 0);
  };

  // If in Admin mode, render Admin Portal
  if (currentPage === 'admin') {
    return (
      <AdminPortal
        onBackToSite={() => {
          window.history.pushState({}, '', '/');
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#18181B] flex flex-col selection:bg-[#FFE248] selection:text-[#18181B]">
      
      {/* Navigation */}
      <Navbar
        currentPage={currentPage === 'menu' ? 'menu' : 'home'}
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page === 'home') {
            window.history.pushState({}, '', '/');
          }
        }}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          <div>
            {/* Hero */}
            <Hero
              onOpenMenu={handleNavigateToMenu}
              onOpenLocation={handleOpenLocation}
              lang={lang}
            />

            {/* Highlight Ticker */}
            <MarqueeTicker lang={lang} />

            {/* Signature Creations Cards */}
            <MenuTeaser
              lang={lang}
              onNavigateToMenu={handleNavigateToMenu}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* Inspiring Philosophy Quote & Quick Navigation */}
            <QuoteSection
              lang={lang}
              onNavigateToMenu={handleNavigateToMenu}
              onOpenLocation={handleOpenLocation}
            />

            {/* Real Photo Gallery & Verified Google Reviews */}
            <GalleryAndReviews lang={lang} />

            {/* Location & Hours & Café Info (No Reservation Section) */}
            <LocationHours lang={lang} />
          </div>
        ) : (
          <div>
            {/* Dedicated Full Menu Page */}
            <MenuPage
              lang={lang}
              onNavigateHome={handleNavigateToHome}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Dish Inspection Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        lang={lang}
      />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <MainApp />
    </CmsProvider>
  );
}

