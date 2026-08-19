import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, Coffee, Utensils, ShieldCheck, MapPin, ChefHat, Ban } from 'lucide-react';
import { MenuItem } from '../types';
import { soundEngine } from '../utils/audioSynth';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  lang: 'en' | 'fr';
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, lang }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!dish) return null;

  const handleClose = () => {
    soundEngine.playChime(420, 'sine', 0.08);
    onClose();
  };

  const isUnavailable = dish.isAvailable === false || dish.isSoldOut === true;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative max-w-xl w-full card-modern bg-white overflow-hidden my-6 shadow-[6px_6px_0px_#18181B]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dish Hero Image if present */}
          {dish.image && (
            <div className="relative h-48 sm:h-56 bg-zinc-100 overflow-hidden border-b-2 border-[#18181B]">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              {isUnavailable && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider border-2 border-white shadow-md flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Sold Out Today' : 'Épuisé Aujourd’hui'}</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-[#18181B] font-black cursor-pointer shadow-sm hover:bg-amber-300 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-7 space-y-5">
            {/* Title, Badges, and Price */}
            <div className="flex items-start justify-between gap-3 pr-8">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {dish.isSignature && (
                    <span className="inline-flex items-center gap-1 bg-[#FFE248] text-[#18181B] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#18181B]">
                      <Sparkles className="w-3 h-3 fill-[#18181B]" />
                      <span>Signature</span>
                    </span>
                  )}
                  {dish.isSeasonal && (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {lang === 'en' ? 'Seasonal' : 'Saison'}
                    </span>
                  )}
                  {isUnavailable && !dish.image && (
                    <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {lang === 'en' ? 'Sold Out Today' : 'Épuisé Aujourd’hui'}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-[#18181B] leading-tight">
                  {lang === 'en' ? dish.name : dish.frenchName || dish.name}
                </h3>
                {lang === 'en' && dish.frenchName && (
                  <p className="text-xs sm:text-sm text-[#71717A] italic font-serif">
                    {dish.frenchName}
                  </p>
                )}
              </div>

              <div className="bg-[#FFE248] border-2 border-[#18181B] px-3.5 py-1.5 rounded-xl text-base font-black font-mono shadow-[2px_2px_0px_#18181B] shrink-0">
                {dish.price}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#3F3F46] leading-relaxed">
              {dish.description}
            </p>

            {/* Coffee Origin & Cupping details if drink */}
            {dish.origin && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200 text-xs space-y-1">
                <span className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  {lang === 'en' ? 'Terroir & Extraction Profile' : 'Origine & Profil d’Extraction'}
                </span>
                <p className="text-[#52525B] font-mono">{dish.origin}</p>
              </div>
            )}

            {/* Chef Tip */}
            {dish.chefTip && (
              <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-amber-300 text-xs space-y-1">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-amber-800" />
                  {lang === 'en' ? 'Chef’s Tasting Advice' : 'Conseil de Dégustation'}
                </span>
                <p className="text-amber-900 italic leading-relaxed">"{dish.chefTip}"</p>
              </div>
            )}

            {/* Dietary Tags & Allergens */}
            <div className="pt-2 border-t border-zinc-200 space-y-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-zinc-500 mr-1">
                  {lang === 'en' ? 'Tags:' : 'Tags :'}
                </span>
                {dish.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#FAF9F6] border border-zinc-300 text-[#18181B] px-2 py-0.5 rounded text-[10px] font-bold">
                    {t}
                  </span>
                ))}
              </div>

              <div className="text-xs text-[#71717A] flex items-start gap-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'en' ? 'Allergens:' : 'Allergènes :'}</strong>{' '}
                  {dish.allergens && dish.allergens.length > 0
                    ? dish.allergens.join(', ')
                    : (lang === 'en' ? 'No major allergens recorded' : 'Aucun allergène majeur')}
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full btn-yellow py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-black"
              >
                <span>{lang === 'en' ? 'Close Dish Details' : 'Fermer la Fiche'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

