import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Utensils,
  Clock,
  Image as ImageIcon,
  Star,
  Phone,
  Lock,
  ArrowLeft,
  LogOut,
  Save,
  Plus,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Instagram,
  Facebook,
  ExternalLink,
  ShieldCheck,
  Tag,
  KeyRound,
  Check,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { soundEngine } from '../../utils/audioSynth';
import { MenuItem, GalleryImage, Review } from '../../types';
import { validatePasswordStrength } from '../../utils/security';
import { AdminDishModal } from './AdminDishModal';
import { AdminReviewModal } from './AdminReviewModal';
import { AdminGalleryModal } from './AdminGalleryModal';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

type TabType = 'home' | 'menu' | 'hours' | 'gallery' | 'reviews' | 'contact' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const {
    data,
    logout,
    updateRestaurantInfo,
    updateHeroContent,
    updateAboutContent,
    updateSocialLinks,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleDishAvailability,
    toggleDishSignature,
    toggleDishFeatured,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    moveGalleryImage,
    addReview,
    updateReview,
    deleteReview,
    updateAdminCredentials,
    resetToDefaults,
    exportJsonData,
    importJsonData,
  } = useCms();

  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Menu sub-state
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

  // Gallery sub-state
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryImage | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Reviews sub-state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Security credentials state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(data.adminAuth?.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const pwdStrength = validatePasswordStrength(newPassword);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    soundEngine.playSuccessTone();
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');

    if (!currentPassword) {
      setCredError('Veuillez saisir votre mot de passe actuel.');
      return;
    }
    if (!newUsername.trim()) {
      setCredError('Le nom d’utilisateur ne peut pas être vide.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setCredError('Le nouveau mot de passe doit comporter au moins 4 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredError('Les nouveaux mots de passe ne correspondent pas. Veuillez vérifier.');
      return;
    }

    setIsUpdatingCreds(true);
    const res = await updateAdminCredentials(newUsername, newPassword, currentPassword);
    setIsUpdatingCreds(false);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Identifiants administrateur mis à jour et chiffrés en SHA-256 !');
    } else {
      setCredError(res.error || 'Échec de la mise à jour des identifiants.');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
    showToast('CMS réinitialisé aux valeurs d’usine.');
  };

  const handleExport = () => {
    const jsonStr = exportJsonData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slake-annecy-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Sauvegarde du CMS exportée avec succès.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const res = importJsonData(reader.result);
        if (res.success) {
          showToast('Données du CMS restaurées avec succès !');
        } else {
          alert('Échec de l’importation de la sauvegarde : ' + res.error);
        }
      }
    };
    reader.readAsText(file);
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return data.menuItems.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        menuSearch === '' ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        (item.frenchName && item.frenchName.toLowerCase().includes(menuSearch.toLowerCase())) ||
        item.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [data.menuItems, selectedCategory, menuSearch]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#18181B] flex flex-col selection:bg-[#FFE248]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#18181B] text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-[#FFE248] flex items-center gap-2.5 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#FFE248]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header Bar */}
      <header className="bg-white border-b-2 border-[#18181B] sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center font-display font-black text-lg shadow-[2px_2px_0px_#18181B]">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-base text-[#18181B] leading-none">
                  SLAKE CMS
                </h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Admin En Ligne
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] font-medium">
                Connecté en tant que <strong className="text-[#18181B]">{data.adminAuth?.username || 'admin'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToSite}
              className="btn-white px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Voir le Site Public</span>
            </button>

            <button
              onClick={() => {
                logout();
                soundEngine.playChime(380, 'sine', 0.1);
              }}
              className="px-3.5 py-2 rounded-full border border-zinc-300 hover:border-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-zinc-200 no-scrollbar">
          {[
            { id: 'menu', label: 'Carte & Plats', icon: Utensils, count: data.menuItems.length },
            { id: 'home', label: 'Accueil & En-tête', icon: Home },
            { id: 'hours', label: 'Horaires & Accès', icon: Clock },
            { id: 'gallery', label: 'Galerie Photos', icon: ImageIcon, count: data.galleryImages.length },
            { id: 'reviews', label: 'Avis Clients', icon: Star, count: data.reviews.length },
            { id: 'contact', label: 'Contact & Réseaux', icon: Phone },
            { id: 'security', label: 'Sécurité & Sauvegardes', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playChime(500, 'sine', 0.05);
                  setActiveTab(tab.id as TabType);
                }}
                className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black uppercase flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#FFE248] text-[#18181B] border-[#18181B] shadow-[3px_3px_0px_#18181B] -translate-y-0.5'
                    : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-[#18181B] text-white' : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===================== TAB 1: MENU DISHES ===================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Action Bar: Search, Category Filters, Add Dish */}
            <div className="card-modern p-5 bg-white space-y-4 shadow-[4px_4px_0px_#18181B]">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Rechercher un plat, ingrédient ou nom..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#18181B] text-xs focus:outline-none focus:bg-[#FFFDF5]"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Add New Dish Button */}
                  <button
                    onClick={() => {
                      setEditingDish(null);
                      setIsDishModalOpen(true);
                    }}
                    className="btn-yellow px-5 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#18181B]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un Plat</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 text-xs">
                {[
                  { id: 'all', label: 'Tous les Plats' },
                  { id: 'starters', label: 'Entrées & Bowls' },
                  { id: 'mains', label: 'Plats & Sandwiches' },
                  { id: 'desserts', label: 'Pancakes & Desserts' },
                  { id: 'bakery', label: 'Boulangerie & Pâtisseries' },
                  { id: 'coffee', label: 'Café de Spécialité' },
                  { id: 'drinks', label: 'Thés & Boissons Fraîches' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Dish Cards Grid (Photos Removed for Clean Admin Management) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={`card-modern bg-white overflow-hidden flex flex-col justify-between transition-all border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B] ${
                    item.isAvailable === false ? 'opacity-75 border-dashed bg-zinc-50' : ''
                  }`}
                >
                  <div className="p-4 space-y-3">
                    {/* Header Row: Status Badges & Price */}
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isAvailable === false ? (
                          <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-xs">
                            Épuisé
                          </span>
                        ) : (
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-xs">
                            En Stock
                          </span>
                        )}

                        {item.isSignature && (
                          <span className="bg-[#FFE248] text-[#18181B] px-2 py-0.5 rounded-md text-[10px] font-black border border-[#18181B]">
                            ★ Signature
                          </span>
                        )}

                        {item.isSeasonal && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            Saisonnier
                          </span>
                        )}
                      </div>

                      {/* Price Badge */}
                      <div className="bg-[#FFE248] px-2.5 py-0.5 rounded-lg border border-[#18181B] font-mono font-black text-xs shrink-0">
                        {item.price}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-black text-sm text-[#18181B] leading-snug">
                        {item.name}
                      </h3>
                      {item.frenchName && (
                        <p className="text-xs text-[#71717A] italic font-serif leading-snug">
                          {item.frenchName}
                        </p>
                      )}

                      <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Allergens tags */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.allergens.map((a) => (
                            <span
                              key={a}
                              className="text-[9px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Controls & Quick Toggles */}
                  <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-2 text-xs">
                    
                    {/* Toggle In Stock / Sold out */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleDishAvailability(item.id);
                        showToast(`Disponibilité de "${item.name}" mise à jour.`);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
                        item.isAvailable !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                      }`}
                    >
                      {item.isAvailable !== false ? '✅ En Stock' : '❌ Épuisé'}
                    </button>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingDish(item);
                          setIsDishModalOpen(true);
                        }}
                        className="btn-white px-3 py-1 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer le plat "${item.name}" ?`)) {
                            deleteMenuItem(item.id);
                            showToast(`"${item.name}" a été supprimé de la carte.`);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer le plat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="p-12 text-center card-modern bg-white space-y-3">
                <Utensils className="w-10 h-10 text-zinc-400 mx-auto" />
                <h3 className="font-display font-black text-base text-[#18181B]">
                  Aucun plat trouvé correspondant à votre recherche
                </h3>
                <p className="text-xs text-zinc-500">
                  Essayez une autre recherche ou ajoutez un nouveau plat.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ===================== TAB 2: HOMEPAGE & HERO ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Hero Headlines & Subtitle */}
            <div className="card-modern p-6 bg-white space-y-6 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Home className="w-5 h-5 text-amber-600" />
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Titre Principal & Sous-titres de l’Accueil
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* English Hero */}
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs font-black uppercase text-amber-800 block">
                    🇬🇧 Version Anglaise (English)
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Titre Principal Partie 1</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineEn}
                      onChange={(e) => updateHeroContent({ headlineEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Mot Surligné en Jaune</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineHighlightEn}
                      onChange={(e) => updateHeroContent({ headlineHighlightEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold bg-[#FFFBEB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Fin du Titre</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineEndEn}
                      onChange={(e) => updateHeroContent({ headlineEndEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Sous-titre / Description</label>
                    <textarea
                      rows={3}
                      value={data.heroContent.subtitleEn}
                      onChange={(e) => updateHeroContent({ subtitleEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* French Hero */}
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs font-black uppercase text-amber-800 block">
                    🇫🇷 Version Française (Français)
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Titre Principal Partie 1</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineFr}
                      onChange={(e) => updateHeroContent({ headlineFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Mot Surligné en Jaune</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineHighlightFr}
                      onChange={(e) => updateHeroContent({ headlineHighlightFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold bg-[#FFFBEB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Fin du Titre</label>
                    <input
                      type="text"
                      value={data.heroContent.headlineEndFr}
                      onChange={(e) => updateHeroContent({ headlineEndFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Paragraphe Descriptif</label>
                    <textarea
                      rows={3}
                      value={data.heroContent.subtitleFr}
                      onChange={(e) => updateHeroContent({ subtitleFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs leading-relaxed"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Textes de l’accueil enregistrés avec succès !')}
                  className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Textes</span>
                </button>
              </div>
            </div>

            {/* Hero Main Photography */}
            <div className="card-modern p-6 bg-white space-y-6 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <div>
                  <h2 className="font-display font-black text-lg text-[#18181B]">
                    Photographie Principale de l’Accueil
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Photographie mise en valeur dans la bannière d’accueil.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Photo Preview */}
                <div className="space-y-2 p-3 rounded-2xl bg-zinc-50 border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B]">
                  <span className="text-xs font-bold text-[#18181B] block">Aperçu en Direct</span>
                  <div className="h-56 rounded-xl overflow-hidden border-2 border-[#18181B] bg-white relative">
                    <img
                      src={data.heroContent.primaryImage}
                      alt="Hero Showcase"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-1 rounded-full border border-[#18181B] text-[10px] font-black uppercase">
                      {data.heroContent.primaryImageBadgeEn}
                    </div>
                  </div>
                </div>

                {/* Photo Configuration Form */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B] block">URL de l’Image d’Accueil</label>
                    <input
                      type="url"
                      value={data.heroContent.primaryImage}
                      onChange={(e) => updateHeroContent({ primaryImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#18181B] text-xs font-mono"
                    />
                    <p className="text-[11px] text-[#71717A]">
                      Photo culinaire haute résolution horizontale ou carrée.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#18181B] block">Badge Flottant (EN)</label>
                      <input
                        type="text"
                        value={data.heroContent.primaryImageBadgeEn}
                        onChange={(e) => updateHeroContent({ primaryImageBadgeEn: e.target.value })}
                        placeholder="ex. ★ Organic Farm Sourcing"
                        className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#18181B] block">Badge Flottant (FR)</label>
                      <input
                        type="text"
                        value={data.heroContent.primaryImageBadgeFr}
                        onChange={(e) => updateHeroContent({ primaryImageBadgeFr: e.target.value })}
                        placeholder="ex. ★ Ingrédients Bio & Locaux"
                        className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => showToast('Photo d’accueil mise à jour !')}
                      className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Enregistrer la Photo</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* About & Guiding Philosophy Section */}
            <div className="card-modern p-6 bg-white space-y-5 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Section À Propos & Philosophie
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Citation (Anglais)</label>
                  <textarea
                    rows={3}
                    value={data.aboutContent.quoteEn}
                    onChange={(e) => updateAboutContent({ quoteEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Citation (Français)</label>
                  <textarea
                    rows={3}
                    value={data.aboutContent.quoteFr}
                    onChange={(e) => updateAboutContent({ quoteFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Signature (Anglais)</label>
                  <input
                    type="text"
                    value={data.aboutContent.teamSignatureEn}
                    onChange={(e) => updateAboutContent({ teamSignatureEn: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#18181B] text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Signature (Français)</label>
                  <input
                    type="text"
                    value={data.aboutContent.teamSignatureFr}
                    onChange={(e) => updateAboutContent({ teamSignatureFr: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#18181B] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Citation de philosophie enregistrée !')}
                  className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer la Section À Propos</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB 3: OPENING HOURS & NOTICES ===================== */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="card-modern p-6 bg-white space-y-6 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Gestion des Horaires d’Ouverture & Annonces
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Weekday Hours */}
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h3 className="font-display font-black text-sm text-[#18181B]">
                    Horaires Lundi – Vendredi
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Horaires du Café</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.hours[0]?.hours || '08:00 – 18:30'}
                      onChange={(e) => {
                        const newHours = [...data.restaurantInfo.hours];
                        if (newHours[0]) newHours[0].hours = e.target.value;
                        updateRestaurantInfo({
                          hours: newHours,
                          openingHours: { ...data.restaurantInfo.openingHours, weekdays: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Note Service Cuisine</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.hours[0]?.note || 'Kitchen open 08:30 – 15:30'}
                      onChange={(e) => {
                        const newHours = [...data.restaurantInfo.hours];
                        if (newHours[0]) newHours[0].note = e.target.value;
                        updateRestaurantInfo({ hours: newHours });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs"
                    />
                  </div>
                </div>

                {/* Weekend Hours */}
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h3 className="font-display font-black text-sm text-[#18181B]">
                    Horaires Samedi & Dimanche
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Horaires Week-end</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.hours[1]?.hours || '08:30 – 19:00'}
                      onChange={(e) => {
                        const newHours = [...data.restaurantInfo.hours];
                        if (newHours[1]) newHours[1].hours = e.target.value;
                        updateRestaurantInfo({
                          hours: newHours,
                          openingHours: { ...data.restaurantInfo.openingHours, weekends: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Note Week-end</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.hours[1]?.note || 'All-day Brunch & Specialty Coffee'}
                      onChange={(e) => {
                        const newHours = [...data.restaurantInfo.hours];
                        if (newHours[1]) newHours[1].note = e.target.value;
                        updateRestaurantInfo({ hours: newHours });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs"
                    />
                  </div>
                </div>

              </div>

              {/* Special Holiday / Announcement Callout Banner */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-950">
                    <input
                      type="checkbox"
                      checked={data.restaurantInfo.showSpecialNotice !== false}
                      onChange={(e) => updateRestaurantInfo({ showSpecialNotice: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Afficher le bandeau d’annonce spéciale sur la section Horaires & Accès</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-900">Message (Anglais)</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.specialNoticeEn || ''}
                      onChange={(e) => updateRestaurantInfo({ specialNoticeEn: e.target.value })}
                      placeholder="ex. All-day brunch every sunny weekend!"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-900">Message (Français)</label>
                    <input
                      type="text"
                      value={data.restaurantInfo.specialNoticeFr || ''}
                      onChange={(e) => updateRestaurantInfo({ specialNoticeFr: e.target.value })}
                      placeholder="ex. Brunch continu toute la journée le week-end !"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Horaires et annonces mis à jour !')}
                  className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Horaires</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB 4: GALLERY PHOTOS ===================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="card-modern p-5 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#18181B]">
              <div>
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Galerie Photos ({data.galleryImages.length} Photos)
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Ajoutez des photos de vos plats, de l’espace loft et du barista. Réorganisez l’ordre à tout moment.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingGalleryItem(null);
                  setIsGalleryModalOpen(true);
                }}
                className="btn-yellow px-4 py-2 text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Photo</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.galleryImages.map((img, index) => (
                <div
                  key={img.id}
                  className="card-modern bg-white overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 border-b-2 border-[#18181B] bg-zinc-100">
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase backdrop-blur-sm">
                        {img.category}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 bg-[#FFE248] text-[#18181B] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#18181B]">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="font-display font-black text-sm text-[#18181B]">
                        {img.title}
                      </h4>
                      <p className="text-xs text-zinc-600 line-clamp-2">
                        {img.caption}
                      </p>
                    </div>
                  </div>

                  {/* Reorder and Edit Actions */}
                  <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveGalleryImage(img.id, 'up')}
                        className="p-1 rounded bg-white border border-zinc-300 disabled:opacity-30 cursor-pointer"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === data.galleryImages.length - 1}
                        onClick={() => moveGalleryImage(img.id, 'down')}
                        className="p-1 rounded bg-white border border-zinc-300 disabled:opacity-30 cursor-pointer"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingGalleryItem(img);
                          setIsGalleryModalOpen(true);
                        }}
                        className="btn-white px-2.5 py-1 text-[11px] font-bold uppercase"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer la photo "${img.title}" ?`)) {
                            deleteGalleryImage(img.id);
                            showToast('Photo supprimée de la galerie.');
                          }
                        }}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: CUSTOMER REVIEWS ===================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="card-modern p-5 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#18181B]">
              <div>
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Avis Clients Google Maps Vérifiés ({data.reviews.length} Avis)
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Gérez les avis authentiques affichés en rotation sur la page d’accueil.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingReview(null);
                  setIsReviewModalOpen(true);
                }}
                className="btn-yellow px-4 py-2 text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Avis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="card-modern p-5 bg-white flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full border-2 border-[#18181B] object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-black text-sm text-[#18181B]">
                              {rev.author}
                            </h4>
                            {rev.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-bold">
                            {rev.reviewsCountText || rev.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-500 text-xs font-black">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-700 italic leading-relaxed line-clamp-3">
                      "{rev.comment}"
                    </p>

                    {rev.commentFr && (
                      <p className="text-[11px] text-zinc-500 italic border-l-2 border-amber-400 pl-2">
                        "{rev.commentFr}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="bg-[#FFFBEB] px-2 py-0.5 rounded border border-amber-200 text-[10px] font-bold text-amber-950 truncate max-w-[200px]">
                      ★ {rev.highlightDish}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingReview(rev);
                          setIsReviewModalOpen(true);
                        }}
                        className="btn-white px-3 py-1 text-[11px] font-bold uppercase cursor-pointer"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer l'avis de "${rev.author}" ?`)) {
                            deleteReview(rev.id);
                            showToast('Avis supprimé.');
                          }
                        }}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Supprimer l'avis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ===================== TAB 6: CONTACT & SOCIALS ===================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="card-modern p-6 bg-white space-y-6 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Phone className="w-5 h-5 text-amber-600" />
                <h2 className="font-display font-black text-lg text-[#18181B]">
                  Coordonnées & Réseaux Sociaux
                </h2>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Numéro de Téléphone</label>
                  <input
                    type="text"
                    value={data.restaurantInfo.phone}
                    onChange={(e) => updateRestaurantInfo({ phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Adresse E-mail</label>
                  <input
                    type="email"
                    value={data.restaurantInfo.email}
                    onChange={(e) => updateRestaurantInfo({ email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B]">Adresse Postale</label>
                  <input
                    type="text"
                    value={data.restaurantInfo.address}
                    onChange={(e) => updateRestaurantInfo({ address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#18181B] text-xs font-bold"
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h3 className="font-display font-black text-sm text-[#18181B]">
                  Liens des Réseaux Sociaux
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Instagram */}
                  <div className="space-y-1 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <label className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Lien Instagram</span>
                    </label>
                    <input
                      type="url"
                      value={data.socialLinks.instagram}
                      onChange={(e) => updateSocialLinks({ instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#18181B] text-xs font-mono"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="space-y-1 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <label className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lien Facebook</span>
                    </label>
                    <input
                      type="url"
                      value={data.socialLinks.facebook}
                      onChange={(e) => updateSocialLinks({ facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#18181B] text-xs font-mono"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <label className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <span>🎵 Lien TikTok</span>
                    </label>
                    <input
                      type="url"
                      value={data.socialLinks.tiktok}
                      onChange={(e) => updateSocialLinks({ tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#18181B] text-xs font-mono"
                    />
                  </div>

                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Coordonnées et réseaux sociaux mis à jour avec succès !')}
                  className="btn-yellow px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Coordonnées</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB 7: SECURITY & BACKUP ===================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Security Audit Banner */}
            <div className="card-modern p-5 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white space-y-3 shadow-[4px_4px_0px_#18181B]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white">
                      Sécurité du Panneau Admin : Sécurisé & Actif
                    </h3>
                    <p className="text-xs text-zinc-300">
                      Hachage SHA-256 avec Sel • Protection Anti-Brute Force • Déconnexion automatique (30 min)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold">
                    ● Chiffré
                  </span>
                </div>
              </div>
            </div>

            {/* Change Login Credentials */}
            <div className="card-modern p-6 bg-white space-y-5 shadow-[4px_4px_0px_#18181B]">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <div>
                  <h2 className="font-display font-black text-lg text-[#18181B]">
                    Modifier les Identifiants d’Administration
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium">
                    Mettez à jour votre nom d’utilisateur et mot de passe principal. Les mots de passe sont salés et hachés en SHA-256 avant stockage.
                  </p>
                </div>
              </div>

              {credError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-300 text-xs text-red-700 font-bold">
                  {credError}
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4 max-w-md">
                
                {/* Current Password (Mandatory) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#18181B] flex items-center justify-between">
                    <span>Mot de passe actuel (Requis pour vérification)</span>
                    <span className="text-[11px] text-amber-700 font-normal">Initial : 1234</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Saisir le mot de passe actuel"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#18181B] text-xs font-mono"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-100 space-y-4">
                  {/* New Username */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Nouvel Identifiant Admin</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs font-bold"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Nouveau Mot de Passe</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 caractères"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs"
                    />

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">Force du mot de passe :</span>
                          <span
                            className={`font-bold font-mono ${
                              pwdStrength.score >= 3
                                ? 'text-emerald-600'
                                : pwdStrength.score === 2
                                ? 'text-amber-600'
                                : 'text-red-500'
                            }`}
                          >
                            {['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][pwdStrength.score] || 'Moyen'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex gap-1">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              pwdStrength.score >= 1
                                ? pwdStrength.score >= 3
                                  ? 'bg-emerald-500'
                                  : pwdStrength.score === 2
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#18181B]">Confirmer le Nouveau Mot de Passe</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ressaisir le nouveau mot de passe"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-[#18181B] text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingCreds}
                  className="btn-yellow px-5 py-2.5 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B] disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isUpdatingCreds ? 'Chiffrement & Mise à jour...' : 'Enregistrer les Nouveaux Identifiants'}</span>
                </button>
              </form>
            </div>

            {/* Backups & Restore */}
            <div className="card-modern p-6 bg-white space-y-4 shadow-[4px_4px_0px_#18181B]">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-display font-black text-base text-[#18181B]">
                  Sauvegarde, Export & Restauration des Données
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Téléchargez une sauvegarde complète de tous les plats, horaires, photos et avis, ou restaurez un fichier JSON sauvegardé.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExport}
                  className="btn-white px-4 py-2 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B]"
                >
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>Exporter Sauvegarde JSON</span>
                </button>

                <label className="btn-white px-4 py-2 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B]">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Importer Sauvegarde JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="px-4 py-2 rounded-full border-2 border-red-500 text-red-600 hover:bg-red-50 text-xs font-black uppercase flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser aux Valeurs d’Usine</span>
                </button>
              </div>
            </div>

            {/* Reset Confirmation Dialog */}
            {isResetConfirmOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="card-modern bg-white p-6 max-w-sm w-full space-y-4 shadow-[6px_6px_0px_#18181B]">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 border-2 border-red-500 flex items-center justify-center text-red-600 mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-display font-black text-lg text-[#18181B]">
                      Réinitialiser Toutes les Données du CMS ?
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      Cette action remettra tous les plats de la carte, horaires d’ouverture, photographies et avis à leurs valeurs initiales d’usine.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="flex-1 btn-white py-2.5 text-xs font-black uppercase cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 py-2.5 rounded-xl border-2 border-[#18181B] text-xs font-black uppercase shadow-[2px_2px_0px_#18181B] cursor-pointer"
                    >
                      Confirmer le Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Dish Modal */}
      <AdminDishModal
        isOpen={isDishModalOpen}
        dish={editingDish}
        onClose={() => setIsDishModalOpen(false)}
        onSave={(dishData) => {
          if ('id' in dishData && dishData.id) {
            updateMenuItem(dishData.id, dishData);
            showToast(`"${dishData.name}" mis à jour avec succès !`);
          } else {
            addMenuItem(dishData);
            showToast(`"${dishData.name}" ajouté à la carte !`);
          }
        }}
        onDelete={(id) => {
          deleteMenuItem(id);
          showToast('Plat supprimé.');
        }}
      />

      {/* Gallery Modal */}
      <AdminGalleryModal
        isOpen={isGalleryModalOpen}
        imageItem={editingGalleryItem}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={(galleryData) => {
          if ('id' in galleryData && galleryData.id) {
            updateGalleryImage(galleryData.id, galleryData);
            showToast('Photo de galerie mise à jour.');
          } else {
            addGalleryImage(galleryData);
            showToast('Nouvelle photo ajoutée à la galerie.');
          }
        }}
        onDelete={(id) => {
          deleteGalleryImage(id);
          showToast('Photo supprimée.');
        }}
      />

      {/* Review Modal */}
      <AdminReviewModal
        isOpen={isReviewModalOpen}
        review={editingReview}
        onClose={() => setIsReviewModalOpen(false)}
        onSave={(revData) => {
          if ('id' in revData && revData.id) {
            updateReview(revData.id, revData);
            showToast('Avis mis à jour.');
          } else {
            addReview(revData);
            showToast('Nouvel avis ajouté.');
          }
        }}
        onDelete={(id) => {
          deleteReview(id);
          showToast('Avis supprimé.');
        }}
      />

    </div>
  );
};
