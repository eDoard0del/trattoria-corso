import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, GalleryItem, DaySchedule, DailySpecial } from '../types';
import { MENU_ITEMS, GALLERY_ITEMS, OPENING_HOURS, DAILY_SPECIALS } from '../data';
import { supabase } from '../lib/supabase';

interface DataContextType {
  // Data
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
  openingHours: DaySchedule[];
  dailySpecials: DailySpecial[];

  // Admin session
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (newPass: string) => Promise<boolean>;

  // Actions for Menu
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  // Actions for Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  // Actions for Schedule
  updateOpeningHours: (hours: DaySchedule[]) => Promise<void>;

  // Factory reset
  resetToDefaults: () => Promise<void>;
}

// ============================================================
// UTILITY: Converte camelCase → snake_case per Supabase
// ============================================================
const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  // Gallery State
  const [galleryItems, setGalleryItemsState] = useState<GalleryItem[]>(GALLERY_ITEMS);

  // Schedule State
  const [openingHours, setOpeningHours] = useState<DaySchedule[]>(OPENING_HOURS);

  // Daily Specials State (read-only from data.ts)
  const [dailySpecials] = useState<DailySpecial[]>(DAILY_SPECIALS);

  // Admin Session - ora gestita da Supabase
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Admin Modal Open State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carica menù
        const { data: menuData, error: menuError } = await supabase.from('menu_items').select('*');
        if (menuError) throw menuError;
        if (menuData && menuData.length > 0) setMenuItems(menuData);

        // Carica galleria
        const { data: galleryData, error: galleryError } = await supabase.from('gallery_items').select('*');
        if (galleryError) throw galleryError;
        if (galleryData && galleryData.length > 0) setGalleryItemsState(galleryData);

        // Carica orari
        const { data: hoursData, error: hoursError } = await supabase
          .from('opening_hours')
          .select('*')
          .order('day_code');

        if (hoursError) throw hoursError;
        if (hoursData && hoursData.length > 0) {
          const mapped = hoursData.map((row: any) => ({
            dayName: row.day_name,
            dayCode: row.day_code,
            isClosed: row.is_closed,
            lunch: row.lunch_open ? { 
              open: row.lunch_open.slice(0, 5), 
              close: row.lunch_close.slice(0, 5) 
            } : undefined,
            dinner: row.dinner_open ? { 
              open: row.dinner_open.slice(0, 5), 
              close: row.dinner_close.slice(0, 5) 
            } : undefined
          }));
          setOpeningHours(mapped);
        }
      } catch (e) {
        console.error('Error loading data from Supabase:', e);
      }
    };
    loadData();
  }, []);

  // Check Supabase session on mount and listen to auth changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
        }
      } catch (e) {
        console.error('Session check error:', e);
        setIsAdminLoggedIn(false);
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAdminLoggedIn(true);
        }
        if (event === 'SIGNED_OUT') {
          setIsAdminLoggedIn(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Auth functions with Supabase
  const loginAdmin = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'edoardofabbricini0@gmail.com',
        password: password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Password errata. Riprova.' };
        }
        return { success: false, message: error.message };
      }
      
      setIsAdminLoggedIn(true);
      return { success: true, message: 'Accesso effettuato con successo!' };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, message: 'Errore di connessione. Riprova.' };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsAdminLoggedIn(false);
  };

  const changeAdminPassword = async (newPass: string) => {
    try {
      if (!newPass.trim()) return false;
      
      const { error } = await supabase.auth.updateUser({
        password: newPass.trim()
      });
      
      if (error) {
        console.error('Error updating password:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Password change error:', e);
      return false;
    }
  };

  // ============================================================
  // MENU CRUD - CON MAPPATURA camelCase → snake_case
  // ============================================================
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem: MenuItem = {
        ...item,
        id: `menu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      
      // Mappa i dati per Supabase
      const mapped = toSnakeCase(newItem);
      
      const { error } = await supabase.from('menu_items').insert(mapped);
      if (error) {
        console.error('Error adding menu item to Supabase:', error);
        throw error;
      }
      setMenuItems(prev => [newItem, ...prev]);
    } catch (e) {
      console.error('Error in addMenuItem:', e);
      throw e;
    }
  };

  const updateMenuItem = async (id: string, updated: Partial<MenuItem>) => {
    try {
      // Mappa i campi camelCase → snake_case
      const mapped = toSnakeCase(updated);
      
      const { error } = await supabase
        .from('menu_items')
        .update(mapped)
        .eq('id', id);
        
      if (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }

      setMenuItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updated } : item))
      );
    } catch (e) {
      console.error('Error in updateMenuItem:', e);
      throw e;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        console.error('Error deleting menu item from Supabase:', error);
        throw error;
      }
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error('Error in deleteMenuItem:', e);
      throw e;
    }
  };

  // ============================================================
  // GALLERY CRUD - CON MAPPATURA camelCase → snake_case
  // ============================================================
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    try {
      const newItem: GalleryItem = {
        ...item,
        id: `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      
      const mapped = toSnakeCase(newItem);
      
      const { error } = await supabase.from('gallery_items').insert(mapped);
      if (error) {
        console.error('Error adding gallery item to Supabase:', error);
        throw error;
      }
      setGalleryItemsState(prev => [newItem, ...prev]);
    } catch (e) {
      console.error('Error in addGalleryItem:', e);
      throw e;
    }
  };

  const updateGalleryItem = async (id: string, updated: Partial<GalleryItem>) => {
    try {
      const mapped = toSnakeCase(updated);
      
      const { error } = await supabase
        .from('gallery_items')
        .update(mapped)
        .eq('id', id);
        
      if (error) {
        console.error('Error updating gallery item in Supabase:', error);
        throw error;
      }
      setGalleryItemsState(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updated } : item))
      );
    } catch (e) {
      console.error('Error in updateGalleryItem:', e);
      throw e;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) {
        console.error('Error deleting gallery item from Supabase:', error);
        throw error;
      }
      setGalleryItemsState(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error('Error in deleteGalleryItem:', e);
      throw e;
    }
  };

  // ============================================================
  // SCHEDULE CRUD
  // ============================================================
  const updateOpeningHours = async (hours: DaySchedule[]) => {
    try {
      const hoursToUpsert = hours.map(day => ({
        day_name: day.dayName,
        day_code: day.dayCode,
        is_closed: day.isClosed || false,
        lunch_open: day.lunch?.open || null,
        lunch_close: day.lunch?.close || null,
        dinner_open: day.dinner?.open || null,
        dinner_close: day.dinner?.close || null
      }));

      const { error } = await supabase
        .from('opening_hours')
        .upsert(hoursToUpsert, { onConflict: 'day_code' });

      if (error) {
        console.error('Error updating opening hours:', error);
        throw error;
      }

      setOpeningHours(hours);
      console.log('✅ Orari salvati correttamente su Supabase');
    } catch (e) {
      console.error('❌ Error in updateOpeningHours:', e);
      throw e;
    }
  };

  // ============================================================
  // RESET TO DEFAULTS
  // ============================================================
  const resetToDefaults = async () => {
    try {
      await supabase.from('menu_items').delete().neq('id', '__never_match__');
      await supabase.from('gallery_items').delete().neq('id', '__never_match__');

      const hoursToUpsert = OPENING_HOURS.map(day => ({
        day_name: day.dayName,
        day_code: day.dayCode,
        is_closed: day.isClosed || false,
        lunch_open: day.lunch?.open || null,
        lunch_close: day.lunch?.close || null,
        dinner_open: day.dinner?.open || null,
        dinner_close: day.dinner?.close || null
      }));

      const { error: hoursError } = await supabase
        .from('opening_hours')
        .upsert(hoursToUpsert, { onConflict: 'day_code' });

      if (hoursError) {
        console.error('Error resetting hours:', hoursError);
        throw hoursError;
      }

      await supabase.from('menu_items').insert(MENU_ITEMS);
      await supabase.from('gallery_items').insert(GALLERY_ITEMS);

      setMenuItems(MENU_ITEMS);
      setGalleryItemsState(GALLERY_ITEMS);
      setOpeningHours(OPENING_HOURS);
      setIsAdminLoggedIn(false);

      console.log('✅ Reset completato con successo!');
    } catch (e) {
      console.error('❌ Error resetting to defaults:', e);
      throw e;
    }
  };

  return (
    <DataContext.Provider
       value={{
        menuItems,
        galleryItems: galleryItems,
        openingHours,
        dailySpecials,
        isAdminLoggedIn,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        updateOpeningHours,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};