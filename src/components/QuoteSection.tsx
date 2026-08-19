import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Coffee, ArrowRight, MapPin } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useCms } from '../context/CmsContext';

interface QuoteSectionProps {
  lang: 'en' | 'fr';
  onNavigateToMenu: () => void;
  onOpenLocation: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ lang, onNavigateToMenu, onOpenLocation }) => {
  const { data } = useCms();
  const about = data.aboutContent;

  return (
    <section id="quote" className="py-24 bg-[#FAF9F6] border-y-2 border-[#18181B] relative overflow-hidden">
      
      {/* Background Decorative Ambient Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FFE248]/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFE248] text-[#18181B] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B]">
            <Sparkles className="w-3.5 h-3.5 fill-[#18181B]" />
            <span>{lang === 'en' ? (about.badgeEn || 'Our Guiding Philosophy') : (about.badgeFr || 'Notre Philosophie')}</span>
          </div>

          {/* Quote Card */}
          <div className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-white border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] text-center">
            
            {/* Big Decorative Quotation Mark */}
            <div className="absolute top-4 left-6 sm:left-10 text-6xl sm:text-8xl font-serif text-amber-200/50 pointer-events-none select-none leading-none">
              “
            </div>

            <blockquote className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#18181B] leading-relaxed">
                {lang === 'en' ? about.quoteEn : about.quoteFr}
              </p>

              <div className="pt-6 border-t-2 border-zinc-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-lg shadow-[2px_2px_0px_#18181B] shrink-0">
                  ☕
                </div>
                <div className="text-center sm:text-left">
                  <cite className="not-italic font-display font-black text-base text-[#18181B] block">
                    {lang === 'en' ? (about.teamSignatureEn || 'The SLAKE Team') : (about.teamSignatureFr || 'L’Équipe SLAKE')}
                  </cite>
                  <span className="text-xs text-[#71717A] font-bold flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>{about.locationTag || 'Annecy, France'}</span>
                  </span>
                </div>
              </div>
            </blockquote>

          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                soundEngine.playChime(620, 'sine', 0.1);
                onNavigateToMenu();
              }}
              className="btn-yellow px-6 py-3 text-xs sm:text-sm font-black uppercase flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181B]"
            >
              <span>{lang === 'en' ? (about.ctaMenuEn || 'Explore Full Menu') : (about.ctaMenuFr || 'Découvrir la Carte Complète')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(500, 'sine', 0.08);
                onOpenLocation();
              }}
              className="btn-white px-6 py-3 text-xs sm:text-sm font-black uppercase flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181B]"
            >
              <MapPin className="w-4 h-4" />
              <span>{lang === 'en' ? (about.ctaLocationEn || 'Find the Café (3 min from Lake)') : (about.ctaLocationFr || 'Nous Trouver (à 3 min du Lac)')}</span>
            </button>
          </div>

        </motion.div>
      </div>

    </section>
  );
};
