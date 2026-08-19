import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, Check, Trash2, ShieldCheck, Award } from 'lucide-react';
import { Review } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface AdminReviewModalProps {
  isOpen: boolean;
  review: Review | null; // null if adding new
  onClose: () => void;
  onSave: (reviewData: Omit<Review, 'id'> | Review) => void;
  onDelete?: (id: string) => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onSave,
  onDelete,
}) => {
  const [author, setAuthor] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATARS[0]);
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState('Annecy, France');
  const [locationFr, setLocationFr] = useState('Annecy, France');
  const [comment, setComment] = useState('');
  const [commentFr, setCommentFr] = useState('');
  const [highlightDish, setHighlightDish] = useState('');
  const [highlightDishFr, setHighlightDishFr] = useState('');
  const [date, setDate] = useState('Recently');
  const [dateFr, setDateFr] = useState('Récemment');
  const [verified, setVerified] = useState(true);
  const [isLocalGuide, setIsLocalGuide] = useState(true);
  const [reviewsCountText, setReviewsCountText] = useState('Local Guide · 15 reviews');
  const [reviewsCountTextFr, setReviewsCountTextFr] = useState('Guide Local · 15 avis');
  const [priceRange, setPriceRange] = useState('€10–20');
  const [mealType, setMealType] = useState('Brunch');
  const [foodScore, setFoodScore] = useState(5);
  const [serviceScore, setServiceScore] = useState(5);
  const [atmosphereScore, setAtmosphereScore] = useState(5);

  useEffect(() => {
    if (review) {
      setAuthor(review.author || '');
      setAvatar(review.avatar || DEFAULT_AVATARS[0]);
      setRating(review.rating || 5);
      setLocation(review.location || 'Annecy, France');
      setLocationFr(review.locationFr || review.location || 'Annecy, France');
      setComment(review.comment || '');
      setCommentFr(review.commentFr || review.comment || '');
      setHighlightDish(review.highlightDish || '');
      setHighlightDishFr(review.highlightDishFr || review.highlightDish || '');
      setDate(review.date || 'Recently');
      setDateFr(review.dateFr || review.date || 'Récemment');
      setVerified(review.verified !== false);
      setIsLocalGuide(!!review.isLocalGuide);
      setReviewsCountText(review.reviewsCountText || 'Local Guide · 10 reviews');
      setReviewsCountTextFr(review.reviewsCountTextFr || 'Guide Local · 10 avis');
      setPriceRange(review.priceRange || '€10–20');
      setMealType(review.mealType || 'Brunch');
      setFoodScore(review.scores?.food || 5);
      setServiceScore(review.scores?.service || 5);
      setAtmosphereScore(review.scores?.atmosphere || 5);
    } else {
      setAuthor('');
      setAvatar(DEFAULT_AVATARS[0]);
      setRating(5);
      setLocation('Annecy, France');
      setLocationFr('Annecy, France');
      setComment('');
      setCommentFr('');
      setHighlightDish('Turkish Eggs & Specialty Flat White');
      setHighlightDishFr('Œufs à la Turque & Flat White Spécialité');
      setDate('1 week ago');
      setDateFr('Il y a 1 semaine');
      setVerified(true);
      setIsLocalGuide(true);
      setReviewsCountText('Local Guide · 24 reviews');
      setReviewsCountTextFr('Guide Local · 24 avis');
      setPriceRange('€10–20');
      setMealType('Brunch');
      setFoodScore(5);
      setServiceScore(5);
      setAtmosphereScore(5);
    }
  }, [review, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          soundEngine.playChime(600, 'sine', 0.1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const payload = {
      author: author.trim(),
      avatar: avatar.trim() || DEFAULT_AVATARS[0],
      rating,
      location: location.trim(),
      locationFr: locationFr.trim() || location.trim(),
      comment: comment.trim(),
      commentFr: commentFr.trim() || comment.trim(),
      highlightDish: highlightDish.trim(),
      highlightDishFr: highlightDishFr.trim() || highlightDish.trim(),
      date: date.trim(),
      dateFr: dateFr.trim() || date.trim(),
      verified,
      isLocalGuide,
      reviewsCountText: reviewsCountText.trim(),
      reviewsCountTextFr: reviewsCountTextFr.trim() || reviewsCountText.trim(),
      priceRange: priceRange.trim(),
      priceRangeFr: priceRange.trim(),
      mealType: mealType.trim(),
      mealTypeFr: mealType.trim(),
      scores: {
        food: foodScore,
        service: serviceScore,
        atmosphere: atmosphereScore,
      },
    };

    if (review && review.id) {
      onSave({ ...payload, id: review.id });
    } else {
      onSave(payload);
    }

    soundEngine.playSuccessTone();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative max-w-2xl w-full card-modern bg-white overflow-hidden my-8 shadow-[8px_8px_0px_#18181B]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-[#FAF9F6] border-b-2 border-[#18181B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-xl shadow-[2px_2px_0px_#18181B]">
                ⭐
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-[#18181B]">
                  {review ? 'Modifier l’Avis Client' : 'Ajouter un Avis Client'}
                </h2>
                <p className="text-xs text-[#71717A] font-medium">
                  Avis certifié Google Maps & témoignages de clients
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border-2 border-[#18181B] flex items-center justify-center text-[#18181B] hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Author, Avatar, Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Nom du Client / Auteur *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="ex : Charlotte Dubois"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Note Globale (1 - 5 Étoiles)
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        rating >= star
                          ? 'bg-[#FFE248] border-[#18181B] text-amber-900'
                          : 'bg-zinc-100 border-zinc-300 text-zinc-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-black ml-2">{rating} / 5</span>
                </div>
              </div>
            </div>

            {/* Avatar picker / upload */}
            <div className="space-y-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <label className="block text-xs font-bold text-[#18181B]">
                Photo de Profil / Avatar
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={author || 'Avatar'}
                  className="w-12 h-12 rounded-full border-2 border-[#18181B] object-cover shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#18181B] text-xs font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <label className="btn-white px-2.5 py-1 text-[10px] uppercase cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Télécharger un avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-zinc-500">Ou choisir un profil :</span>
                    <div className="flex gap-1">
                      {DEFAULT_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className="w-6 h-6 rounded-full border border-zinc-400 overflow-hidden cursor-pointer hover:border-black"
                        >
                          <img src={av} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#FFFBEB] border border-amber-300 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Avis Vérifié Google Maps
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocalGuide}
                  onChange={(e) => setIsLocalGuide(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Guide Local Google
                </span>
              </label>
            </div>

            {/* Comments EN & FR */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Texte de l’Avis (Anglais) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="ex : Best brunch in Annecy! The Turkish eggs and flat white were outstanding..."
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Texte de l’Avis (Français)
                </label>
                <textarea
                  rows={2}
                  value={commentFr}
                  onChange={(e) => setCommentFr(e.target.value)}
                  placeholder="ex : Meilleur brunch d'Annecy ! Les œufs à la turque et le café de spécialité étaient parfaits..."
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>
            </div>

            {/* Highlight Dish & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#18181B]">
                  Plat Recommandé (EN)
                </label>
                <input
                  type="text"
                  value={highlightDish}
                  onChange={(e) => setHighlightDish(e.target.value)}
                  placeholder="ex : Turkish Eggs & Flat White"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#18181B]">
                  Plat Recommandé (FR)
                </label>
                <input
                  type="text"
                  value={highlightDishFr}
                  onChange={(e) => setHighlightDishFr(e.target.value)}
                  placeholder="ex : Œufs à la Turque & Flat White"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#18181B]">
                  Date (EN)
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="ex : 2 weeks ago"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#18181B]">
                  Date (FR)
                </label>
                <input
                  type="text"
                  value={dateFr}
                  onChange={(e) => setDateFr(e.target.value)}
                  placeholder="ex : Il y a 2 semaines"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>
            </div>

            {/* Sub-Scores */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <label className="block text-xs font-bold text-[#18181B]">
                Détail des Notes par Catégorie (1 - 5)
              </label>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold block">Cuisine / Plats</span>
                  <select
                    value={foodScore}
                    onChange={(e) => setFoodScore(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s} ★</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold block">Service</span>
                  <select
                    value={serviceScore}
                    onChange={(e) => setServiceScore(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s} ★</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold block">Ambiance</span>
                  <select
                    value={atmosphereScore}
                    onChange={(e) => setAtmosphereScore(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s} ★</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-zinc-100 flex items-center justify-between">
              {review && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Supprimer l’avis de "${review.author}" ?`)) {
                      onDelete(review.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-full border-2 border-red-500 text-red-600 font-bold text-xs uppercase hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-white px-4 py-2 text-xs font-bold uppercase cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Check className="w-4 h-4" />
                  <span>{review ? 'Enregistrer l’Avis' : 'Ajouter l’Avis'}</span>
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
