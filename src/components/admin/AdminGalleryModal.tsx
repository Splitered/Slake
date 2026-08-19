import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface AdminGalleryModalProps {
  isOpen: boolean;
  imageItem: GalleryImage | null;
  onClose: () => void;
  onSave: (data: Omit<GalleryImage, 'id'> | GalleryImage) => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES: { id: 'food' | 'coffee' | 'interior' | 'annecy'; label: string }[] = [
  { id: 'food', label: 'Brunch & Plats' },
  { id: 'coffee', label: 'Café de Spécialité & Barista' },
  { id: 'interior', label: 'Intérieur & Ambiance Loft' },
  { id: 'annecy', label: 'Annecy & Atmosphère du Lac' },
];

export const AdminGalleryModal: React.FC<AdminGalleryModalProps> = ({
  isOpen,
  imageItem,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'food' | 'coffee' | 'interior' | 'annecy'>('food');
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [locationTag, setLocationTag] = useState('Annecy');

  useEffect(() => {
    if (imageItem) {
      setTitle(imageItem.title || '');
      setCategory(imageItem.category || 'food');
      setImage(imageItem.image || '');
      setCaption(imageItem.caption || '');
      setLocationTag(imageItem.locationTag || 'Annecy');
    } else {
      setTitle('');
      setCategory('food');
      setImage('https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85');
      setCaption('Fait maison dans notre cuisine à Annecy.');
      setLocationTag('Annecy Centre');
    }
  }, [imageItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          soundEngine.playChime(620, 'sine', 0.1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    const payload = {
      title: title.trim(),
      category,
      image: image.trim(),
      caption: caption.trim(),
      locationTag: locationTag.trim() || undefined,
    };

    if (imageItem && imageItem.id) {
      onSave({ ...payload, id: imageItem.id });
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
          className="relative max-w-lg w-full card-modern bg-white overflow-hidden my-8 shadow-[8px_8px_0px_#18181B]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-[#FAF9F6] border-b-2 border-[#18181B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-xl shadow-[2px_2px_0px_#18181B]">
                🖼️
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-[#18181B]">
                  {imageItem ? 'Modifier la Photo' : 'Ajouter une Photo'}
                </h2>
                <p className="text-xs text-[#71717A] font-medium">
                  Téléchargez ou liez des photos haute définition du café et des plats
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Title & Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#18181B]">
                Titre de la Photo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex : Extraction du matin près de la verrière"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#18181B] text-xs bg-white font-bold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Lieu / Emplacement
                </label>
                <input
                  type="text"
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  placeholder="ex : Annecy Centre"
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#18181B] text-xs"
                />
              </div>
            </div>

            {/* Photo preview & upload */}
            <div className="space-y-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <label className="block text-xs font-bold text-[#18181B]">
                Source de l’Image & Téléchargement
              </label>
              <div className="h-44 rounded-xl border-2 border-[#18181B] overflow-hidden bg-white relative">
                {image ? (
                  <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs font-mono"
                />
                <div className="flex items-center gap-2">
                  <label className="btn-white px-3 py-1 text-xs uppercase cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    Formats JPEG, PNG, WebP
                  </span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#18181B]">
                Légende / Description
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Courte légende affichée au clic..."
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-zinc-100 flex items-center justify-between">
              {imageItem && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Supprimer la photo "${imageItem.title}" de la galerie ?`)) {
                      onDelete(imageItem.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 rounded-full border-2 border-red-500 text-red-600 font-bold text-xs uppercase hover:bg-red-50 flex items-center gap-1 cursor-pointer"
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
                  <span>{imageItem ? 'Enregistrer la Photo' : 'Ajouter la Photo'}</span>
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
