import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, Heart, Sun, Award, Check, Sparkles, Droplet } from 'lucide-react';
import { COFFEE_ROASTS } from '../data/restaurantData';
import { soundEngine } from '../utils/audioSynth';

interface StoryAndCoffeeProps {
  lang: 'en' | 'fr';
}

export const StoryAndCoffee: React.FC<StoryAndCoffeeProps> = ({ lang }) => {
  const [selectedRoast, setSelectedRoast] = useState(0);

  const commitments = [
    {
      titleEn: '100% Homemade Baking',
      titleFr: 'Boulangerie & Pâtisserie 100% Maison',
      descEn: 'English muffins, fluffy pancakes, carrot cakes and braided babkas baked fresh daily on site.',
      descFr: 'Muffins anglais, pancakes moelleux, carrot cakes et babkas pétris et cuits sur place.',
    },
    {
      titleEn: 'Alpine Local Farm Sourcing',
      titleFr: 'Circuits Courts & Terroir Alpin',
      descEn: 'Smoked lake trout from Haute-Savoie waters, pasture-raised organic eggs and mountain honey.',
      descFr: 'Truite fumée des rivières alpines, œufs bio plein air et miels de montagne.',
    },
    {
      titleEn: 'Obsessed with Coffee Purity',
      titleFr: 'Passionnés de Café de Spécialité',
      descEn: 'Direct-trade single origin beans calibrated every morning for sweet, clean, fruit-forward cups.',
      descFr: 'Grains de spécialité sourcés éthiquement, calibrés chaque matin pour des tasses douces et fruitées.',
    },
  ];

  return (
    <section id="story" className="py-20 bg-[#FAF9F6] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dual Bento Grid: Left Story, Right Specialty Coffee */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Human Story & Ethos */}
          <div className="lg:col-span-6 card-modern p-7 sm:p-9 bg-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="badge-yellow">
                <Heart className="w-3.5 h-3.5 fill-[#18181B]" />
                <span>{lang === 'en' ? 'Our Story' : 'Notre Histoire'}</span>
              </span>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#18181B] tracking-tight leading-snug">
                {lang === 'en'
                  ? 'Born from a Love of Specialty Coffee & Generous Food.'
                  : 'Né d’un Amour pour le Café Pur & la Cuisine Généreuse.'}
              </h2>

              <p className="text-sm text-[#52525B] leading-relaxed font-medium">
                {lang === 'en'
                  ? 'Located just steps from Lake Annecy, SLAKE is a sun-filled cafe designed for people who appreciate quality coffee, comforting homemade brunch, and friendly welcomes. We believe good food starts with honest ingredients from nearby farms.'
                  : 'Situé à deux pas du lac d’Annecy, SLAKE est un lieu chaleureux pensé pour les amoureux de bon café, de brunch réconfortant et d’accueil souriant. Chaque plat est préparé avec des ingrédients sains de fermes locales.'}
              </p>

              {/* Inspiring Founders Quote Card */}
              <div className="p-6 rounded-2xl bg-[#FFFBEB] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] relative overflow-hidden my-3">
                <div className="absolute -top-2 right-4 text-7xl font-serif text-amber-300/40 pointer-events-none select-none">
                  “
                </div>
                <blockquote className="relative z-10 space-y-3">
                  <p className="font-serif italic text-sm sm:text-base text-[#18181B] leading-relaxed">
                    {lang === 'en'
                      ? '“We created SLAKE as a sanctuary for slow mornings in Annecy — where specialty coffee is dialed with precision, where brioche is still warm from the oven, and where every egg comes from alpine farms we know by name.”'
                      : '“Nous avons imaginé SLAKE comme un sanctuaire pour les matins doux à Annecy — où le café de spécialité est extrait avec précision, la brioche tout juste dorée au four, et chaque ingrédient issu de nos terroirs alpins.”'}
                  </p>
                  <footer className="flex items-center gap-3 pt-2.5 border-t border-amber-200">
                    <div className="w-8 h-8 rounded-full bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center font-bold text-xs shrink-0 shadow-[1px_1px_0px_#18181B]">
                      ☕
                    </div>
                    <div>
                      <cite className="not-italic font-display font-black text-xs text-[#18181B] block">
                        {lang === 'en' ? 'The SLAKE Team' : 'L’Équipe SLAKE'}
                      </cite>
                      <span className="text-[10px] text-[#71717A] font-bold">
                        {lang === 'en' ? 'Artisan Roasters & Kitchen, Annecy' : 'Torréfacteurs & Cuisine Artisanale, Annecy'}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-[#52525B] font-bold">
              <span>📍 Central Annecy</span>
              <span className="text-[#18181B] font-black">☀️ 300m to Lake Annecy</span>
            </div>
          </div>

          {/* Right Column: Specialty Coffee Bar & Roasts */}
          <div className="lg:col-span-6 card-modern-yellow p-7 sm:p-9 bg-[#FFFBEB] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-white">
                  <Coffee className="w-3.5 h-3.5 text-[#18181B]" />
                  <span>{lang === 'en' ? 'Coffee Program' : 'Café de Spécialité'}</span>
                </span>
                <span className="text-xs font-mono font-black bg-white px-3 py-1 rounded-full border border-[#18181B]">
                  Score 89+ Cupping
                </span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#18181B] tracking-tight leading-snug">
                {lang === 'en'
                  ? 'Light Roast, Pure Origin Terroir.'
                  : 'Torréfaction Douce & Terroirs d’Exception.'}
              </h3>

              <p className="text-sm text-[#52525B] leading-relaxed font-medium">
                {lang === 'en'
                  ? 'We never roast dark or bitter. Light-to-medium profiles preserve sparkling acidity, delicate florals, and natural berry sweetness.'
                  : 'Une torréfaction claire qui respecte la douceur naturelle du grain, les notes florales et le fruit sans aucune amertume.'}
              </p>

              {/* Interactive Bean Selector */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-black uppercase text-[#52525B] tracking-wider">
                  {lang === 'en' ? 'Current Micro-Lots on Tap:' : 'Nos Micro-Lots du Moment :'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {COFFEE_ROASTS.map((roast, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEngine.playChime(500 + idx * 60, 'sine', 0.1);
                        setSelectedRoast(idx);
                      }}
                      className={`p-3 rounded-xl text-left border-2 border-[#18181B] transition-all cursor-pointer ${
                        selectedRoast === idx
                          ? 'bg-[#FFE248] shadow-[2px_2px_0px_#18181B]'
                          : 'bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-[#52525B] block">
                        {roast.cuppingScore} PTS
                      </span>
                      <h5 className="font-display font-black text-xs text-[#18181B] line-clamp-1">
                        {roast.name.split(' ')[0]}
                      </h5>
                    </button>
                  ))}
                </div>

                {/* Active Roast Details */}
                <div className="p-4 rounded-xl bg-white border-2 border-[#18181B] space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-black text-sm text-[#18181B]">
                      {COFFEE_ROASTS[selectedRoast].name}
                    </h5>
                    <span className="text-xs font-mono text-[#52525B]">
                      {COFFEE_ROASTS[selectedRoast].altitude}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {COFFEE_ROASTS[selectedRoast].flavorNotes.map((note, nIdx) => (
                      <span key={nIdx} className="bg-[#FAF9F6] border border-zinc-200 text-[#18181B] text-[10px] font-bold px-2 py-0.5 rounded">
                        {note}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#52525B] pt-1">
                    <strong>Barista Note:</strong> {COFFEE_ROASTS[selectedRoast].baristaTip}
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs text-[#52525B]">
              <span>Synesso MVP Hydra & Mahlkönig EK43</span>
              <span className="font-bold text-[#18181B]">Minor Figures Oat Milk Available</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
