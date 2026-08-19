import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, ChevronRight, ChevronLeft, Eye, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { useCms } from '../context/CmsContext';

interface MenuTeaserProps {
  lang: 'en' | 'fr';
  onNavigateToMenu: () => void;
  onSelectDish: (dish: MenuItem) => void;
}

export const MenuTeaser: React.FC<MenuTeaserProps> = ({ lang, onNavigateToMenu, onSelectDish }) => {
  const { data } = useCms();
  
  // Select top signature/featured items from CMS
  const signatureItems = (
    data.menuItems.filter((item) => item.isFeaturedTeaser || item.isSignature || item.isSeasonal).length > 0
      ? data.menuItems.filter((item) => item.isFeaturedTeaser || item.isSignature || item.isSeasonal)
      : data.menuItems
  ).slice(0, 6);
  
  const [cards, setCards] = useState(signatureItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sync cards when CMS updates
  useEffect(() => {
    setCards(signatureItems);
  }, [data.menuItems]);

  // Automatic card stacker cycling timer (pauses when hovering)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNextCard(false);
    }, 3200);
    return () => clearInterval(interval);
  }, [isHovered, cards.length]);

  const handleNextCard = (playSound = true) => {
    if (playSound) {
      soundEngine.playChime(600, 'sine', 0.1);
    }
    setCards((prevCards) => {
      const next = [...prevCards];
      const first = next.shift();
      if (first) next.push(first);
      return next;
    });
    setActiveIndex((prev) => (prev + 1) % signatureItems.length);
  };

  const handlePrevCard = () => {
    soundEngine.playChime(480, 'sine', 0.1);
    setCards((prevCards) => {
      const next = [...prevCards];
      const last = next.pop();
      if (last) next.unshift(last);
      return next;
    });
    setActiveIndex((prev) => (prev - 1 + signatureItems.length) % signatureItems.length);
  };

  const tickerHighlights = [
    { labelEn: '🥯 House Egg & Bacon Muffin', labelFr: '🥯 Muffin Anglais Maison Bacon & Œuf' },
    { labelEn: '🥑 Turkish Farm Eggs & Chili Oil', labelFr: '🥑 Œufs à la Turque & Pain Plat Maison' },
    { labelEn: '🥞 Fluffy Buttermilk Pancakes', labelFr: '🥞 Pancakes Moelleux au Babeurre' },
    { labelEn: '🥪 12h Caramel Pork Sandwich', labelFr: '🥪 Sandwich Slake Porc Caramel 12h' },
    { labelEn: '☕ Single-Origin V60 Pour-Over', labelFr: '☕ V60 Éthiopie Pure Origine' },
    { labelEn: '🦢 Velvet Flat White & Latte Art', labelFr: '🦢 Flat White Velouté & Swan Art' },
  ];

  return (
    <section id="menu-teaser" className="py-20 bg-[#FAF9F6] border-y-2 border-[#18181B] relative overflow-hidden">
      
      {/* Background Animated Subtle Blurs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#FFE248]/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
        >
          <div className="badge-yellow mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Kitchen & Coffee Highlights' : 'Nos Plats & Boissons Phares'}</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#18181B] tracking-tight leading-tight">
            {lang === 'en' ? (
              <>
                Signature Creations <br className="hidden sm:inline" />
                <span className="bg-[#FFE248] px-3 py-0.5 rounded-2xl border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] inline-block mt-1">
                  Crafted Daily.
                </span>
              </>
            ) : (
              <>
                Recettes Signatures <br className="hidden sm:inline" />
                <span className="bg-[#FFE248] px-3 py-0.5 rounded-2xl border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] inline-block mt-1">
                  Cuisinées à Annecy.
                </span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#52525B] font-medium max-w-lg mx-auto">
            {lang === 'en'
              ? 'A seasonal glimpse into our morning baking, farm eggs, and dialed specialty roasts.'
              : 'Un aperçu de nos fournées matinales, œufs fermiers et cafés de terroir soigneusement extraits.'}
          </p>
        </motion.div>

        {/* Card Stage Area */}
        <div
          className="max-w-4xl mx-auto mb-14"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Dish Counter & Next/Prev Controls Bar */}
          <div className="flex items-center justify-between gap-3 mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#18181B] text-[#FFE248] px-3 py-1 rounded-full text-xs font-mono font-black border border-[#18181B]">
                {activeIndex + 1} / {signatureItems.length}
              </span>
              <span className="text-xs font-bold text-[#71717A] hidden sm:inline">
                {lang === 'en' ? '• Freshly prepared & baked daily' : '• Préparé & cuit chaque matin'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B] flex items-center justify-center text-[#18181B] hover:bg-[#FFE248] active:translate-y-0.5 cursor-pointer transition-all"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleNextCard(true)}
                className="w-9 h-9 rounded-xl bg-[#FFE248] border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B] flex items-center justify-center text-[#18181B] hover:bg-[#FACC15] active:translate-y-0.5 cursor-pointer transition-all"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* React Bits Stacking Deck Container */}
          <div className="relative h-[340px] sm:h-[300px] w-full flex items-center justify-center perspective-1000">
            {cards.map((item, index) => {
              const isFront = index === 0;
              const offset = index;
              // React Bits Card Stacker scaling and offset math
              const scale = 1 - offset * 0.045;
              const translateY = offset * 14;
              const rotate = (index % 2 === 0 ? 1 : -1) * offset * 1.8;
              const zIndex = cards.length - index;
              const opacity = offset > 3 ? 0 : 1 - offset * 0.15;

              return (
                <motion.div
                  key={item.id}
                  layout
                  drag={isFront ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
                      handleNextCard(true);
                    }
                  }}
                  animate={{
                    scale,
                    y: translateY,
                    rotate,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                  }}
                  onClick={() => {
                    if (!isFront) {
                      handleNextCard(true);
                    }
                  }}
                  className={`absolute w-full max-w-xl p-6 sm:p-7 rounded-2xl border-2 border-[#18181B] transition-shadow duration-200 select-none ${
                    isFront
                      ? 'bg-white shadow-[6px_6px_0px_#18181B] cursor-grab active:cursor-grabbing hover:border-black'
                      : 'bg-[#FAF9F6] shadow-[4px_4px_0px_#18181B] cursor-pointer hover:bg-white'
                  }`}
                  style={{
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Card Header: Badges, Title, Price */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isSignature && (
                            <span className="inline-flex items-center gap-1 bg-[#FFE248] text-[#18181B] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-[#18181B]">
                              <Sparkles className="w-3 h-3 fill-[#18181B]" />
                              <span>Signature</span>
                            </span>
                          )}
                          {item.isSeasonal && (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              {lang === 'en' ? 'Seasonal' : 'De Saison'}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-black text-xl sm:text-2xl text-[#18181B] leading-tight">
                          {lang === 'en' ? item.name : item.frenchName || item.name}
                        </h3>

                        {lang === 'en' && item.frenchName && (
                          <p className="text-xs text-[#71717A] italic font-serif">
                            {item.frenchName}
                          </p>
                        )}
                      </div>

                      {/* Price Pill */}
                      <span className="shrink-0 bg-[#FFE248] border-2 border-[#18181B] px-3.5 py-1 rounded-xl text-base font-black font-mono text-[#18181B] shadow-[2px_2px_0px_#18181B]">
                        {item.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom: Tags and Action */}
                  <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-white border border-zinc-200 text-[#52525B] px-2.5 py-0.5 rounded text-[10px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playChime(620, 'sine', 0.1);
                          onSelectDish(item);
                        }}
                        className="btn-white px-3.5 py-1.5 text-[11px] font-black uppercase flex items-center gap-1 cursor-pointer hover:bg-[#FFE248] shadow-[1px_1px_0px_#18181B]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{lang === 'en' ? 'Details' : 'Détails'}</span>
                      </button>

                      {isFront && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextCard(true);
                          }}
                          className="btn-yellow px-3.5 py-1.5 text-[11px] font-black uppercase flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#18181B]"
                        >
                          <span>{lang === 'en' ? 'Next' : 'Suivante'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Scroll-Revealed Dynamic CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="card-modern p-6 sm:p-8 bg-[#FFE248] border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#18181B] text-xs font-black uppercase text-[#18181B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Full 30+ Item Menu Available' : 'Carte Complète 30+ Recettes'}</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#18181B]">
              {lang === 'en' ? 'Ready to discover our full menu?' : 'Envie de voir tous nos plats et boissons ?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#18181B]/80 font-medium max-w-xl">
              {lang === 'en'
                ? 'Explore all savory muffin bowls, sweet pancake stacks, homemade viennoiseries, filter pour-overs, and cold specialty brews on our dedicated menu page.'
                : 'Retrouvez nos muffins salés, pancakes sucrés, viennoiseries maison, cafés filtres et boissons fraîches sur la page dédiée.'}
            </p>
          </div>

          <button
            onClick={() => {
              soundEngine.playChime(640, 'sine', 0.15);
              onNavigateToMenu();
            }}
            className="btn-white px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shrink-0 shadow-[3px_3px_0px_#18181B] hover:bg-zinc-50 active:translate-y-0.5"
          >
            <span>{lang === 'en' ? 'View Full Menu Page' : 'Voir Toute la Carte'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Highlight Moving Marquee Ticker */}
        <div className="mt-10 overflow-hidden py-3 bg-white border-2 border-[#18181B] rounded-2xl shadow-[2px_2px_0px_#18181B]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...tickerHighlights, ...tickerHighlights].map((item, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-2"
              >
                <span>{lang === 'en' ? item.labelEn : item.labelFr}</span>
                <span className="text-[#FACC15]">✦</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

