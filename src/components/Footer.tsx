import React, { useState } from 'react';
import { ArrowUp, Instagram, MapPin, Phone, Mail, Send } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useCms } from '../context/CmsContext';

interface FooterProps {
  lang: 'en' | 'fr';
  onNavigate: (page: 'home' | 'menu') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { data } = useCms();
  const info = data.restaurantInfo;
  const socials = data.socialLinks;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundEngine.playSuccessTone();
    setSubscribed(true);
  };

  const scrollToTop = () => {
    soundEngine.playChime(650, 'sine', 0.15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (href: string) => {
    soundEngine.playChime(480, 'sine', 0.08);
    if (href === '#menu-page') {
      onNavigate('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onNavigate('home');
    setTimeout(() => {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#FFE248] border-t-2 border-[#18181B] text-[#18181B] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border-2 border-[#18181B] flex items-center justify-center font-display font-black text-base shadow-[1px_1px_0px_#18181B]">
                ☕
              </div>
              <span className="font-display font-black text-xl tracking-tight text-[#18181B]">
                SLAKE<span className="text-[#18181B]">.</span>
              </span>
            </div>
            <p className="text-xs font-medium text-[#18181B]/80 leading-relaxed">
              {lang === 'en'
                ? 'Specialty coffee, artisan brunch, and fresh baking in the heart of Annecy.'
                : 'Café de spécialité, brunch fait maison et douceurs fraîches au cœur d’Annecy.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md bg-white border border-[#18181B] flex items-center justify-center text-xs font-bold hover:bg-[#18181B] hover:text-white transition-colors"
                  title="Instagram"
                >
                  IG
                </a>
              )}
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md bg-white border border-[#18181B] flex items-center justify-center text-xs font-bold hover:bg-[#18181B] hover:text-white transition-colors"
                  title="Facebook"
                >
                  FB
                </a>
              )}
              {socials.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md bg-white border border-[#18181B] flex items-center justify-center text-xs font-bold hover:bg-[#18181B] hover:text-white transition-colors"
                  title="TikTok"
                >
                  TT
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#18181B]">
              Navigation
            </h4>
            <ul className="space-y-1 text-xs font-bold">
              <li>
                <button
                  onClick={() => handleNav('#menu-page')}
                  className="hover:underline bg-transparent border-0 p-0 text-left cursor-pointer font-bold"
                >
                  {lang === 'en' ? 'Full Food Menu' : 'La Carte Complète'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('#gallery')}
                  className="hover:underline bg-transparent border-0 p-0 text-left cursor-pointer font-bold"
                >
                  {lang === 'en' ? 'Photo Gallery' : 'Galerie Photos'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('#location')}
                  className="hover:underline bg-transparent border-0 p-0 text-left cursor-pointer font-bold"
                >
                  {lang === 'en' ? 'Location & Hours' : 'Accès & Horaires'}
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#18181B]">
              {lang === 'en' ? 'Hours' : 'Horaires'}
            </h4>
            <div className="text-xs font-medium space-y-1 text-[#18181B]">
              {info.hours.map((h, i) => (
                <p key={i}>
                  <strong>{h.days}:</strong> {h.hours}
                </p>
              ))}
              {info.showSpecialNotice !== false && (
                <p className="text-[11px] text-[#18181B]/75 pt-0.5">
                  {lang === 'en' ? (info.specialNoticeEn || 'Continuous brunch on weekends.') : (info.specialNoticeFr || 'Brunch continu le week-end.')}
                </p>
              )}
            </div>
          </div>

          {/* Address & Contact */}
          <div className="space-y-2">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#18181B]">
              Contact
            </h4>
            <div className="text-xs font-medium space-y-0.5 text-[#18181B]">
              <p>{info.address}, {info.postalCode} {info.city}</p>
              <p><a href={`tel:${info.phone}`} className="hover:underline">{info.phone}</a></p>
              <p><a href={`mailto:${info.email}`} className="hover:underline">{info.email}</a></p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t-2 border-[#18181B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#18181B]">
          <p>© {new Date().getFullYear()} SLAKE Annecy. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="btn-white px-3 py-1.5 text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
          >
            <span>{lang === 'en' ? 'Back to top' : 'Haut de page'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
