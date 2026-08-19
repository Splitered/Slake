import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, MapPin, Coffee, Utensils, Clock, Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useOpeningStatus } from '../hooks/useOpeningStatus';
import { useCms } from '../context/CmsContext';

interface HeroProps {
  onOpenMenu: () => void;
  onOpenLocation: () => void;
  lang: 'en' | 'fr';
}

export const Hero: React.FC<HeroProps> = ({ onOpenMenu, onOpenLocation, lang }) => {
  const openingStatus = useOpeningStatus();
  const { data } = useCms();
  const hero = data.heroContent;
  const info = data.restaurantInfo;

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Subtitle, Key Badges, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="badge-yellow">
                <Star className="w-3.5 h-3.5 fill-[#18181B]" />
                <span>
                  {info.googleRating} ★ ({info.reviewsCount}+ {lang === 'en' ? 'Reviews' : 'Avis'})
                </span>
              </span>

              <span className="badge-white">
                <MapPin className="w-3.5 h-3.5 text-[#18181B]" />
                <span>{lang === 'en' ? 'Annecy • 3 min to Lake' : 'Annecy • 3 min du Lac'}</span>
              </span>

              {/* Dynamic Real-time Opening Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                openingStatus.isCafeOpen 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${openingStatus.isCafeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>
                  {lang === 'en' ? openingStatus.badgeStatusEn : openingStatus.badgeStatusFr}
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl sm:text-6xl text-[#18181B] tracking-tight leading-[1.08]">
                {lang === 'en' ? (
                  <>
                    {hero.headlineEn} <br />
                    <span className="inline-block bg-[#FFE248] px-3 py-0.5 rounded-2xl border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] rotate-[-1deg]">
                      {hero.headlineHighlightEn}
                    </span>{' '}
                    {hero.headlineEndEn}
                  </>
                ) : (
                  <>
                    {hero.headlineFr} <br />
                    <span className="inline-block bg-[#FFE248] px-3 py-0.5 rounded-2xl border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] rotate-[-1deg]">
                      {hero.headlineHighlightFr}
                    </span>{' '}
                    {hero.headlineEndFr}
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#52525B] font-medium max-w-xl leading-relaxed pt-2">
                {lang === 'en' ? hero.subtitleEn : hero.subtitleFr}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playChime(620, 'sine', 0.15);
                  onOpenMenu();
                }}
                className="btn-yellow px-7 py-3.5 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181B]"
              >
                <Utensils className="w-4 h-4" />
                <span>{lang === 'en' ? (hero.ctaPrimaryEn || 'Explore Full Menu') : (hero.ctaPrimaryFr || 'Découvrir la Carte')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundEngine.playChime(580, 'sine', 0.15);
                  onOpenLocation();
                }}
                className="btn-white px-7 py-3.5 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <MapPin className="w-4 h-4" />
                <span>{lang === 'en' ? (hero.ctaSecondaryEn || 'Location & Hours') : (hero.ctaSecondaryFr || 'Accès & Horaires')}</span>
              </button>
            </div>

            {/* Key Quality Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200">
              <div className="space-y-0.5">
                <span className="font-display font-black text-xl text-[#18181B]">{hero.highlight1Value}</span>
                <p className="text-xs text-[#52525B] font-medium leading-tight">
                  {lang === 'en' ? hero.highlight1LabelEn : hero.highlight1LabelFr}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="font-display font-black text-xl text-[#18181B]">{hero.highlight2Value}</span>
                <p className="text-xs text-[#52525B] font-medium leading-tight">
                  {lang === 'en' ? hero.highlight2LabelEn : hero.highlight2LabelFr}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="font-display font-black text-xl text-[#18181B]">{hero.highlight3Value}</span>
                <p className="text-xs text-[#52525B] font-medium leading-tight">
                  {lang === 'en' ? hero.highlight3LabelEn : hero.highlight3LabelFr}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Real Photo Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative card-modern overflow-hidden bg-white p-3 shadow-[5px_5px_0px_#18181B]">
              
              {/* Main Photo (Real Brunch & Coffee) */}
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-zinc-100 border-2 border-[#18181B]">
                <img
                  src={hero.primaryImage}
                  alt="Slake Annecy Specialty Coffee & Brunch"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating pill badge on photo */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border-2 border-[#18181B] text-[11px] font-black uppercase text-[#18181B] shadow-[2px_2px_0px_#18181B]">
                  {lang === 'en' ? hero.primaryImageBadgeEn : hero.primaryImageBadgeFr}
                </div>

                <div className="absolute bottom-3.5 right-3.5 bg-[#FFE248] px-3.5 py-1.5 rounded-full border-2 border-[#18181B] text-xs font-black font-mono shadow-[2px_2px_0px_#18181B]">
                  Annecy Center • 74000
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
