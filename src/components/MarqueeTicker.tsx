import React from 'react';

interface MarqueeProps {
  lang: 'en' | 'fr';
}

export const MarqueeTicker: React.FC<MarqueeProps> = ({ lang }) => {
  const items = [
    { text: lang === 'en' ? '🥞 FLUFFY BUTTERMILK PANCAKES' : '🥞 PANCAKES MOELLEUX MAISON' },
    { text: lang === 'en' ? '☕ 100% SPECIALTY COFFEE' : '☕ CAFÉ DE SPÉCIALITÉ SOURCÉ' },
    { text: lang === 'en' ? '🍳 ORGANIC TURKISH EGGS' : '🍳 ŒUFS BIO À LA TURQUE' },
    { text: lang === 'en' ? '🍞 HOMEMADE ENGLISH MUFFINS' : '🍞 MUFFINS ANGLAIS DU CHEF' },
    { text: lang === 'en' ? '🐟 SMOKED LOCAL LAKE TROUT' : '🐟 TRUITE FUMÉE DU TERROIR ALPIN' },
    { text: lang === 'en' ? '🥕 LEGENDARY SPICED CARROT CAKE' : '🥕 CARROT CAKE MAISON' },
    { text: lang === 'en' ? '☀️ 300M TO LAKE ANNECY' : '☀️ À 300M DU LAC D’ANNECY' },
  ];

  return (
    <div className="bg-[#FFE248] text-[#18181B] py-3 border-y-2 border-[#18181B] overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-display font-extrabold tracking-wider uppercase">
        {items.concat(items).map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            <span>{item.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
};
