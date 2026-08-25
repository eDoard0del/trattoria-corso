import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { MenuItem } from '../types';
import { Search, Flame, Droplet, Star, Filter, Heart, Info, Lock, Sun } from 'lucide-react';
import FadeInSection from './ui/FadeInSection';

export default function Menu() {
  const { menuItems, setIsAdminModalOpen } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyWoodFired, setOnlyWoodFired] = useState<boolean>(false);
  const [onlyLocal, setOnlyLocal] = useState<boolean>(false);
  const [onlyVegetarian, setOnlyVegetarian] = useState<boolean>(false);

  const categories = [
    { code: 'all', name: 'Tutto il Menù' },
    { code: 'antipasti', name: 'Antipasti' },
    { code: 'primi', name: 'Primi Piatti' },
    { code: 'secondi', name: 'Secondi a Legna' },
    { code: 'contorni', name: 'Contorni' },
    { code: 'dolci', name: 'Dolci della Trattoria' },
    { code: 'vini', name: 'La Cantina' }
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Hidden items (temporarily unavailable) are not shown to customers
      if (item.isAvailable === false) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Wood-fired filter
      if (onlyWoodFired && !item.isWoodFired) {
        return false;
      }
      // Local specialty filter
      if (onlyLocal && !item.isLocalSpecialty) {
        return false;
      }
      // Vegetarian filter
      if (onlyVegetarian && !item.isVegetarian) {
        return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery, onlyWoodFired, onlyLocal, onlyVegetarian]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOnlyWoodFired(false);
    setOnlyLocal(false);
    setOnlyVegetarian(false);
  };

  return (
    <FadeInSection id="menu" className="py-20 sm:py-24 bg-white text-stone-900 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Sapori Autentici
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-stone-900 mt-4 mb-4">
            Il Nostro Menù Dinamico
          </h2>
          <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed">
            Scopri le nostre specialità tradizionali cotte a legna o mantecate sul bollitore. 
            Usa i filtri per personalizzare la tua ricerca e trovare il piatto perfetto.
          </p>
        </div>

        {/* Search and Filters Bento Controls */}
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 sm:p-6 mb-12 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cerca un ingrediente o un piatto (es: Sagrantino, Norcina...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                id="menu-search-input"
              />
            </div>

            {/* Quick Toggle Toggles */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setOnlyWoodFired(!onlyWoodFired)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border duration-200 ${
                  onlyWoodFired
                    ? 'bg-amber-600 border-amber-600 text-stone-950 shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
                id="filter-toggle-woodfired"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Solo Cotti a Legna</span>
              </button>

              <button
                onClick={() => setOnlyLocal(!onlyLocal)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border duration-200 ${
                  onlyLocal
                    ? 'bg-amber-600 border-amber-600 text-stone-950 shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
                id="filter-toggle-local"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Tipici Umbri</span>
              </button>

              <button
                onClick={() => setOnlyVegetarian(!onlyVegetarian)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border duration-200 ${
                  onlyVegetarian
                    ? 'bg-green-700 border-green-700 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
                id="filter-toggle-vegetarian"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Vegetariano</span>
              </button>
            </div>
          </div>

          {/* Category Tabs Scrollbar */}
          <div className="mt-6 pt-4 border-t border-stone-200/50 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-stone-400 hidden sm:inline mr-2 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === cat.code
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/60'
                }`}
                id={`category-tab-${cat.code}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Items Counter / Reset */}
        <div className="flex justify-between items-center mb-6 px-1">
          <p className="font-mono text-xs text-stone-500">
            Mostrati <strong className="text-stone-800">{filteredItems.length}</strong> {selectedCategory === 'vini' ? 'vini' : filteredItems.length === 1 ? 'piatto' : 'piatti'}
          </p>
          {(searchQuery || onlyWoodFired || onlyLocal || onlyVegetarian || selectedCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="font-mono text-xs text-amber-700 hover:underline font-bold"
              id="reset-all-menu-filters"
            >
              Annulla tutti i filtri
            </button>
          )}
        </div>

        {/* Menu Grid - 2 Column Layout with elegant menu layout */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl hover:bg-stone-50/70 border border-transparent hover:border-stone-100 transition-all duration-300"
                id={`menu-item-row-${item.id}`}
              >
                {/* Visual Details (Nice representation & descriptions) */}
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-sans font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors duration-200">
                      {item.name}
                    </h3>
                    <div className="h-px bg-stone-200 flex-1 hidden sm:block mx-2 self-center border-dashed" />
                    <span className="font-sans font-extrabold text-lg text-stone-900 shrink-0">
                      {item.price.toFixed(2)} €
                    </span>
                  </div>

                  {/* Badges bar */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.isWoodFired && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Flame className="h-2.5 w-2.5 fill-current" />
                        <span>Cotto a Legna</span>
                      </span>
                    )}
                    {item.isPastaBoiler && (
                      <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-800 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Droplet className="h-2.5 w-2.5 fill-current" />
                        <span>Pasta su Bollitore</span>
                      </span>
                    )}
                    {item.isLocalSpecialty && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-stone-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        🇮🇹 Tipico Umbro
                      </span>
                    )}
                    {item.isDailySpecial && (
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-800 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Sun className="h-2.5 w-2.5 fill-current" />
                        <span>Speciale del Giorno</span>
                      </span>
                    )}

                    {item.isVegetarian && (
                      <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-800 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        🟢 Vegetariano
                      </span>
                    )}
                    {item.isBiologico && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        🍃 Biologico
                      </span>
                    )}
                  </div>

                  {/* Description text */}
                  <p className="font-sans text-stone-600 text-sm leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Allergens line */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
                      <Info className="h-3 w-3 shrink-0" />
                      <span>Allergeni: {item.allergens.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200/50 max-w-lg mx-auto">
            <Search className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h4 className="font-sans font-bold text-stone-700 mb-1">Nessun piatto corrisponde ai filtri</h4>
            <p className="font-sans text-stone-500 text-sm mb-4">
              Prova a cambiare combinazione di filtri o scrivi un’altra parola chiave.
            </p>
            <button
              onClick={resetFilters}
              className="bg-stone-900 text-white px-5 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider hover:bg-amber-600 hover:text-stone-950 transition-colors"
              id="no-results-reset-btn"
            >
              Annulla Filtri
            </button>
          </div>
        )}

      </div>
    </FadeInSection>
  );
}
