export type MenuCategory = 
  | 'all' 
  | 'starters' 
  | 'mains' 
  | 'desserts' 
  | 'drinks' 
  | 'brunch' 
  | 'plates' 
  | 'bakery' 
  | 'coffee' 
  | 'wine_drinks';

export interface MenuItem {
  id: string;
  name: string;
  frenchName?: string;
  category: MenuCategory;
  price: string;
  description: string;
  frenchDescription?: string;
  image: string;
  tags: string[];
  isSignature?: boolean;
  isSeasonal?: boolean;
  isAvailable?: boolean; // In stock (true) or Sold Out (false)
  isFeaturedTeaser?: boolean; // Highlighted on Homepage
  calories?: string;
  allergens?: string[];
  pairing?: string;
  origin?: string;
  notes?: string[];
  prepTime?: string;
  fluffinessLevel?: number; // 1 - 100% for playful stats
  chefTip?: string;
}

export interface HeroContent {
  headlineEn: string;
  headlineHighlightEn: string;
  headlineEndEn: string;
  headlineFr: string;
  headlineHighlightFr: string;
  headlineEndFr: string;
  subtitleEn: string;
  subtitleFr: string;
  ctaPrimaryEn: string;
  ctaPrimaryFr: string;
  ctaSecondaryEn: string;
  ctaSecondaryFr: string;
  primaryImage: string;
  primaryImageBadgeEn: string;
  primaryImageBadgeFr: string;
  highlight1Value: string;
  highlight1LabelEn: string;
  highlight1LabelFr: string;
  highlight2Value: string;
  highlight2LabelEn: string;
  highlight2LabelFr: string;
  highlight3Value: string;
  highlight3LabelEn: string;
  highlight3LabelFr: string;
}

export interface AboutContent {
  badgeEn: string;
  badgeFr: string;
  quoteEn: string;
  quoteFr: string;
  teamSignatureEn: string;
  teamSignatureFr: string;
  locationTag: string;
  ctaMenuEn: string;
  ctaMenuFr: string;
  ctaLocationEn: string;
  ctaLocationFr: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok: string;
  googleMaps: string;
  tripAdvisor?: string;
}

export interface RestaurantInfoData {
  name: string;
  shortName: string;
  tagline: string;
  taglineFr: string;
  city: string;
  address: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  googleRating: number;
  reviewsCount: number;
  priceRange: string;
  isOpenNowOverride?: boolean | null; // null = auto calculate from clock
  openingHours: {
    weekdays: string;
    weekends: string;
    kitchen: string;
  };
  hours: Array<{ days: string; hours: string; note: string }>;
  specialNoticeEn?: string;
  specialNoticeFr?: string;
  showSpecialNotice?: boolean;
}

export interface AdminAuth {
  username: string;
  passwordHash: string;
  salt?: string;
  lastUpdated?: string;
  failedAttempts?: number;
  lockoutUntil?: number;
  sessionTimeoutMinutes?: number;
}

export interface CmsData {
  restaurantInfo: RestaurantInfoData;
  heroContent: HeroContent;
  aboutContent: AboutContent;
  menuItems: MenuItem[];
  galleryImages: GalleryImage[];
  reviews: Review[];
  socialLinks: SocialLinks;
  adminAuth: AdminAuth;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'food' | 'coffee' | 'interior' | 'annecy';
  image: string;
  caption: string;
  locationTag?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  location: string;
  locationFr?: string;
  rating: number;
  date: string;
  dateFr?: string;
  comment: string;
  commentFr?: string;
  highlightDish: string;
  highlightDishFr?: string;
  verified: boolean;
  isLocalGuide?: boolean;
  reviewsCountText?: string;
  reviewsCountTextFr?: string;
  priceRange?: string;
  priceRangeFr?: string;
  mealType?: string;
  mealTypeFr?: string;
  visitDate?: string;
  visitDateFr?: string;
  groupSize?: string;
  groupSizeFr?: string;
  waitTime?: string;
  waitTimeFr?: string;
  vegetarianOptions?: string;
  vegetarianOptionsFr?: string;
  kidFriendliness?: string;
  kidFriendlinessFr?: string;
  noiseLevel?: string;
  noiseLevelFr?: string;
  scores?: {
    food?: number;
    service?: number;
    atmosphere?: number;
  };
}

export interface ReservationData {
  guests: number;
  date: string;
  timeSlot: string;
  zone: 'terrace' | 'indoor_loft' | 'barista_bar';
  name: string;
  email: string;
  phone: string;
  occasion: string;
  dietaryNotes: string;
}

export interface PairingVibe {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  dishName: string;
  drinkName: string;
  sweetName: string;
  dishImage: string;
  drinkImage: string;
  sweetImage: string;
  description: string;
  priceTotal: string;
}

export interface CoffeeRoast {
  name: string;
  region: string;
  process: string;
  roastLevel: string;
  flavorNotes: string[];
  cuppingScore: string;
  color: string;
  altitude: string;
  baristaTip: string;
}

export interface BrunchIngredient {
  id: string;
  name: string;
  frenchName: string;
  category: 'base' | 'protein' | 'topping' | 'drink' | 'sweet';
  emoji: string;
  price: number;
  fluffFactor: number;
  image: string;
}
