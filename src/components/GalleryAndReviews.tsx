import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Star, CheckCircle, MapPin, X, ChevronLeft, ChevronRight, MessageSquare, Clock, Users, Sparkles, Utensils, Award, HeartHandshake, Volume2, ShieldCheck } from 'lucide-react';
import { Review } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { useCms } from '../context/CmsContext';

interface GalleryAndReviewsProps {
  lang: 'en' | 'fr';
}

export const GalleryAndReviews: React.FC<GalleryAndReviewsProps> = ({ lang }) => {
  const { data } = useCms();
  const GALLERY_IMAGES = data.galleryImages;
  const REVIEWS = data.reviews;

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Close modals with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedReview) setSelectedReview(null);
        if (activeLightboxIndex !== null) setActiveLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReview, activeLightboxIndex]);

  const openLightbox = (index: number) => {
    soundEngine.playChime(600, 'sine', 0.1);
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    soundEngine.playChime(420, 'sine', 0.08);
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      soundEngine.playChime(550, 'sine', 0.08);
      setActiveLightboxIndex((activeLightboxIndex + 1) % GALLERY_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      soundEngine.playChime(480, 'sine', 0.08);
      setActiveLightboxIndex((activeLightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  const handleReviewClick = (review: Review) => {
    soundEngine.playChime(640, 'sine', 0.12);
    setSelectedReview(review);
  };

  const closeReviewModal = () => {
    soundEngine.playChime(440, 'sine', 0.08);
    setSelectedReview(null);
  };

  return (
    <section id="gallery" className="py-20 bg-[#FAF9F6] border-b-2 border-[#18181B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="badge-yellow mx-auto">
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Atmosphere & Verified Reviews' : 'Ambiance & Avis Vérifiés'}</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#18181B] tracking-tight">
            {lang === 'en' ? 'Real Life at SLAKE Annecy' : 'La Vie Chez SLAKE Annecy'}
          </h2>

          <p className="text-sm sm:text-base text-[#52525B] font-medium">
            {lang === 'en'
              ? '4.9 ★ rating across 1,240+ verified Google Reviews from foodies, travelers & lake locals. Tap any review to view complete details.'
              : 'Note 4.9 ★ sur plus de 1 240 avis Google vérifiés. Cliquez sur un avis pour voir tous les détails.'}
          </p>
        </div>

        {/* 6 Clean Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {GALLERY_IMAGES.map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={() => openLightbox(idx)}
              className="card-modern overflow-hidden bg-white cursor-pointer group relative h-40 sm:h-48"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[10px] font-bold text-white leading-tight drop-shadow-sm">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Continuous Moving Conveyor Belt Container */}
      <div className="w-full overflow-x-hidden py-4 relative group select-none">
        {/* Subtle Edge Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

        {/* Conveyor Belt Track with seamless endless loop */}
        <div className="animate-belt flex">
          {/* Primary Track Set (12 cards total: 4,800px+ width to prevent gaps on any screen) */}
          <div className="flex gap-5 shrink-0 pr-5">
            {[...REVIEWS, ...REVIEWS].map((r, index) => (
              <div
                key={`primary-${r.id}-${index}`}
                onClick={() => handleReviewClick(r)}
                className="w-80 sm:w-96 shrink-0 card-modern p-5 bg-white flex flex-col justify-between space-y-4 hover:border-[#18181B] hover:bg-[#FFFDF5] hover:-translate-y-1 transition-all cursor-pointer shadow-[3px_3px_0px_#18181B] relative"
                title={lang === 'en' ? 'Click to view complete review details' : 'Cliquez pour afficher tous les détails de l’avis'}
              >
                {/* Card Top: Author, Avatar, Stars */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={r.avatar}
                        alt={r.author}
                        className="w-10 h-10 rounded-full border-2 border-[#18181B] object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-display font-black text-xs text-[#18181B]">{r.author}</h4>
                          {r.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-[#71717A] flex items-center gap-1 font-medium">
                          {r.isLocalGuide ? (
                            <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5 text-amber-500" />
                              {lang === 'en' ? (r.reviewsCountText || 'Local Guide') : (r.reviewsCountTextFr || 'Guide Local')}
                            </span>
                          ) : (
                            <>
                              <MapPin className="w-2.5 h-2.5 text-[#71717A]" />
                              <span>{lang === 'en' ? (r.reviewsCountText || r.location) : (r.reviewsCountTextFr || r.locationFr || r.location)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs text-[#18181B] leading-relaxed italic line-clamp-3">
                    "{lang === 'en' ? r.comment : (r.commentFr || r.comment)}"
                  </p>
                </div>

                {/* Card Bottom: Ordered Highlight & Date */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] gap-2">
                  <span className="bg-[#FFFBEB] border border-amber-200 px-2.5 py-0.5 rounded-lg text-amber-950 font-bold truncate max-w-[200px]">
                    ★ {lang === 'en' ? r.highlightDish : (r.highlightDishFr || r.highlightDish)}
                  </span>
                  <div className="flex items-center gap-1 text-[#71717A] text-[10px] shrink-0 font-medium">
                    <span>{lang === 'en' ? r.date : (r.dateFr || r.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Track Set (Identical Duplicate for Perfect 100% Loop) */}
          <div className="flex gap-5 shrink-0 pr-5" aria-hidden="true">
            {[...REVIEWS, ...REVIEWS].map((r, index) => (
              <div
                key={`secondary-${r.id}-${index}`}
                onClick={() => handleReviewClick(r)}
                className="w-80 sm:w-96 shrink-0 card-modern p-5 bg-white flex flex-col justify-between space-y-4 hover:border-[#18181B] hover:bg-[#FFFDF5] hover:-translate-y-1 transition-all cursor-pointer shadow-[3px_3px_0px_#18181B] relative"
                title={lang === 'en' ? 'Click to view complete review details' : 'Cliquez pour afficher tous les détails de l’avis'}
              >
                {/* Card Top: Author, Avatar, Stars */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={r.avatar}
                        alt={r.author}
                        className="w-10 h-10 rounded-full border-2 border-[#18181B] object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-display font-black text-xs text-[#18181B]">{r.author}</h4>
                          {r.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-[#71717A] flex items-center gap-1 font-medium">
                          {r.isLocalGuide ? (
                            <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5 text-amber-500" />
                              {lang === 'en' ? (r.reviewsCountText || 'Local Guide') : (r.reviewsCountTextFr || 'Guide Local')}
                            </span>
                          ) : (
                            <>
                              <MapPin className="w-2.5 h-2.5 text-[#71717A]" />
                              <span>{lang === 'en' ? (r.reviewsCountText || r.location) : (r.reviewsCountTextFr || r.locationFr || r.location)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs text-[#18181B] leading-relaxed italic line-clamp-3">
                    "{lang === 'en' ? r.comment : (r.commentFr || r.comment)}"
                  </p>
                </div>

                {/* Card Bottom: Ordered Highlight & Date */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] gap-2">
                  <span className="bg-[#FFFBEB] border border-amber-200 px-2.5 py-0.5 rounded-lg text-amber-950 font-bold truncate max-w-[200px]">
                    ★ {lang === 'en' ? r.highlightDish : (r.highlightDishFr || r.highlightDish)}
                  </span>
                  <div className="flex items-center gap-1 text-[#71717A] text-[10px] shrink-0 font-medium">
                    <span>{lang === 'en' ? r.date : (r.dateFr || r.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Details Modal Popup (Shows ALL INFO on click) */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative max-w-xl w-full card-modern bg-white p-6 md:p-7 overflow-hidden space-y-5 my-8 shadow-[6px_6px_0px_#18181B]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#18181B] uppercase tracking-wider">
                    {lang === 'en' ? 'Verified Google Review' : 'Avis Vérifié Google Maps'}
                  </span>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="w-8 h-8 rounded-full bg-[#FFE248] border-2 border-[#18181B] text-[#18181B] flex items-center justify-center font-bold cursor-pointer hover:bg-amber-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Author & Rating Profile */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedReview.avatar}
                    alt={selectedReview.author}
                    className="w-14 h-14 rounded-full border-2 border-[#18181B] object-cover shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-black text-base text-[#18181B]">
                        {selectedReview.author}
                      </h3>
                      {selectedReview.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-[#71717A] flex items-center gap-1.5 font-medium mt-0.5">
                      {selectedReview.isLocalGuide ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          <Award className="w-3 h-3 text-amber-600" />
                          {lang === 'en' ? (selectedReview.reviewsCountText || 'Local Guide') : (selectedReview.reviewsCountTextFr || 'Guide Local')}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-zinc-600">
                          {lang === 'en'
                            ? (selectedReview.reviewsCountText || selectedReview.location)
                            : (selectedReview.reviewsCountTextFr || selectedReview.locationFr || selectedReview.location)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Star Rating & Relative Time */}
                <div className="text-right space-y-1 shrink-0">
                  <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-[#71717A]">
                    {lang === 'en' ? selectedReview.date : (selectedReview.dateFr || selectedReview.date)}
                  </p>
                </div>
              </div>

              {/* Tags / Metadata Badges Row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedReview.mealType && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-md text-xs font-semibold text-[#18181B]">
                    <Utensils className="w-3 h-3 text-zinc-600" />
                    <span>
                      {lang === 'en' ? 'Meal type:' : 'Type de repas :'} <strong>{lang === 'en' ? selectedReview.mealType : (selectedReview.mealTypeFr || selectedReview.mealType)}</strong>
                    </span>
                  </span>
                )}
                {selectedReview.priceRange && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-md text-xs font-semibold text-[#18181B]">
                    <span>
                      {lang === 'en' ? 'Price:' : 'Prix :'} <strong>{lang === 'en' ? selectedReview.priceRange : (selectedReview.priceRangeFr || selectedReview.priceRange)}</strong>
                    </span>
                  </span>
                )}
                {(selectedReview.visitDate || selectedReview.visitDateFr) && (
                  <span className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-md text-xs font-semibold text-[#18181B]">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span>{lang === 'en' ? selectedReview.visitDate : (selectedReview.visitDateFr || selectedReview.visitDate)}</span>
                  </span>
                )}
              </div>

              {/* Google Ratings Breakdown (Food, Service, Atmosphere) */}
              {selectedReview.scores && (
                <div className="grid grid-cols-3 gap-2.5 bg-[#FAF9F6] p-3 rounded-xl border border-zinc-200 text-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      {lang === 'en' ? 'Food' : 'Cuisine'}
                    </span>
                    <p className="text-sm font-black text-[#18181B] font-mono">
                      {selectedReview.scores.food} / 5 ★
                    </p>
                  </div>
                  <div className="space-y-0.5 border-x border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      {lang === 'en' ? 'Service' : 'Service'}
                    </span>
                    <p className="text-sm font-black text-[#18181B] font-mono">
                      {selectedReview.scores.service} / 5 ★
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      {lang === 'en' ? 'Atmosphere' : 'Ambiance'}
                    </span>
                    <p className="text-sm font-black text-[#18181B] font-mono">
                      {selectedReview.scores.atmosphere} / 5 ★
                    </p>
                  </div>
                </div>
              )}

              {/* Full Review Text */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-2">
                <p className="text-sm text-[#18181B] leading-relaxed whitespace-pre-line font-normal">
                  "{lang === 'en' ? selectedReview.comment : (selectedReview.commentFr || selectedReview.comment)}"
                </p>
              </div>

              {/* Extended Details Grid (Wait time, group size, vegetarian, kids, noise) */}
              <div className="space-y-2.5 text-xs text-[#27272A] border-t border-zinc-200 pt-3">
                {selectedReview.highlightDish && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Recommended / Highlight: ' : 'Coup de cœur / Recommandé : '}</strong>
                      <span>{lang === 'en' ? selectedReview.highlightDish : (selectedReview.highlightDishFr || selectedReview.highlightDish)}</span>
                    </div>
                  </div>
                )}

                {selectedReview.waitTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Wait time: ' : 'Temps d’attente : '}</strong>
                      <span>{lang === 'en' ? selectedReview.waitTime : (selectedReview.waitTimeFr || selectedReview.waitTime)}</span>
                    </div>
                  </div>
                )}

                {selectedReview.groupSize && (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Group size: ' : 'Taille du groupe : '}</strong>
                      <span>{lang === 'en' ? selectedReview.groupSize : (selectedReview.groupSizeFr || selectedReview.groupSize)}</span>
                    </div>
                  </div>
                )}

                {selectedReview.vegetarianOptions && (
                  <div className="flex items-start gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Vegetarian options: ' : 'Options végétariennes : '}</strong>
                      <span>{lang === 'en' ? selectedReview.vegetarianOptions : (selectedReview.vegetarianOptionsFr || selectedReview.vegetarianOptions)}</span>
                    </div>
                  </div>
                )}

                {selectedReview.kidFriendliness && (
                  <div className="flex items-start gap-2">
                    <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Kid-friendliness: ' : 'Accueil des enfants : '}</strong>
                      <span>{lang === 'en' ? selectedReview.kidFriendliness : (selectedReview.kidFriendlinessFr || selectedReview.kidFriendliness)}</span>
                    </div>
                  </div>
                )}

                {selectedReview.noiseLevel && (
                  <div className="flex items-start gap-2">
                    <Volume2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18181B]">{lang === 'en' ? 'Noise level: ' : 'Niveau sonore : '}</strong>
                      <span>{lang === 'en' ? selectedReview.noiseLevel : (selectedReview.noiseLevelFr || selectedReview.noiseLevel)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                <span className="text-[11px] text-[#71717A]">
                  {lang === 'en' ? 'SLAKE Annecy • 29 Rue Sommeiller' : 'SLAKE Annecy • 29 Rue Sommeiller'}
                </span>
                <button
                  onClick={closeReviewModal}
                  className="btn-yellow px-4 py-1.5 text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  {lang === 'en' ? 'Close Review' : 'Fermer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-3xl w-full card-modern bg-white p-4 overflow-hidden space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-base text-[#18181B]">
                  {GALLERY_IMAGES[activeLightboxIndex].title}
                </h4>
                <button
                  onClick={closeLightbox}
                  className="w-8 h-8 rounded-full bg-[#FFE248] border-2 border-[#18181B] text-[#18181B] flex items-center justify-center font-bold cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-black">
                <img
                  src={GALLERY_IMAGES[activeLightboxIndex].image}
                  alt={GALLERY_IMAGES[activeLightboxIndex].title}
                  className="w-full h-full object-contain"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#18181B] flex items-center justify-center cursor-pointer hover:bg-[#FFE248]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#18181B] flex items-center justify-center cursor-pointer hover:bg-[#FFE248]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#52525B]">
                {GALLERY_IMAGES[activeLightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


