import { CmsData, HeroContent, AboutContent, SocialLinks, RestaurantInfoData, AdminAuth } from '../types';
import {
  RESTAURANT_INFO,
  MENU_ITEMS,
  GALLERY_IMAGES,
  REVIEWS,
  imgTurkishEggs,
  imgSwanLatte,
  imgSweetPancakes
} from './restaurantData';

export const DEFAULT_HERO_CONTENT: HeroContent = {
  headlineEn: 'Specialty Coffee &',
  headlineHighlightEn: 'Artisan Brunch',
  headlineEndEn: 'in Annecy.',
  headlineFr: 'Café de Spécialité &',
  headlineHighlightFr: 'Brunch Maison',
  headlineEndFr: 'à Annecy.',
  subtitleEn: 'Homemade English muffins, organic Turkish eggs, fluffy buttermilk pancakes, and single-origin coffee roasted with passion — 300 meters from Lake Annecy.',
  subtitleFr: 'Muffins anglais maison, œufs bio à la turque, pancakes ultra-moelleux et cafés de spécialité torréfiés avec soin — à 300m du lac d’Annecy.',
  ctaPrimaryEn: 'Explore Full Menu',
  ctaPrimaryFr: 'Découvrir la Carte',
  ctaSecondaryEn: 'Location & Hours',
  ctaSecondaryFr: 'Accès & Horaires',
  primaryImage: imgTurkishEggs,
  primaryImageBadgeEn: '★ Organic Farm Sourcing',
  primaryImageBadgeFr: '★ Ingrédients Bio & Locaux',
  highlight1Value: '100%',
  highlight1LabelEn: 'Fresh Homemade Bakes',
  highlight1LabelFr: 'Fait Maison Chaque Jour',
  highlight2Value: '89+',
  highlight2LabelEn: 'Cupping Score Specialty',
  highlight2LabelFr: 'Score Café de Spécialité',
  highlight3Value: '3 min',
  highlight3LabelEn: 'Walk to Lake Annecy',
  highlight3LabelFr: 'Du Lac d’Annecy',
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  badgeEn: 'Our Guiding Philosophy',
  badgeFr: 'Notre Philosophie',
  quoteEn: '“At SLAKE, we believe that true hospitality begins with honest craft: exceptional specialty coffee extracted with precision, artisan pastries fresh from the morning oven, and sincere smiles in the heart of Annecy.”',
  quoteFr: '“Chez SLAKE, nous croyons que l’hospitalité commence par un artisanat sincère : du café de spécialité extrait avec précision, des pâtisseries dorées au four chaque matin et des sourires authentiques au cœur d’Annecy.”',
  teamSignatureEn: 'The SLAKE Team',
  teamSignatureFr: 'L’Équipe SLAKE',
  locationTag: 'Annecy, France',
  ctaMenuEn: 'Explore Full Menu',
  ctaMenuFr: 'Découvrir la Carte Complète',
  ctaLocationEn: 'Find the Café (3 min from Lake)',
  ctaLocationFr: 'Nous Trouver (à 3 min du Lac)',
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://instagram.com/slake_coffee_annecy',
  facebook: 'https://facebook.com/slakeannecy',
  tiktok: 'https://tiktok.com/@slakeannecy',
  googleMaps: 'https://maps.google.com/?q=SLAKE+Annecy+29+Rue+Sommeiller+74000+Annecy',
  tripAdvisor: 'https://tripadvisor.com',
};

export const DEFAULT_ADMIN_AUTH: AdminAuth = {
  username: 'admin',
  passwordHash: '1234',
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_RESTAURANT_INFO: RestaurantInfoData = {
  name: RESTAURANT_INFO.name,
  shortName: RESTAURANT_INFO.shortName,
  tagline: RESTAURANT_INFO.tagline,
  taglineFr: RESTAURANT_INFO.taglineFr,
  city: RESTAURANT_INFO.city,
  address: RESTAURANT_INFO.address,
  postalCode: RESTAURANT_INFO.postalCode,
  country: RESTAURANT_INFO.country,
  phone: RESTAURANT_INFO.phone,
  email: RESTAURANT_INFO.email,
  website: RESTAURANT_INFO.website,
  instagram: RESTAURANT_INFO.instagram,
  googleRating: RESTAURANT_INFO.googleRating,
  reviewsCount: RESTAURANT_INFO.reviewsCount,
  priceRange: RESTAURANT_INFO.priceRange,
  isOpenNowOverride: null,
  openingHours: RESTAURANT_INFO.openingHours,
  hours: RESTAURANT_INFO.hours,
  specialNoticeEn: 'Continuous brunch all day on weekends & holidays! Walk-ins warmly welcomed.',
  specialNoticeFr: 'Brunch continu toute la journée les samedis, dimanches et jours fériés ! Accueil libre et chaleureux.',
  showSpecialNotice: true,
};

export const DEFAULT_CMS_DATA: CmsData = {
  restaurantInfo: DEFAULT_RESTAURANT_INFO,
  heroContent: DEFAULT_HERO_CONTENT,
  aboutContent: DEFAULT_ABOUT_CONTENT,
  menuItems: MENU_ITEMS.map((item) => ({
    ...item,
    isAvailable: item.isAvailable !== false,
    isFeaturedTeaser: item.isSignature || item.isSeasonal,
  })),
  galleryImages: GALLERY_IMAGES,
  reviews: REVIEWS,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  adminAuth: DEFAULT_ADMIN_AUTH,
};
