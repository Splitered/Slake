import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Filter, Utensils, Heart, ChevronRight, ChevronDown, ChevronUp, ArrowLeft, Coffee, Flame, ShieldAlert, Check, Leaf, Clock, MapPin, Info, AlertCircle, ChefHat } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { useOpeningStatus } from '../hooks/useOpeningStatus';
import { useCms } from '../context/CmsContext';

interface MenuPageProps {
  lang: 'en' | 'fr';
  onNavigateHome: () => void;
  onSelectDish: (dish: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ lang, onNavigateHome, onSelectDish }) => {
  const { data } = useCms();
  const MENU_ITEMS = data.menuItems;
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [expandedMobileIds, setExpandedMobileIds] = useState<Record<string, boolean>>({});
  const openingStatus = useOpeningStatus();

  const toggleMobileAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playChime(520, 'sine', 0.08);
    setExpandedMobileIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories: { id: MenuCategory; labelEn: string; labelFr: string; count: number }[] = [
    { id: 'all', labelEn: 'All Dishes', labelFr: 'Tout le Menu', count: MENU_ITEMS.length },
    { id: 'starters', labelEn: 'Starters & Bowls', labelFr: 'Entrées & Bowls', count: MENU_ITEMS.filter(i => i.category === 'starters').length },
    { id: 'mains', labelEn: 'Mains & Muffins', labelFr: 'Plats & Muffins', count: MENU_ITEMS.filter(i => i.category === 'mains').length },
    { id: 'desserts', labelEn: 'Pancakes & Sweets', labelFr: 'Pancakes & Pâtisseries', count: MENU_ITEMS.filter(i => i.category === 'desserts').length },
    { id: 'drinks', labelEn: 'Specialty Coffee', labelFr: 'Café & Boissons', count: MENU_ITEMS.filter(i => i.category === 'drinks').length },
  ];

  const dietaryFilters = [
    { id: 'all', labelEn: 'All Items', labelFr: 'Tous les Plats' },
    { id: 'Vegetarian', labelEn: 'Vegetarian 🌱', labelFr: 'Végétarien 🌱' },
    { id: 'Gluten-Free', labelEn: 'Gluten-Free 🌾', labelFr: 'Sans Gluten 🌾' },
    { id: 'Slake Signature', labelEn: 'Signatures ★', labelFr: 'Signatures ★' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        (item.frenchName && item.frenchName.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchesDietary =
        selectedDietary === 'all' ||
        (selectedDietary === 'Slake Signature' && item.isSignature) ||
        item.tags.some((t) => t.toLowerCase().includes(selectedDietary.toLowerCase()));

      return matchesCategory && matchesSearch && matchesDietary;
    });
  }, [activeCategory, searchQuery, selectedDietary]);

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Return to Home Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => {
              soundEngine.playChime(500, 'sine', 0.1);
              onNavigateHome();
            }}
            className="btn-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B] hover:bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back to Overview' : 'Retour à l’Accueil'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
              openingStatus.isKitchenOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : openingStatus.isCafeOpen
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-zinc-100 text-zinc-700 border-zinc-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                openingStatus.isKitchenOpen
                  ? 'bg-emerald-500 animate-pulse'
                  : openingStatus.isCafeOpen
                  ? 'bg-amber-500'
                  : 'bg-zinc-400'
              }`} />
              <span>
                {lang === 'en' ? openingStatus.kitchenBadgeEn : openingStatus.kitchenBadgeFr}
              </span>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          
          {/* Main Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-2 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playChime(520, 'sine', 0.08);
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-[#18181B] transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FFE248] text-[#18181B] shadow-[2px_2px_0px_#18181B] sm:shadow-[3px_3px_0px_#18181B]'
                      : 'bg-white text-[#18181B] hover:bg-[#FFFBEB]'
                  }`}
                >
                  <span>{lang === 'en' ? cat.labelEn : cat.labelFr}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full border border-[#18181B] ${isActive ? 'bg-white' : 'bg-zinc-100'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar + Dietary Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 max-w-4xl mx-auto">
            
            <div className="relative w-full sm:w-84">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search pancakes, muffins, coffee...' : 'Rechercher un plat, ingrédient...'}
                className="w-full pl-9 sm:pl-10 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border-2 border-[#18181B] text-xs font-bold text-[#18181B] placeholder-[#71717A] focus:outline-none focus:bg-[#FFFBEB]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#52525B] hover:text-black"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {dietaryFilters.map((df) => (
                <button
                  key={df.id}
                  onClick={() => {
                    soundEngine.playChime(480, 'sine', 0.08);
                    setSelectedDietary(df.id);
                  }}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold border border-[#18181B] transition-all cursor-pointer shrink-0 ${
                    selectedDietary === df.id
                      ? 'bg-[#18181B] text-white shadow-sm'
                      : 'bg-white text-[#18181B] hover:bg-[#FFFBEB]'
                  }`}
                >
                  {lang === 'en' ? df.labelEn : df.labelFr}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#52525B] font-bold mb-4 sm:mb-6 px-1">
          <span>
            {lang === 'en'
              ? `Showing ${filteredItems.length} items`
              : `Affichage de ${filteredItems.length} plats & boissons`}
          </span>
          {(searchQuery || selectedDietary !== 'all' || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietary('all');
                setActiveCategory('all');
              }}
              className="text-[#18181B] underline hover:text-amber-800 cursor-pointer"
            >
              {lang === 'en' ? 'Reset all filters' : 'Réinitialiser les filtres'}
            </button>
          )}
        </div>

        {/* Menu Cards Grid - Interactive Accordion on Mobile, Clickable Card on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
          {filteredItems.map((item) => {
            const isExpanded = !!expandedMobileIds[item.id];

            return (
              <div
                key={item.id}
                className="card-modern bg-white border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B] sm:shadow-[3px_3px_0px_#18181B] overflow-hidden flex flex-col justify-between sm:cursor-pointer sm:hover:-translate-y-1 sm:hover:shadow-[5px_5px_0px_#18181B] transition-all group select-none sm:select-auto"
                onClick={() => {
                  // Desktop & tablet only (>= 640px)
                  if (window.innerWidth >= 640) {
                    soundEngine.playChime(580, 'sine', 0.1);
                    onSelectDish(item);
                  }
                }}
                title={lang === 'en' ? 'Click to view complete details' : 'Cliquez pour voir tous les détails'}
              >
                  {/* Mobile Accordion View (< 640px) */}
                  <div className="sm:hidden flex flex-col">
                    {/* Mobile Accordion Header Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleMobileAccordion(item.id, e)}
                      className={`w-full p-3 text-left flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#FFFDF5]' : 'bg-white hover:bg-zinc-50'
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        {/* Mobile Badges Row */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.isSignature && (
                            <span className="inline-flex items-center gap-0.5 bg-[#FFE248] text-[#18181B] px-1.5 py-0.2 rounded text-[8px] font-black uppercase border border-[#18181B]">
                              <Sparkles className="w-2 h-2 fill-[#18181B]" />
                              <span>Signature</span>
                            </span>
                          )}
                          {item.isSeasonal && (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded text-[8px] font-bold">
                              {lang === 'en' ? 'Seasonal' : 'Saison'}
                            </span>
                          )}
                        </div>

                        {/* Mobile Title */}
                        <h3 className="font-display font-black text-xs text-[#18181B] leading-tight">
                          {lang === 'en' ? item.name : item.frenchName || item.name}
                        </h3>

                        {/* Mobile French subtitle */}
                        {lang === 'en' && item.frenchName && (
                          <p className="text-[10px] text-[#71717A] italic font-serif">
                            {item.frenchName}
                          </p>
                        )}
                      </div>

                      {/* Mobile Price & Accordion Toggle Icon */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        <span className="bg-[#FAF9F6] border border-[#18181B] px-2 py-0.5 rounded-lg text-[11px] font-black font-mono text-[#18181B] shadow-[1px_1px_0px_#18181B]">
                          {item.price}
                        </span>
                        <div className="w-6 h-6 rounded-md bg-[#FAF9F6] border border-[#18181B] flex items-center justify-center text-[#18181B]">
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-amber-900' : 'text-zinc-700'
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Mobile Accordion Expandable Body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="accordion-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden border-t border-zinc-200 bg-[#FFFDF5]"
                        >
                          <div className="p-3 space-y-2.5 text-xs">
                            {/* Full Description */}
                            <p className="text-[11px] text-[#3F3F46] leading-relaxed">
                              {item.description}
                            </p>

                            {/* Terroir / Extraction for Drinks */}
                            {item.origin && (
                              <div className="p-2 rounded-lg bg-white border border-zinc-200 text-[10px] space-y-0.5">
                                <span className="font-bold text-[#18181B] flex items-center gap-1">
                                  <Coffee className="w-3 h-3 text-amber-700" />
                                  {lang === 'en' ? 'Terroir & Profile:' : 'Origine & Profil :'}
                                </span>
                                <p className="text-[#52525B] font-mono">{item.origin}</p>
                              </div>
                            )}

                            {/* Chef Tip */}
                            {item.chefTip && (
                              <div className="p-2 rounded-lg bg-[#FFFBEB] border border-amber-300 text-[10px] space-y-0.5">
                                <span className="font-bold text-amber-950 flex items-center gap-1">
                                  <ChefHat className="w-3 h-3 text-amber-800" />
                                  {lang === 'en' ? 'Chef’s Tasting Note:' : 'Conseil du Chef :'}
                                </span>
                                <p className="text-amber-900 italic">"{item.chefTip}"</p>
                              </div>
                            )}

                            {/* Dietary Tags & Allergens */}
                            <div className="pt-1.5 border-t border-zinc-200 space-y-1.5">
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-white border border-zinc-300 text-[#52525B] px-1.5 py-0.2 rounded text-[8px] font-bold"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>

                              <div className="text-[10px] text-[#71717A] flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                                <span>
                                  <strong>{lang === 'en' ? 'Allergens:' : 'Allergènes :'}</strong>{' '}
                                  {item.allergens && item.allergens.length > 0
                                    ? item.allergens.join(', ')
                                    : (lang === 'en' ? 'None listed' : 'Aucun')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Desktop / Tablet Rich View (>= 640px) - Text-based, Clickable to open modal */}
                  <div className="hidden sm:flex p-5 space-y-3.5 flex-1 flex-col justify-between">
                    <div className="space-y-2">
                      {/* Top Row: Badges, Title & Price */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="space-y-1 flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.isSignature && (
                              <span className="inline-flex items-center gap-1 bg-[#FFE248] text-[#18181B] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-[#18181B]">
                                <Sparkles className="w-2.5 h-2.5 fill-[#18181B]" />
                                <span>Signature</span>
                              </span>
                            )}
                            {item.isSeasonal && (
                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                {lang === 'en' ? 'Seasonal' : 'Saison'}
                              </span>
                            )}
                          </div>

                          {/* Item Name */}
                          <h3 className="font-display font-black text-base text-[#18181B] leading-snug group-hover:text-amber-900 transition-colors">
                            {lang === 'en' ? item.name : item.frenchName || item.name}
                          </h3>

                          {/* French Subtitle */}
                          {lang === 'en' && item.frenchName && (
                            <p className="text-xs text-[#71717A] italic font-serif">
                              {item.frenchName}
                            </p>
                          )}
                        </div>

                        {/* Price Pill */}
                        <span className="shrink-0 bg-[#FAF9F6] border-2 border-[#18181B] px-3 py-1 rounded-xl text-sm font-black font-mono text-[#18181B] shadow-[2px_2px_0px_#18181B]">
                          {item.price}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#52525B] leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Desktop Card Bottom: Tags & Click for More Indicator */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs gap-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAF9F6] border border-zinc-200 text-[#52525B] px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                        <span>{lang === 'en' ? 'Details' : 'Détails'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 card-modern bg-white p-8 space-y-4 max-w-md mx-auto">
            <Utensils className="w-8 h-8 text-[#71717A] mx-auto" />
            <h4 className="font-display font-black text-lg text-[#18181B]">
              {lang === 'en' ? 'No items found' : 'Aucun plat trouvé'}
            </h4>
            <p className="text-xs text-[#52525B]">
              {lang === 'en'
                ? 'Try adjusting your search terms or clearing dietary filters.'
                : 'Essayez de modifier votre recherche ou réinitialisez les filtres.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietary('all');
                setActiveCategory('all');
              }}
              className="btn-yellow px-4 py-2 text-xs font-bold"
            >
              {lang === 'en' ? 'Clear Filters' : 'Effacer les Filtres'}
            </button>
          </div>
        )}

        {/* Allergen & Dietary Disclaimer Box */}
        <div className="mt-14 card-modern p-6 bg-[#FAF9F6] border-2 border-zinc-300 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#18181B]">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{lang === 'en' ? 'Allergen & Kitchen Policy' : 'Informations Allergènes & Régimes'}</span>
          </div>
          <p className="text-xs text-[#52525B] leading-relaxed">
            {lang === 'en'
              ? 'Our kitchen handles gluten, dairy, eggs, nuts, and sesame. Please notify our counter team of any severe allergies or dietary preferences before placing your order. Plant-based milks (oat, almond) and gluten-conscious options are available upon request.'
              : 'Notre cuisine utilise du gluten, des produits laitiers, des œufs, des fruits à coque et du sésame. Merci d’informer notre équipe de toute allergie sévère avant de commander. Laits végétaux (avoine) et options sans gluten disponibles.'}
          </p>
        </div>

      </div>
    </div>
  );
};
