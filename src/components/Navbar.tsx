import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Coffee, Calendar, MapPin, Globe } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface NavbarProps {
  currentPage: 'home' | 'menu';
  onNavigate: (page: 'home' | 'menu') => void;
  lang: 'en' | 'fr';
  setLang: (lang: 'en' | 'fr') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, lang, setLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(currentPage === 'menu' ? '#menu-page' : '');

  useEffect(() => {
    if (currentPage === 'menu') {
      setActiveSection('#menu-page');
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const locationEl = document.getElementById('location');
      const galleryEl = document.getElementById('gallery');
      
      if (locationEl) {
        const rect = locationEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 100) {
          setActiveSection('#location');
          return;
        }
      }
      
      if (galleryEl) {
        const rect = galleryEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 100) {
          setActiveSection('#gallery');
          return;
        }
      }

      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleLinkClick = (href: string) => {
    soundEngine.playChime(480, 'sine', 0.08);
    setMobileMenuOpen(false);

    if (href === '#menu-page') {
      setActiveSection('#menu-page');
      onNavigate('menu');
      window.scrollTo(0, 0);
      return;
    }

    setActiveSection(href);

    if (currentPage === 'menu') {
      onNavigate('home');
      setTimeout(() => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '#menu-page', labelEn: 'Menu & Food', labelFr: 'La Carte' },
    { href: '#gallery', labelEn: 'Photo Gallery', labelFr: 'Galerie Photos' },
    { href: '#location', labelEn: 'Location & Hours', labelFr: 'Accès & Horaires' },
  ];

  const drawerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
        when: 'afterChildren',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 24,
      },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b-2 border-[#18181B] py-3 shadow-sm'
          : 'bg-[#FAF9F6] border-b border-[#18181B]/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => {
              soundEngine.playChime(520, 'sine', 0.1);
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer text-left bg-transparent border-0 p-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center font-display font-black text-xl text-[#18181B] shadow-[2px_2px_0px_#18181B] group-hover:bg-[#FACC15] transition-colors">
              ☕
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-[#18181B] leading-none">
                SLAKE<span className="text-[#FACC15]">.</span>
              </span>
              <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-widest leading-tight">
                Annecy
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isMenuLink = link.href === '#menu-page';
              const isActive =
                (isMenuLink && currentPage === 'menu') ||
                (!isMenuLink && currentPage === 'home' && activeSection === link.href);

              return (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-sm font-bold transition-all relative py-1 cursor-pointer bg-transparent border-b-2 ${
                    isActive
                      ? 'text-[#18181B] border-[#18181B]'
                      : 'text-[#52525B] hover:text-[#18181B] border-transparent'
                  }`}
                >
                  {lang === 'en' ? link.labelEn : link.labelFr}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => {
                soundEngine.playChime(550, 'sine', 0.1);
                setLang(lang === 'en' ? 'fr' : 'en');
              }}
              className="px-3 py-1.5 rounded-xl border-2 border-[#18181B] bg-white hover:bg-[#FFFBEB] text-xs font-black uppercase text-[#18181B] flex items-center gap-1.5 shadow-[2px_2px_0px_#18181B] cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Primary Action Button (Menu Page or Home Page) */}
            {currentPage === 'home' ? (
              <button
                onClick={() => {
                  soundEngine.playChime(640, 'sine', 0.15);
                  onNavigate('menu');
                  window.scrollTo(0, 0);
                }}
                className="btn-yellow px-5 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Full Menu' : 'La Carte'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.playChime(520, 'sine', 0.15);
                  onNavigate('home');
                  window.scrollTo(0, 0);
                }}
                className="btn-white px-5 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <span>{lang === 'en' ? 'Overview' : 'Accueil'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playChime(550, 'sine', 0.1);
                setLang(lang === 'en' ? 'fr' : 'en');
              }}
              className="px-2.5 py-1 rounded-lg border border-[#18181B] bg-white text-xs font-bold"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-[#18181B] shadow-[2px_2px_0px_#18181B]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="sm:hidden bg-white border-b-2 border-[#18181B] px-6 py-5 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isMenuLink = link.href === '#menu-page';
                const isActive =
                  (isMenuLink && currentPage === 'menu') ||
                  (!isMenuLink && currentPage === 'home' && activeSection === link.href);

                return (
                  <motion.button
                    key={link.href}
                    variants={itemVariants}
                    onClick={() => handleLinkClick(link.href)}
                    className={`text-left text-base font-bold py-2 border-b-2 cursor-pointer transition-colors bg-transparent ${
                      isActive
                        ? 'text-[#18181B] border-[#18181B]'
                        : 'text-[#52525B] hover:text-[#18181B] border-transparent'
                    }`}
                  >
                    {lang === 'en' ? link.labelEn : link.labelFr}
                  </motion.button>
                );
              })}
            </nav>

            <motion.div variants={itemVariants}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(currentPage === 'home' ? 'menu' : 'home');
                  window.scrollTo(0, 0);
                }}
                className="w-full btn-yellow py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <Coffee className="w-4 h-4" />
                <span>
                  {currentPage === 'home'
                    ? (lang === 'en' ? 'Explore Full Menu' : 'Découvrir Toute la Carte')
                    : (lang === 'en' ? 'Back to Overview' : 'Retour à l’Accueil')}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
