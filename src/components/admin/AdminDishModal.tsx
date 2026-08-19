import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Image as ImageIcon, Upload, Check, AlertCircle, Trash2, Plus } from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface AdminDishModalProps {
  isOpen: boolean;
  dish: MenuItem | null; // null if adding new dish
  onClose: () => void;
  onSave: (dishData: Omit<MenuItem, 'id'> | MenuItem) => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'starters', label: 'Entrées & Bols Petit-Déjeuner' },
  { id: 'mains', label: 'Plats & Sandwiches' },
  { id: 'desserts', label: 'Pancakes, Pain Perdu & Douceurs' },
  { id: 'bakery', label: 'Pâtisseries & Boulangerie Maison' },
  { id: 'coffee', label: 'Cafés de Spécialité & Espresso' },
  { id: 'drinks', label: 'Thés Artisanaux, Boissons Fraîches & Jus' },
  { id: 'brunch', label: 'Formules Brunch' },
];

const PRESET_ALLERGENS = [
  'Gluten',
  'Lait / Produits laitiers',
  'Œufs',
  'Fruits à coque',
  'Arachides',
  'Poisson',
  'Porc',
  'Soja',
  'Sésame',
  'Végétarien',
  'Végan',
];

const PRESET_STOCK_IMAGES = [
  { label: 'Œufs à la Turque', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Pancakes Salés', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Sweet Pancakes', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Pain Perdu', url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Latte Art Café', url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Toast Avocat', url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=900&q=80' },
  { label: 'Muffin Anglais', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80' },
  { label: 'Cruffin / Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80' },
  { label: 'Boisson Matcha', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Table Brunch', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85' },
];

export const AdminDishModal: React.FC<AdminDishModalProps> = ({
  isOpen,
  dish,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [frenchName, setFrenchName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('mains');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [frenchDescription, setFrenchDescription] = useState('');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSignature, setIsSignature] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [isFeaturedTeaser, setIsFeaturedTeaser] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [pairing, setPairing] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [chefTip, setChefTip] = useState('');

  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setFrenchName(dish.frenchName || '');
      setCategory(dish.category || 'mains');
      setPrice(dish.price || '');
      setDescription(dish.description || '');
      setFrenchDescription(dish.frenchDescription || '');
      setImage(dish.image || '');
      setIsAvailable(dish.isAvailable !== false);
      setIsSignature(!!dish.isSignature);
      setIsSeasonal(!!dish.isSeasonal);
      setIsFeaturedTeaser(!!dish.isFeaturedTeaser);
      setTagsInput(dish.tags ? dish.tags.join(', ') : '');
      setAllergens(dish.allergens || []);
      setPairing(dish.pairing || '');
      setPrepTime(dish.prepTime || '');
      setChefTip(dish.chefTip || '');
    } else {
      // New dish defaults
      setName('');
      setFrenchName('');
      setCategory('mains');
      setPrice('€14.00');
      setDescription('');
      setFrenchDescription('');
      setImage(PRESET_STOCK_IMAGES[0].url);
      setIsAvailable(true);
      setIsSignature(false);
      setIsSeasonal(false);
      setIsFeaturedTeaser(false);
      setTagsInput('Homemade');
      setAllergens(['Gluten', 'Dairy']);
      setPairing('');
      setPrepTime('8 mins');
      setChefTip('');
    }
  }, [dish, isOpen]);

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

  const handleToggleAllergen = (item: string) => {
    setAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dishPayload = {
      name: name.trim(),
      frenchName: frenchName.trim() || undefined,
      category,
      price: price.startsWith('€') ? price.trim() : `€${price.trim()}`,
      description: description.trim(),
      frenchDescription: frenchDescription.trim() || undefined,
      image: image.trim() || PRESET_STOCK_IMAGES[0].url,
      tags: parsedTags,
      allergens,
      isAvailable,
      isSignature,
      isSeasonal,
      isFeaturedTeaser,
      pairing: pairing.trim() || undefined,
      prepTime: prepTime.trim() || undefined,
      chefTip: chefTip.trim() || undefined,
    };

    if (dish && dish.id) {
      onSave({ ...dishPayload, id: dish.id });
    } else {
      onSave(dishPayload);
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
          {/* Modal Header */}
          <div className="p-6 bg-[#FAF9F6] border-b-2 border-[#18181B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center text-xl shadow-[2px_2px_0px_#18181B]">
                {dish ? '✏️' : '✨'}
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-[#18181B]">
                  {dish ? 'Modifier le Plat' : 'Ajouter un Nouveau Plat'}
                </h2>
                <p className="text-xs text-[#71717A] font-medium">
                  Personnalisez l’intitulé, le prix, la description et la disponibilité
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Availability & Signature Status Badges Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-amber-300">
              
              {/* In Stock / Sold Out */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div>
                  <span className={`text-xs font-black ${isAvailable ? 'text-emerald-800' : 'text-rose-700'}`}>
                    {isAvailable ? '✅ En Stock' : '❌ Épuisé / Rupture'}
                  </span>
                  <p className="text-[10px] text-zinc-600">Visible à la commande</p>
                </div>
              </label>

              {/* Signature */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSignature}
                  onChange={(e) => setIsSignature(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-black text-amber-950">⭐ Plat Signature</span>
                  <p className="text-[10px] text-zinc-600">Badge mis en avant</p>
                </div>
              </label>

              {/* Homepage Teaser */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeaturedTeaser}
                  onChange={(e) => setIsFeaturedTeaser(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-black text-amber-950">🏠 En Vedette Accueil</span>
                  <p className="text-[10px] text-zinc-600">Carrousel de la page d’accueil</p>
                </div>
              </label>

            </div>

            {/* Dish Names & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Nom du Plat (Anglais) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex : Turkish Farm Eggs"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Nom du Plat (Français)
                </label>
                <input
                  type="text"
                  value={frenchName}
                  onChange={(e) => setFrenchName(e.target.value)}
                  placeholder="ex : Œufs à la Turque Bio"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm bg-white focus:outline-none font-medium"
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
                  Prix (€) *
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="ex : €14.50"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm font-mono font-bold focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Description (Anglais)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingrédients, préparation, saveurs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Description (Français)
                </label>
                <textarea
                  rows={2}
                  value={frenchDescription}
                  onChange={(e) => setFrenchDescription(e.target.value)}
                  placeholder="Ingrédients, cuisson, saveurs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-sm focus:outline-none focus:bg-[#FFFDF5]"
                />
              </div>
            </div>

            {/* Photo Management & Preview */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-200">
              <label className="block text-xs font-black uppercase text-[#18181B]">
                Photographie du Plat (Optionnel)
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Preview Thumbnail */}
                <div className="w-28 h-24 rounded-xl border-2 border-[#18181B] overflow-hidden bg-white shrink-0 relative">
                  {image ? (
                    <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Input & Upload button */}
                <div className="space-y-2 flex-1 w-full">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-[#18181B] text-xs font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <label className="btn-white px-3 py-1.5 text-[11px] uppercase cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Télécharger une photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      Formats PNG, JPG, WebP acceptés
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stock image chips */}
              <div className="pt-2 border-t border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-600 block mb-1">
                  Ou choisir une photo prédéfinie :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_STOCK_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-medium cursor-pointer transition-colors ${
                        image === preset.url
                          ? 'bg-[#FFE248] border-[#18181B] font-bold'
                          : 'bg-white border-zinc-300 hover:bg-zinc-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergens & Tags */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-[#18181B] mb-1.5">
                  Allergènes & Régimes Alimentaires
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ALLERGENS.map((item) => {
                    const selected = allergens.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleAllergen(item)}
                        className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer font-medium transition-all ${
                          selected
                            ? 'bg-[#18181B] text-white border-[#18181B]'
                            : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        {selected ? `✓ ${item}` : `+ ${item}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#18181B]">
                  Badges & Étiquettes en Vedette (Séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="ex : Ingrédients Bio, Fait Maison, Coup de Cœur"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Optional pairing, prep time, chef tip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#18181B]">
                  Accord Café Conseillé
                </label>
                <input
                  type="text"
                  value={pairing}
                  onChange={(e) => setPairing(e.target.value)}
                  placeholder="ex : Velvet Flat White"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#18181B]">
                  Temps de Préparation
                </label>
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="ex : 8 min"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#18181B]">
                  Astuce du Chef / Barista
                </label>
                <input
                  type="text"
                  value={chefTip}
                  onChange={(e) => setChefTip(e.target.value)}
                  placeholder="ex : Tremper le pain dans le jaune pimenté"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#18181B] text-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t-2 border-zinc-100 flex items-center justify-between">
              {dish && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Supprimer le plat "${dish.name}" de la carte ?`)) {
                      onDelete(dish.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2.5 rounded-full border-2 border-red-500 text-red-600 font-black text-xs uppercase hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer le plat</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-white px-5 py-2.5 text-xs font-bold uppercase cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-yellow px-6 py-2.5 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#18181B]"
                >
                  <Check className="w-4 h-4" />
                  <span>{dish ? 'Enregistrer les Modifications' : 'Créer le Plat'}</span>
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
