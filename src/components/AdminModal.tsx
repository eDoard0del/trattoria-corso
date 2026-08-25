import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { MenuItem, GalleryItem, DaySchedule } from '../types';
import {
  Lock,
  Unlock,
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  Utensils,
  Image as ImageIcon,
  Clock,
  Settings,
  Flame,
  Star,
  Heart,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Save,
  ShieldCheck,
  LogOut,
  Search,
  CheckCircle2,
  Droplet,
  Sun
} from 'lucide-react';

export default function AdminModal() {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    openingHours,
    updateOpeningHours,
    resetToDefaults
  } = useData();

  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab inside Admin Panel
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'hours' | 'settings'>('menu');

  // Feedback Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- MENU MANAGEMENT STATE ---
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState<string>('all');

  const [menuFormData, setMenuFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 12.0,
    category: 'primi',
    isWoodFired: false,
    isPastaBoiler: false,
    isDailySpecial: false,
    isLocalSpecialty: false,
    isVegetarian: false,
    allergens: []
  });

  // --- GALLERY MANAGEMENT STATE ---
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState<Omit<GalleryItem, 'id'>>({
    src: '',
    alt: '',
    title: '',
    category: 'piatti'
  });

  // --- HOURS EDITING STATE ---
  const [editedHours, setEditedHours] = useState<DaySchedule[]>(openingHours);
  // Store last known time values for lunch/dinner per day index
  const lastKnownTimes = useRef<Record<number, { lunch?: { open: string; close: string }; dinner?: { open: string; close: string } }>>({});

  // Initialize lastKnownTimes with current values on mount
  useEffect(() => {
    openingHours.forEach((day, idx) => {
      lastKnownTimes.current[idx] = {
        lunch: day.lunch ? { ...day.lunch } : undefined,
        dinner: day.dinner ? { ...day.dinner } : undefined
      };
    });
  }, [openingHours]);

  // --- SETTINGS STATE ---
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  if (!isAdminModalOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await loginAdmin(passwordInput);
    if (res.success) {
      setPasswordInput('');
      showToast('Accesso effettuato nell’Area Riservata');
    } else {
      setLoginError(res.message);
    }
  };

  // --- MENU HANDLERS ---
  const openAddMenuForm = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: 12.0,
      category: 'primi',
      isWoodFired: false,
      isPastaBoiler: false,
      isDailySpecial: false,
      isLocalSpecialty: true,
      isVegetarian: false,
      allergens: ['glutine']
    });
    setIsAddingMenuItem(true);
  };

  const openEditMenuForm = (item: MenuItem) => {
    setIsAddingMenuItem(false);
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isWoodFired: !!item.isWoodFired,
      isPastaBoiler: !!item.isPastaBoiler,
      isDailySpecial: !!item.isDailySpecial,
      isLocalSpecialty: !!item.isLocalSpecialty,
      isVegetarian: !!item.isVegetarian,
      allergens: item.allergens || []
    });
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormData.name.trim()) return;

    if (editingMenuItem) {
      updateMenuItem(editingMenuItem.id, menuFormData);
      showToast(`Piatto "${menuFormData.name}" aggiornato con successo!`);
      setEditingMenuItem(null);
    } else if (isAddingMenuItem) {
      addMenuItem(menuFormData);
      showToast(`Nuovo piatto "${menuFormData.name}" aggiunto al menù!`);
      setIsAddingMenuItem(false);
    }
  };

  const handleDeleteMenu = (id: string, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${name}" dal menù?`)) {
      deleteMenuItem(id);
      showToast(`Piatto "${name}" rimosso dal menù.`);
    }
  };

  const handleToggleAvailability = (id: string, name: string, current: boolean) => {
    const newStatus = !current;
    updateMenuItem(id, { isAvailable: newStatus });
    if (newStatus) {
      showToast(`Piatto "${name}" è ora disponibile`);
    } else {
      showToast(`Piatto "${name}" nascosto dal menù pubblico`);
    }
  };

  // --- GALLERY HANDLERS ---
  const openAddGalleryForm = () => {
    setEditingGalleryItem(null);
    setGalleryFormData({
      src: '',
      alt: '',
      title: '',
      category: 'piatti'
    });
    setIsAddingGalleryItem(true);
  };

  const openEditGalleryForm = (item: GalleryItem) => {
    setIsAddingGalleryItem(false);
    setEditingGalleryItem(item);
    setGalleryFormData({
      src: item.src,
      alt: item.alt,
      title: item.title || '',
      category: item.category
    });
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.src.trim()) return;

    if (editingGalleryItem) {
      updateGalleryItem(editingGalleryItem.id, galleryFormData);
      showToast('Immagine aggiornata con successo!');
      setEditingGalleryItem(null);
    } else if (isAddingGalleryItem) {
      addGalleryItem(galleryFormData);
      showToast('Nuova immagine aggiunta alla galleria!');
      setIsAddingGalleryItem(false);
    }
  };

  const handleDeleteGallery = (id: string, title?: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa immagine?')) {
      deleteGalleryItem(id);
      showToast(`Immagine "${title || 'Galleria'}" eliminata.`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setGalleryFormData(prev => ({
            ...prev,
            src: reader.result as string,
            alt: prev.alt || file.name,
            title: prev.title || file.name.split('.')[0]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Immagini di esempio disponibili in /public/uploads/
  const PRESET_PHOTOS = [
    { title: 'La Nostra Trattoria', url: '/uploads/Sala_Interna.jpg', category: 'ambiente' as const },
    { title: 'Corridoio Esterno', url: '/uploads/Esterno.jpg', category: 'ambiente' as const },
    { title: 'Forno a Legna', url: '/uploads/Forno_a_Legna.jpg', category: 'dettagli' as const },
    { title: 'Gnocchi al Sagrantino', url: '/uploads/Gnocchi_Al_Sagrantino.jpg', category: 'piatti' as const },
    { title: 'Il Gran Tagliere Umbro', url: '/uploads/Tagliere_Umbro.jpg', category: 'piatti' as const },
    { title: 'La Tradizionale Rocciata', url: '/uploads/Piatto_Rocciata.jpg', category: 'piatti' as const },
    { title: 'Pollo al Coccio', url: '/uploads/Pollo_Al_Coccio.jpg', category: 'piatti' as const },
    { title: 'Porta Principale', url: '/uploads/Entrata.jpg', category: 'ambiente' as const }
  ];

  // --- HOURS HANDLERS ---
  const handleHourChange = (index: number, field: string, value: any) => {
    const updated = [...editedHours];
    if (field === 'isClosed') {
      updated[index] = { ...updated[index], isClosed: value };
    } else if (field === 'lunchOpen') {
      const lunch = updated[index].lunch || { open: '12:30', close: '15:00' };
      updated[index] = { ...updated[index], lunch: { ...lunch, open: value } };
      if (updated[index].lunch) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          lunch: { ...updated[index].lunch }
        };
      }
    } else if (field === 'lunchClose') {
      const lunch = updated[index].lunch || { open: '12:30', close: '15:00' };
      updated[index] = { ...updated[index], lunch: { ...lunch, close: value } };
      if (updated[index].lunch) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          lunch: { ...updated[index].lunch }
        };
      }
    } else if (field === 'dinnerOpen') {
      const dinner = updated[index].dinner || { open: '19:30', close: '22:30' };
      updated[index] = { ...updated[index], dinner: { ...dinner, open: value } };
      if (updated[index].dinner) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          dinner: { ...updated[index].dinner }
        };
      }
    } else if (field === 'dinnerClose') {
      const dinner = updated[index].dinner || { open: '19:30', close: '22:30' };
      updated[index] = { ...updated[index], dinner: { ...dinner, close: value } };
      if (updated[index].dinner) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          dinner: { ...updated[index].dinner }
        };
      }
    }
    setEditedHours(updated);
  };

  const handleToggleLunch = (index: number, enabled: boolean) => {
    const updated = [...editedHours];
    const savedLunch = lastKnownTimes.current[index]?.lunch || { open: '12:30', close: '15:00' };
    
    if (enabled) {
      // Restore saved time values
      updated[index] = { ...updated[index], lunch: { ...savedLunch } };
    } else {
      // Save current values and remove lunch
      const currentLunch = updated[index].lunch;
      if (currentLunch) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          lunch: { ...currentLunch }
        };
      }
      updated[index] = { ...updated[index], lunch: undefined };
    }
    setEditedHours(updated);
  };

  const handleToggleDinner = (index: number, enabled: boolean) => {
    const updated = [...editedHours];
    const savedDinner = lastKnownTimes.current[index]?.dinner || { open: '19:30', close: '22:30' };
    
    if (enabled) {
      // Restore saved time values
      updated[index] = { ...updated[index], dinner: { ...savedDinner } };
    } else {
      // Save current values and remove dinner
      const currentDinner = updated[index].dinner;
      if (currentDinner) {
        lastKnownTimes.current[index] = {
          ...lastKnownTimes.current[index],
          dinner: { ...currentDinner }
        };
      }
      updated[index] = { ...updated[index], dinner: undefined };
    }
    setEditedHours(updated);
  };

  const handleSaveHours = () => {
    updateOpeningHours(editedHours);
    showToast('Nuovi orari di apertura salvati con successo!');
  };

  // --- RESET HANDLER ---
  const handleReset = () => {
    if (
      window.confirm(
        'ATTENZIONE: Sei sicuro di voler ripristinare il menù, le foto e gli orari predefiniti? Tutte le tue modifiche verranno cancellate.'
      )
    ) {
      resetToDefaults();
      setEditedHours(openingHours);
      showToast('Tutti i dati sono stati ripristinati allo stato iniziale!');
    }
  };

  // Filtered menu list for admin panel
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = menuFilterCategory === 'all' || item.category === menuFilterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-amber-600 text-stone-950 px-4 py-3 rounded-xl shadow-2xl border border-amber-400 font-sans font-bold text-sm animate-bounce">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 text-stone-950 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg text-white leading-tight">
                Area Riservata — Trattoria del Corso
              </h2>
              <p className="font-sans text-xs text-amber-500 font-medium">
                {isAdminLoggedIn
                  ? 'Pannello di Controllo Gestionale (Senza Database)'
                  : 'Autenticazione Richiesta'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  logoutAdmin();
                  showToast('Disconnesso con successo.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-red-950 text-stone-300 hover:text-red-400 rounded-lg font-sans text-xs font-semibold transition-colors border border-stone-700 hover:border-red-900"
                title="Disconnetti"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Esci</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
              aria-label="Chiudi"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAdminLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6 my-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="font-sans font-extrabold text-2xl text-white">Accesso Gestore</h3>
              <p className="font-sans text-xs text-stone-400">
                Inserisci la password per modificare il menù, le foto e gli orari del ristorante.
              </p>
            </div>


            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Password di Accesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Inserisci password..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 pr-10"
                    autoFocus
                  />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                     aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                   >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 py-3 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Accedi all'Area Riservata</span>
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD PANEL */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Nav Tabs */}
            <div className="bg-stone-950/60 px-6 pt-3 border-b border-stone-800 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-sans font-semibold text-xs transition-colors border-b-2 ${
                  activeTab === 'menu'
                    ? 'bg-stone-900 text-amber-400 border-amber-500'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                <Utensils className="h-4 w-4" />
                <span>Gestione Menù ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-sans font-semibold text-xs transition-colors border-b-2 ${
                  activeTab === 'gallery'
                    ? 'bg-stone-900 text-amber-400 border-amber-500'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Gestione Immagini ({galleryItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hours')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-sans font-semibold text-xs transition-colors border-b-2 ${
                  activeTab === 'hours'
                    ? 'bg-stone-900 text-amber-400 border-amber-500'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Orari Apertura & Chiusura</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-sans font-semibold text-xs transition-colors border-b-2 ${
                  activeTab === 'settings'
                    ? 'bg-stone-900 text-amber-400 border-amber-500'
                    : 'text-stone-400 hover:text-stone-200 border-transparent'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Impostazioni & Ripristino</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* TAB 1: MENU MANAGEMENT */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-950/40 p-4 rounded-xl border border-stone-800">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                        <input
                          type="text"
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          placeholder="Cerca piatto..."
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <select
                        value={menuFilterCategory}
                        onChange={(e) => setMenuFilterCategory(e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                      >
                        <option value="all">Tutte le categorie</option>
                        <option value="antipasti">Antipasti</option>
                        <option value="primi">Primi</option>
                        <option value="secondi">Secondi a Legna</option>
                        <option value="dolci">Dolci</option>
                        <option value="vini">Vini</option>
                        <option value="bevande">Bevande</option>
                      </select>
                    </div>

                    <button
                      onClick={openAddMenuForm}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Aggiungi Nuovo Piatto</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal */}
                  {(isAddingMenuItem || editingMenuItem) && (
                    <div className="bg-stone-950 p-6 rounded-2xl border border-amber-500/40 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                        <h4 className="font-sans font-bold text-sm text-amber-400 flex items-center gap-2">
                          <Edit3 className="h-4 w-4" />
                          <span>{editingMenuItem ? 'Modifica Piatto' : 'Aggiungi Nuovo Piatto nel Menù'}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingMenuItem(false);
                            setEditingMenuItem(null);
                          }}
                          className="text-stone-500 hover:text-stone-300 text-xs"
                        >
                          Annulla
                        </button>
                      </div>

                      <form onSubmit={handleSaveMenu} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Nome del Piatto *
                          </label>
                          <input
                            type="text"
                            required
                            value={menuFormData.name}
                            onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                            placeholder="Es. Gnocchi fatti in casa al Sagrantino"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Categoria *
                          </label>
                          <select
                            value={menuFormData.category}
                            onChange={(e) =>
                              setMenuFormData({
                                ...menuFormData,
                                category: e.target.value as MenuItem['category']
                              })
                            }
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          >
                        <option value="antipasti">Antipasti</option>
                        <option value="primi">Primi</option>
                        <option value="secondi">Secondi</option>
                        <option value="contorni">Contorni</option>
                        <option value="dolci">Dolci</option>
                        <option value="vini">Vini</option>
                        <option value="bevande">Bevande</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Prezzo (€) *
                          </label>
                          <input
                            type="number"
                            step="0.50"
                            min="0"
                            required
                            value={menuFormData.price}
                            onChange={(e) =>
                              setMenuFormData({ ...menuFormData, price: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Allergeni (separati da virgola)
                          </label>
                          <input
                            type="text"
                            value={menuFormData.allergens?.join(', ') || ''}
                            onChange={(e) =>
                              setMenuFormData({
                                ...menuFormData,
                                allergens: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              })
                            }
                            placeholder="Es. glutine, latte, solfiti"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Descrizione del Piatto
                          </label>
                          <textarea
                            rows={2}
                            value={menuFormData.description}
                            onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                            placeholder="Descrivi gli ingredienti e il metodo di preparazione..."
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                          />
                        </div>

                        {/* Flags Checkboxes */}
                        <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                            <input
                              type="checkbox"
                              checked={menuFormData.isWoodFired}
                              onChange={(e) =>
                                setMenuFormData({ ...menuFormData, isWoodFired: e.target.checked })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <Flame className="h-3.5 w-3.5 text-amber-500" />
                            <span>Cotto nel forno a legna</span>
                          </label>
﻿                          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                            <input
                              type="checkbox"
                              checked={menuFormData.isPastaBoiler}
                              onChange={(e) =>
                                setMenuFormData({ ...menuFormData, isPastaBoiler: e.target.checked })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <Droplet className="h-3.5 w-3.5 text-amber-500" />
                            <span>Pasta su Bollitore</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                            <input
                              type="checkbox"
                              checked={menuFormData.isDailySpecial}
                              onChange={(e) =>
                                setMenuFormData({ ...menuFormData, isDailySpecial: e.target.checked })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <Sun className="h-3.5 w-3.5 text-amber-400" />
                            <span>Speciale del Giorno</span>
                          </label>


                          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                            <input
                              type="checkbox"
                              checked={menuFormData.isLocalSpecialty}
                              onChange={(e) =>
                                setMenuFormData({ ...menuFormData, isLocalSpecialty: e.target.checked })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <Star className="h-3.5 w-3.5 text-amber-400" />
                            <span>Specialità Umbra</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                            <input
                              type="checkbox"
                              checked={menuFormData.isVegetarian}
                              onChange={(e) =>
                                setMenuFormData({ ...menuFormData, isVegetarian: e.target.checked })
                              }
                              className="accent-emerald-500 rounded"
                            />
                            <Heart className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Opzione Vegetariana</span>
                          </label>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-stone-800">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingMenuItem(false);
                              setEditingMenuItem(null);
                            }}
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold"
                          >
                            Annulla
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg uppercase tracking-wider"
                          >
                            <Save className="h-4 w-4" />
                            <span>{editingMenuItem ? 'Salva Modifiche' : 'Aggiungi al Menù'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                   {/* Menu Table / List */}
                   <div className="space-y-3">
                     {filteredMenuItems.length === 0 ? (
                       <p className="text-center py-8 text-stone-500 text-xs">
                         Nessun piatto trovato con i filtri selezionati.
                       </p>
                     ) : (
                       filteredMenuItems.map((item) => (
                         <div
                           key={item.id}
                           className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${
                             item.isAvailable === false
                               ? 'bg-stone-900/40 border-stone-700 opacity-60'
                               : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                           }`}
                         >
                           <div className="space-y-1 flex-1">
                             <div className="flex flex-wrap items-center gap-2">
                               <span className="font-sans font-bold text-sm text-white">{item.name}</span>
                               {item.isAvailable === false && (
                                 <span className="bg-red-950/60 text-red-300 border border-red-800 px-1.5 py-0.25 rounded text-[9px] uppercase font-semibold">
                                   Nascosto
                                 </span>
                               )}
                               <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                                 € {item.price.toFixed(2)}
                               </span>
                               <span className="bg-stone-800 text-stone-400 px-2 py-0.5 rounded text-[10px] capitalize">
                                 {item.category}
                               </span>
                               {item.isWoodFired && (
                                 <span className="flex items-center gap-1 bg-amber-950/60 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded text-[10px]">
                                   <Flame className="h-3 w-3 text-amber-500" />
                                   <span>Forno a Legna</span>
                                 </span>
                               )}
                               {item.isLocalSpecialty && (
                                 <span className="flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                                   <Star className="h-3 w-3 text-amber-400" />
                                   <span>Tipico Umbro</span>
                                 </span>
                               )}
                               {item.isVegetarian && (
                                 <span className="flex items-center gap-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px]">
                                   <Heart className="h-3 w-3 text-emerald-400" />
                                   <span>Veg</span>
                                 </span>
                               )}
                             </div>
                             <p className="text-xs text-stone-400 line-clamp-2">{item.description}</p>
                           </div>

                           <div className="flex items-center gap-2 shrink-0">
                             {/* Availability Toggle */}
                             <label className="flex items-center gap-1.5 cursor-pointer bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 text-xs text-stone-300 hover:bg-amber-600 hover:text-stone-950 transition-colors" title={item.isAvailable === false ? 'Attiva piatto' : 'Disponibile'}>
                               <input
                                 type="checkbox"
                                 checked={item.isAvailable !== false}
                                 onChange={(e) => handleToggleAvailability(item.id, item.name, item.isAvailable !== false)}
                                 className={item.isAvailable !== false ? "accent-amber-500 rounded" : "accent-red-500 rounded"}
                                 id={`toggle-avail-${item.id}`}
                               />
                               <span>{item.isAvailable === false ? 'Nascosto' : 'Disponibile'}</span>
                             </label>
                             <button
                               onClick={() => openEditMenuForm(item)}
                               className="p-2 bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                               id={`edit-${item.id}`}
                             >
                               <Edit3 className="h-3.5 w-3.5" />
                               <span className="hidden sm:inline">Modifica</span>
                             </button>
                             <button
                               onClick={() => handleDeleteMenu(item.id, item.name)}
                               className="p-2 bg-stone-800 hover:bg-red-950 hover:text-red-400 text-stone-400 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                               id={`delete-${item.id}`}
                             >
                               <Trash2 className="h-3.5 w-3.5" />
                               <span className="hidden sm:inline">Elimina</span>
                             </button>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}

              {/* TAB 2: GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-stone-950/40 p-4 rounded-xl border border-stone-800">
                    <p className="text-xs text-stone-400">
                      Modifica, elimina o aggiungi foto per la galleria fotografica e gli ambienti della trattoria.
                    </p>
                    <button
                      onClick={openAddGalleryForm}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Aggiungi Nuova Foto</span>
                    </button>
                  </div>

                  {/* Add / Edit Form */}
                  {(isAddingGalleryItem || editingGalleryItem) && (
                    <div className="bg-stone-950 p-6 rounded-2xl border border-amber-500/40 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                        <h4 className="font-sans font-bold text-sm text-amber-400 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          <span>{editingGalleryItem ? 'Modifica Immagine' : 'Carica / Aggiungi Foto'}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingGalleryItem(false);
                            setEditingGalleryItem(null);
                          }}
                          className="text-stone-500 hover:text-stone-300 text-xs"
                        >
                          Annulla
                        </button>
                      </div>

                      <form onSubmit={handleSaveGallery} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                              Titolo Foto *
                            </label>
                            <input
                              type="text"
                              required
                              value={galleryFormData.title}
                              onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                              placeholder="Es. Il Gran Tagliere della Casa"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                              Categoria *
                            </label>
                            <select
                              value={galleryFormData.category}
                              onChange={(e) =>
                                setGalleryFormData({
                                  ...galleryFormData,
                                  category: e.target.value as GalleryItem['category']
                                })
                              }
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            >
                              <option value="piatti">I Nostri Piatti</option>
                              <option value="ambiente">La Trattoria & Ambiente</option>
                              <option value="dettagli">Dettagli & Materia Prima</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            URL Immagine o Carica File
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              required
                              value={galleryFormData.src}
                              onChange={(e) => setGalleryFormData({ ...galleryFormData, src: e.target.value })}
                              placeholder="Incolla URL https://... o seleziona file"
                              className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                            <label className="flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold cursor-pointer shrink-0">
                              <Upload className="h-3.5 w-3.5 text-amber-500" />
                              <span>Sfoglia File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Presets Quick Pick */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] text-stone-400 font-semibold">
                            Oppure scegli un’immagine di esempio:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_PHOTOS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setGalleryFormData({
                                    src: preset.url,
                                    title: preset.title,
                                    alt: preset.title,
                                    category: preset.category
                                  })
                                }
                                className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded text-[11px]"
                              >
                                {preset.title}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Image Preview Box */}
                        {galleryFormData.src && (
                          <div className="p-2 bg-stone-900 rounded-lg border border-stone-800 flex items-center gap-4">
                            <img
                              src={galleryFormData.src}
                              alt="Anteprima"
                              className="h-16 w-16 object-cover rounded-md border border-stone-700"
                            />
                            <div className="text-xs text-stone-400">
                              <p className="font-semibold text-white">Anteprima Immagine</p>
                              <p className="line-clamp-1">{galleryFormData.title || 'Senza titolo'}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingGalleryItem(false);
                              setEditingGalleryItem(null);
                            }}
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold"
                          >
                            Annulla
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg uppercase tracking-wider"
                          >
                            <Save className="h-4 w-4" />
                            <span>{editingGalleryItem ? 'Salva Modifiche' : 'Aggiungi Immagine'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-stone-950/60 rounded-xl border border-stone-800 overflow-hidden flex flex-col group hover:border-amber-500/40 transition-colors"
                      >
                        <div className="relative aspect-video overflow-hidden bg-stone-900">
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-stone-950/80 text-amber-400 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                            {item.category}
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <h5 className="font-sans font-bold text-xs text-white line-clamp-1">
                            {item.title || 'Foto Trattoria'}
                          </h5>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                            <button
                              onClick={() => openEditGalleryForm(item)}
                              className="px-2.5 py-1 bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Modifica</span>
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(item.id, item.title)}
                              className="px-2.5 py-1 bg-stone-800 hover:bg-red-950 hover:text-red-400 text-stone-400 rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Elimina</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: OPENING HOURS MANAGEMENT */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <div className="bg-stone-950/40 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-white">Orari di Apertura del Ristorante</h4>
                      <p className="text-xs text-stone-400">
                        Modifica i turni di Pranzo e Cena o imposta i giorni di chiusura settimanale.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveHours}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg shadow-amber-600/20"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salva Tutti gli Orari</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedHours.map((day, idx) => (
                      <div
                        key={day.dayName}
                        className={`p-4 rounded-xl border transition-colors ${
                          day.isClosed
                            ? 'bg-stone-950/40 border-stone-800/80 opacity-75'
                            : 'bg-stone-950 border-stone-800 hover:border-amber-500/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-sans font-bold text-base text-amber-400 w-28">
                              {day.dayName}
                            </span>
                            <label className="flex items-center gap-2 cursor-pointer bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-stone-300">
                              <input
                                type="checkbox"
                                checked={day.isClosed}
                                onChange={(e) => handleHourChange(idx, 'isClosed', e.target.checked)}
                                className="accent-red-500 rounded"
                              />
                              <span>Chiuso tutto il giorno</span>
                            </label>
                          </div>

                          {!day.isClosed && (
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              {/* Lunch Shift */}
                              <div className={`bg-stone-900 px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-colors ${
                                day.lunch ? 'border-amber-500/40' : 'border-stone-800 opacity-50'
                              }`}>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!day.lunch}
                                    onChange={(e) => handleToggleLunch(idx, e.target.checked)}
                                    className="accent-amber-500 rounded"
                                  />
                                  <span className="font-semibold text-stone-300">Pranzo:</span>
                                </label>
                                {day.lunch && (
                                  <>
                                    <input
                                      type="time"
                                      value={day.lunch.open}
                                      onChange={(e) => handleHourChange(idx, 'lunchOpen', e.target.value)}
                                      className="bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-white text-xs font-mono"
                                    />
                                    <span className="text-stone-500">-</span>
                                    <input
                                      type="time"
                                      value={day.lunch.close}
                                      onChange={(e) => handleHourChange(idx, 'lunchClose', e.target.value)}
                                      className="bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-white text-xs font-mono"
                                    />
                                  </>
                                )}
                              </div>

                              {/* Dinner Shift */}
                              <div className={`bg-stone-900 px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-colors ${
                                day.dinner ? 'border-amber-500/40' : 'border-stone-800 opacity-50'
                              }`}>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!day.dinner}
                                    onChange={(e) => handleToggleDinner(idx, e.target.checked)}
                                    className="accent-amber-500 rounded"
                                  />
                                  <span className="font-semibold text-stone-300">Cena:</span>
                                </label>
                                {day.dinner && (
                                  <>
                                    <input
                                      type="time"
                                      value={day.dinner.open}
                                      onChange={(e) => handleHourChange(idx, 'dinnerOpen', e.target.value)}
                                      className="bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-white text-xs font-mono"
                                    />
                                    <span className="text-stone-500">-</span>
                                    <input
                                      type="time"
                                      value={day.dinner.close}
                                      onChange={(e) => handleHourChange(idx, 'dinnerClose', e.target.value)}
                                      className="bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-white text-xs font-mono"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                       </div>
                     </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveHours}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/20"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salva Modifiche Orari</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS & RESET */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Change Admin Password */}
                  <div className="bg-stone-950/60 p-6 rounded-2xl border border-stone-800 space-y-4">
                    <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-500" />
                      <span>Cambia Password dell'Area Riservata</span>
                    </h4>
                    <p className="text-xs text-stone-400">
                      Imposta una nuova password per proteggere l'accesso a questo pannello di controllo.
                    </p>

                    <form
                       onSubmit={async (e) => {
                        e.preventDefault();
                        if (newPasswordInput.trim()) {
                          const ok = await changeAdminPassword(newPasswordInput);
                          if (ok) {
                            setNewPasswordInput('');
                            setPasswordChangeSuccess(true);
                            setTimeout(() => setPasswordChangeSuccess(false), 3000);
                           }
                         }}}
                       className="space-y-3"
                    >
                      <div>
                        <input
                          type="password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Nuova password..."
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Aggiorna Password
                        </button>
                        {passwordChangeSuccess && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            <Check className="h-3.5 w-3.5" />
                            Password aggiornata!
                          </span>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Reset Defaults */}
                  <div className="bg-red-950/20 p-6 rounded-2xl border border-red-900/40 space-y-4">
                    <h4 className="font-sans font-bold text-sm text-red-400 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Ripristino Dati di Fabbrica</span>
                    </h4>
                    <p className="text-xs text-stone-400">
                      Se vuoi cancellare tutte le modifiche salvate e ripristinare il menù, la galleria di foto e gli orari originali della Trattoria del Corso, premi il pulsante qui sotto.
                    </p>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-900/80 hover:bg-red-800 text-red-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-red-700 shadow-md"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Ripristina Menù e Orari Iniziali</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
