export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'antipasti' | 'primi' | 'secondi' | 'contorni' | 'dolci' | 'vini' | 'bevande';
  isWoodFired?: boolean; // Cotto nel forno a legna
  isPastaBoiler?: boolean; // Cotto nel bollitore della pasta
  isLocalSpecialty?: boolean; // Piatto tipico umbro
  isDailySpecial?: boolean; // Piatto del giorno
  allergens?: string[];
  isVegetarian?: boolean;
  isBiologico?: boolean; // Vino biologico
  isAvailable?: boolean; // Disponibilità temporanea (default: true)
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'piatti' | 'ambiente' | 'dettagli';
  title?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  source: 'Google' | 'TripAdvisor' | 'Diretto';
}

export interface DaySchedule {
  dayName: string;
  dayCode: number; // 0 = Sunday, 1 = Monday, etc.
  isClosed: boolean;
  lunch?: { open: string; close: string };
  dinner?: { open: string; close: string };
}

export interface DailySpecial {
  id: string;
  name: string;
}

export type WineType = 'rosso' | 'bianco';

export interface WineItem {
  id: string;
  name: string;
  description: string;
  price: number;
  producer: string;
  wineType: WineType;
  isBiologico?: boolean;
  isLocalSpecialty?: boolean;
  allergens?: string[];
}
