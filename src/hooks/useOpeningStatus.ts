import { useState, useEffect } from 'react';

export interface OpeningStatus {
  isCafeOpen: boolean;
  isKitchenOpen: boolean;
  currentTimeStr: string; // e.g. "14:35"
  dayNameEn: string;
  dayNameFr: string;
  badgeStatusEn: string;
  badgeStatusFr: string;
  kitchenBadgeEn: string;
  kitchenBadgeFr: string;
  isOpenToday: boolean;
  hoursTodayStr: string;
  kitchenHoursTodayStr: string;
}

export function getAnnecyOpeningStatus(date: Date = new Date()): OpeningStatus {
  // Format current time in Annecy (Europe/Paris timezone)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  }).formatToParts(date);

  const hourPart = parts.find((p) => p.type === 'hour')?.value || '12';
  const minPart = parts.find((p) => p.type === 'minute')?.value || '00';
  const weekdayPart = parts.find((p) => p.type === 'weekday')?.value || 'Mon';

  const hour = parseInt(hourPart, 10);
  const minute = parseInt(minPart, 10);
  const currentMinutes = hour * 60 + minute;
  const timeFormatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  // Weekday mapping
  const isWeekend = weekdayPart === 'Sat' || weekdayPart === 'Sun';

  // Schedule definition
  // Weekdays: Cafe 08:00 - 18:30 (480 - 1110), Kitchen 08:30 - 15:30 (510 - 930)
  // Weekends: Cafe 08:30 - 19:00 (510 - 1140), Kitchen 08:30 - 17:00 (510 - 1020)
  const cafeOpenMin = isWeekend ? 8 * 60 + 30 : 8 * 60;
  const cafeCloseMin = isWeekend ? 19 * 60 : 18 * 60 + 30;

  const kitchenOpenMin = 8 * 60 + 30;
  const kitchenCloseMin = isWeekend ? 17 * 60 : 15 * 60 + 30;

  const isCafeOpen = currentMinutes >= cafeOpenMin && currentMinutes < cafeCloseMin;
  const isKitchenOpen = currentMinutes >= kitchenOpenMin && currentMinutes < kitchenCloseMin;

  const hoursTodayStr = isWeekend ? '08:30 – 19:00' : '08:00 – 18:30';
  const kitchenHoursTodayStr = isWeekend ? '08:30 – 17:00' : '08:30 – 15:30';

  const daysMap: Record<string, { en: string; fr: string }> = {
    Mon: { en: 'Monday', fr: 'Lundi' },
    Tue: { en: 'Tuesday', fr: 'Mardi' },
    Wed: { en: 'Wednesday', fr: 'Mercredi' },
    Thu: { en: 'Thursday', fr: 'Jeudi' },
    Fri: { en: 'Friday', fr: 'Vendredi' },
    Sat: { en: 'Saturday', fr: 'Samedi' },
    Sun: { en: 'Sunday', fr: 'Dimanche' },
  };

  const dayInfo = daysMap[weekdayPart] || { en: 'Today', fr: "Aujourd'hui" };

  // Status badges
  let badgeStatusEn = '';
  let badgeStatusFr = '';

  if (isCafeOpen) {
    const closeTimeStr = isWeekend ? '19:00' : '18:30';
    badgeStatusEn = `Open Now • Closes at ${closeTimeStr}`;
    badgeStatusFr = `Ouvert • Ferme à ${closeTimeStr.replace(':', 'h')}`;
  } else {
    const nextOpen = isWeekend ? '08:30' : '08:00';
    badgeStatusEn = `Closed Now • Opens at ${nextOpen}`;
    badgeStatusFr = `Fermé actuellement • Ouvre à ${nextOpen.replace(':', 'h')}`;
  }

  let kitchenBadgeEn = '';
  let kitchenBadgeFr = '';

  if (isKitchenOpen) {
    const kClose = isWeekend ? '17:00' : '15:30';
    kitchenBadgeEn = `Kitchen Serving Now (until ${kClose})`;
    kitchenBadgeFr = `Cuisine Ouverte (jusqu'à ${kClose.replace(':', 'h')})`;
  } else if (isCafeOpen) {
    kitchenBadgeEn = 'Coffee, Drinks & Pastries Only';
    kitchenBadgeFr = 'Café & Pâtisseries Uniquement';
  } else {
    kitchenBadgeEn = 'Kitchen Closed';
    kitchenBadgeFr = 'Cuisine Fermée';
  }

  return {
    isCafeOpen,
    isKitchenOpen,
    currentTimeStr: timeFormatted,
    dayNameEn: dayInfo.en,
    dayNameFr: dayInfo.fr,
    badgeStatusEn,
    badgeStatusFr,
    kitchenBadgeEn,
    kitchenBadgeFr,
    isOpenToday: true,
    hoursTodayStr,
    kitchenHoursTodayStr,
  };
}

export function useOpeningStatus() {
  const [status, setStatus] = useState<OpeningStatus>(() => getAnnecyOpeningStatus());

  useEffect(() => {
    // Update every 30 seconds
    const interval = setInterval(() => {
      setStatus(getAnnecyOpeningStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
