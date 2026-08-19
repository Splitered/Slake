import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  CmsData,
  RestaurantInfoData,
  HeroContent,
  AboutContent,
  MenuItem,
  GalleryImage,
  Review,
  SocialLinks,
  AdminAuth,
} from '../types';
import { DEFAULT_CMS_DATA } from '../data/defaultCmsData';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  generateSecureToken,
  sanitizeInput,
} from '../utils/security';

const CMS_STORAGE_KEY = 'slake_annecy_cms_v3';
const ADMIN_SESSION_KEY = 'slake_admin_session_auth_token_v2';
const ADMIN_SESSION_EXP_KEY = 'slake_admin_session_expires_at';
const FAILED_ATTEMPTS_KEY = 'slake_admin_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'slake_admin_lockout_until';

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

interface LoginResult {
  success: boolean;
  error?: string;
  lockoutSeconds?: number;
}

interface CmsContextType {
  data: CmsData;
  isAuthenticated: boolean;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
  login: (username: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
  updateAdminCredentials: (
    newUsername: string,
    newPass: string,
    oldPass: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateRestaurantInfo: (info: Partial<RestaurantInfoData>) => void;
  updateHeroContent: (hero: Partial<HeroContent>) => void;
  updateAboutContent: (about: Partial<AboutContent>) => void;
  updateSocialLinks: (socials: Partial<SocialLinks>) => void;
  // Menu items
  setMenuItems: (items: MenuItem[]) => void;
  importOfficialSlakeMenu: () => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleDishAvailability: (id: string) => void;
  toggleDishSignature: (id: string) => void;
  toggleDishFeatured: (id: string) => void;
  // Gallery images
  setGalleryImages: (images: GalleryImage[]) => void;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => GalleryImage;
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => void;
  deleteGalleryImage: (id: string) => void;
  moveGalleryImage: (id: string, direction: 'up' | 'down') => void;
  // Reviews
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Omit<Review, 'id'>) => Review;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  // System / Backup
  resetToDefaults: () => void;
  exportJsonData: () => string;
  importJsonData: (jsonStr: string) => { success: boolean; error?: string };
}

const CmsContext = createContext<CmsContextType | null>(null);

export const CmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CmsData>(() => {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          restaurantInfo: { ...DEFAULT_CMS_DATA.restaurantInfo, ...parsed.restaurantInfo },
          heroContent: { ...DEFAULT_CMS_DATA.heroContent, ...parsed.heroContent },
          aboutContent: { ...DEFAULT_CMS_DATA.aboutContent, ...parsed.aboutContent },
          socialLinks: { ...DEFAULT_CMS_DATA.socialLinks, ...parsed.socialLinks },
          adminAuth: { ...DEFAULT_CMS_DATA.adminAuth, ...parsed.adminAuth },
        };
      }
    } catch (e) {
      console.warn('Failed to parse CMS data from localStorage:', e);
    }
    return DEFAULT_CMS_DATA;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
      const expiresAt = sessionStorage.getItem(ADMIN_SESSION_EXP_KEY);
      if (token && expiresAt && Number(expiresAt) > Date.now()) {
        return true;
      }
    } catch {}
    return false;
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Check lockout state on mount and ticker
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntil = Number(localStorage.getItem(LOCKOUT_UNTIL_KEY) || '0');
        const now = Date.now();
        if (lockoutUntil > now) {
          setLockoutRemainingSeconds(Math.ceil((lockoutUntil - now) / 1000));
        } else {
          setLockoutRemainingSeconds(0);
        }
      } catch {
        setLockoutRemainingSeconds(0);
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session activity tracker (auto logout on expiry)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      try {
        const expiresAt = Number(sessionStorage.getItem(ADMIN_SESSION_EXP_KEY) || '0');
        if (Date.now() > expiresAt) {
          logout();
        }
      } catch {}
    }, 10000);

    const refreshSession = () => {
      try {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY)) {
          sessionStorage.setItem(
            ADMIN_SESSION_EXP_KEY,
            String(Date.now() + SESSION_DURATION_MS)
          );
        }
      } catch {}
    };

    window.addEventListener('mousemove', refreshSession, { passive: true });
    window.addEventListener('keydown', refreshSession, { passive: true });
    window.addEventListener('click', refreshSession, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', refreshSession);
      window.removeEventListener('keydown', refreshSession);
      window.removeEventListener('click', refreshSession);
    };
  }, [isAuthenticated]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving CMS data to localStorage:', e);
    }
  }, [data]);

  const login = useCallback(
    async (username: string, pass: string): Promise<LoginResult> => {
      // Check lockout first
      const lockoutUntil = Number(localStorage.getItem(LOCKOUT_UNTIL_KEY) || '0');
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        return {
          success: false,
          error: `Too many failed attempts. Login locked for ${remaining}s for security.`,
          lockoutSeconds: remaining,
        };
      }

      const storedUser = data.adminAuth?.username || 'admin';
      const storedHash = data.adminAuth?.passwordHash || '1234';
      const storedSalt = data.adminAuth?.salt || 'slake_salt_init';

      const isUserMatch = username.trim() === storedUser;
      const isPassMatch = await verifyPassword(pass, storedSalt, storedHash);

      if (isUserMatch && isPassMatch) {
        // Clear failed attempts
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        setLockoutRemainingSeconds(0);

        // Generate cryptographically secure session token
        const token = generateSecureToken();
        const expiresAt = Date.now() + SESSION_DURATION_MS;

        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, token);
          sessionStorage.setItem(ADMIN_SESSION_EXP_KEY, String(expiresAt));
        } catch {}

        setIsAuthenticated(true);
        return { success: true };
      }

      // Record failed attempt
      const attempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0') + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, String(attempts));

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem(LOCKOUT_UNTIL_KEY, String(lockUntil));
        setLockoutRemainingSeconds(60);
        return {
          success: false,
          error: `Maximum failed attempts exceeded. Security lockout active for 60 seconds.`,
          lockoutSeconds: 60,
        };
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - attempts;
      return {
        success: false,
        error: `Invalid credentials. (${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} left before temporary lockout)`,
      };
    },
    [data.adminAuth]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_EXP_KEY);
    } catch {}
  }, []);

  const updateAdminCredentials = async (
    newUsername: string,
    newPass: string,
    oldPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = sanitizeInput(newUsername);
    if (!cleanUser || cleanUser.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }

    // Verify old password first
    const storedHash = data.adminAuth?.passwordHash || '1234';
    const storedSalt = data.adminAuth?.salt || 'slake_salt_init';
    const isOldValid = await verifyPassword(oldPass, storedSalt, storedHash);

    if (!isOldValid) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    // Generate new salt and salted hash
    const newSalt = generateSalt(16);
    const newHash = await hashPassword(newPass, newSalt);

    setData((prev) => ({
      ...prev,
      adminAuth: {
        username: cleanUser,
        passwordHash: newHash,
        salt: newSalt,
        lastUpdated: new Date().toISOString(),
      },
    }));

    return { success: true };
  };

  const updateRestaurantInfo = (info: Partial<RestaurantInfoData>) => {
    setData((prev) => ({
      ...prev,
      restaurantInfo: { ...prev.restaurantInfo, ...info },
    }));
  };

  const updateHeroContent = (hero: Partial<HeroContent>) => {
    setData((prev) => ({
      ...prev,
      heroContent: { ...prev.heroContent, ...hero },
    }));
  };

  const updateAboutContent = (about: Partial<AboutContent>) => {
    setData((prev) => ({
      ...prev,
      aboutContent: { ...prev.aboutContent, ...about },
    }));
  };

  const updateSocialLinks = (socials: Partial<SocialLinks>) => {
    setData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...socials },
    }));
  };

  // Menu methods
  const setMenuItems = (items: MenuItem[]) => {
    setData((prev) => ({ ...prev, menuItems: items }));
  };

  const importOfficialSlakeMenu = () => {
    setData((prev) => ({ ...prev, menuItems: DEFAULT_CMS_DATA.menuItems }));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
    const newId = 'dish_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newItem: MenuItem = {
      ...item,
      id: newId,
      name: sanitizeInput(item.name),
      price: sanitizeInput(item.price),
      description: sanitizeInput(item.description),
      isAvailable: item.isAvailable !== false,
    };
    setData((prev) => ({
      ...prev,
      menuItems: [newItem, ...prev.menuItems],
    }));
    return newItem;
  };

  const updateMenuItem = (id: string, updatedFields: Partial<MenuItem>) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      ),
    }));
  };

  const deleteMenuItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((item) => item.id !== id),
    }));
  };

  const toggleDishAvailability = (id: string) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      ),
    }));
  };

  const toggleDishSignature = (id: string) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === id ? { ...item, isSignature: !item.isSignature } : item
      ),
    }));
  };

  const toggleDishFeatured = (id: string) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === id ? { ...item, isFeaturedTeaser: !item.isFeaturedTeaser } : item
      ),
    }));
  };

  // Gallery methods
  const setGalleryImages = (images: GalleryImage[]) => {
    setData((prev) => ({ ...prev, galleryImages: images }));
  };

  const addGalleryImage = (image: Omit<GalleryImage, 'id'>): GalleryImage => {
    const newId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newImg: GalleryImage = {
      ...image,
      id: newId,
      title: sanitizeInput(image.title),
      caption: sanitizeInput(image.caption),
    };
    setData((prev) => ({
      ...prev,
      galleryImages: [newImg, ...prev.galleryImages],
    }));
    return newImg;
  };

  const updateGalleryImage = (id: string, image: Partial<GalleryImage>) => {
    setData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img) =>
        img.id === id ? { ...img, ...image } : img
      ),
    }));
  };

  const deleteGalleryImage = (id: string) => {
    setData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img.id !== id),
    }));
  };

  const moveGalleryImage = (id: string, direction: 'up' | 'down') => {
    setData((prev) => {
      const list = [...prev.galleryImages];
      const index = list.findIndex((img) => img.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      } else if (direction === 'down' && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...prev, galleryImages: list };
    });
  };

  // Reviews methods
  const setReviews = (reviews: Review[]) => {
    setData((prev) => ({ ...prev, reviews }));
  };

  const addReview = (review: Omit<Review, 'id'>): Review => {
    const newId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newRev: Review = {
      ...review,
      id: newId,
      author: sanitizeInput(review.author),
      comment: sanitizeInput(review.comment),
    };
    setData((prev) => ({
      ...prev,
      reviews: [newRev, ...prev.reviews],
    }));
    return newRev;
  };

  const updateReview = (id: string, review: Partial<Review>) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((rev) =>
        rev.id === id ? { ...rev, ...review } : rev
      ),
    }));
  };

  const deleteReview = (id: string) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((rev) => rev.id !== id),
    }));
  };

  // System methods
  const resetToDefaults = () => {
    setData(DEFAULT_CMS_DATA);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
    } catch {}
  };

  const exportJsonData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importJsonData = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON file format' };
      }
      setData({
        ...DEFAULT_CMS_DATA,
        ...parsed,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to parse JSON file' };
    }
  };

  return (
    <CmsContext.Provider
      value={{
        data,
        isAuthenticated,
        isLockedOut: lockoutRemainingSeconds > 0,
        lockoutRemainingSeconds,
        login,
        logout,
        updateAdminCredentials,
        updateRestaurantInfo,
        updateHeroContent,
        updateAboutContent,
        updateSocialLinks,
        setMenuItems,
        importOfficialSlakeMenu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleDishAvailability,
        toggleDishSignature,
        toggleDishFeatured,
        setGalleryImages,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        moveGalleryImage,
        setReviews,
        addReview,
        updateReview,
        deleteReview,
        resetToDefaults,
        exportJsonData,
        importJsonData,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
