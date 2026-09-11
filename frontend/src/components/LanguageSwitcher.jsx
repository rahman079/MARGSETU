import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Globe, 
  ChevronDown, 
  Search, 
  Check, 
  Sparkles, 
  MapPin, 
  Volume2, 
  X,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LanguageSwitcher Component
 * 
 * Supports two variants:
 * 1. 'header' / 'dropdown': Compact top-right navbar dropdown
 * 2. 'floating': Sticky right-side floating pill/widget with slide-out drawer
 */
export default function LanguageSwitcher({ variant = 'header', align = 'right' }) {
  const { currentLang, currentLangCode, setLanguage, languages, states, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on Outside Click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape Key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    } else {
      setSearchQuery('');
      setSelectedState('ALL');
    }
  }, [isOpen]);

  // Filter languages based on search query & state selection
  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => {
      // Don't filter out English if searching ALL or if English matches
      const matchesSearch =
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.isoCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = selectedState === 'ALL' || lang.stateCode === selectedState || lang.isDefault;

      return matchesSearch && matchesState;
    });
  }, [languages, searchQuery, selectedState]);

  // Group languages by State (excluding English which is pinned at top)
  const englishLang = languages.find(l => l.code === 'en');
  const regionalLanguages = filteredLanguages.filter(l => l.code !== 'en');

  // Distinct states among filtered languages
  const stateGroups = useMemo(() => {
    const groups = {};
    regionalLanguages.forEach(lang => {
      if (!groups[lang.state]) {
        groups[lang.state] = [];
      }
      groups[lang.state].push(lang);
    });
    return groups;
  }, [regionalLanguages]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left font-sans">
      
      {/* Compact Trigger Button */}
      <button
        type="button"
        id="ne-lang-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Select North East Regional Language"
        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
          isOpen
            ? 'bg-indigo-50/90 border-indigo-300 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/90 shadow-xs'
        }`}
      >
        <Globe className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-indigo-600 animate-pulse' : 'text-slate-500 group-hover:text-indigo-600'}`} />
        
        {/* Active Language Badge */}
        <span className="font-extrabold uppercase tracking-wide text-[11px] bg-slate-100 group-hover:bg-indigo-100 text-slate-800 group-hover:text-indigo-800 px-1.5 py-0.5 rounded-md transition-colors">
          {currentLang.isoCode}
        </span>
        
        <span className="hidden sm:inline font-medium text-slate-700 group-hover:text-slate-900 max-w-[85px] truncate">
          {currentLang.name}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Main Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute z-50 mt-2 w-[360px] sm:w-[410px] max-h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-2xl ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            style={{ boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.22)' }}
          >
            {renderDropdownContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // -------------------------------------------------------------
  // HELPER: Popover Content Body (Search, State Tabs, Scrollable List)
  // -------------------------------------------------------------
  function renderDropdownContent() {
    return (
      <>
        {/* 1. Header & Title */}
        <div className="p-4 pb-3 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>North East Languages</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    8 States
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Select your preferred regional dialect or English
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Close language picker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Assamese, Mizo, Khasi, Nagaland..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* State Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-none no-scrollbar">
            {states.map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedState(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  selectedState === st.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Scrollable Language List */}
        <div className="flex-1 overflow-y-auto max-h-[360px] p-3 space-y-4 divide-y divide-slate-100">
          
          {/* Requirement 2: English Option clearly pinned at top */}
          {englishLang && (!searchQuery || englishLang.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
            <div className="pb-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                <span>Default / Primary</span>
                <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                  Universal
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => handleSelect(englishLang.code)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-150 text-left ${
                  currentLangCode === englishLang.code
                    ? 'bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 shadow-xs'
                    : 'hover:bg-slate-50 text-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                    currentLangCode === englishLang.code
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {englishLang.isoCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {englishLang.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        (EN)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Standard English &bull; All 8 States
                    </p>
                  </div>
                </div>

                {currentLangCode === englishLang.code && (
                  <div className="flex items-center gap-1 text-indigo-600 font-bold text-[11px] bg-white px-2 py-1 rounded-lg border border-indigo-200/60 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Requirement 3: North East Languages grouped by State */}
          {Object.keys(stateGroups).length > 0 ? (
            Object.entries(stateGroups).map(([stateName, langs]) => (
              <div key={stateName} className="pt-3 first:pt-0">
                
                {/* State Section Header */}
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">
                      {stateName}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {langs.length} {langs.length === 1 ? 'dialect' : 'dialects'}
                  </span>
                </div>

                {/* State Languages Grid/List */}
                <div className="space-y-1">
                  {langs.map(lang => {
                    const isSelected = currentLangCode === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-150 text-left group ${
                          isSelected
                            ? 'bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 shadow-xs'
                            : 'hover:bg-slate-50 text-slate-800 border border-transparent hover:border-slate-200/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-hover:text-slate-900'
                          }`}>
                            {lang.isoCode}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                {lang.name}
                              </span>
                              {lang.nativeName && (
                                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-1.5 py-0.2 rounded border border-emerald-100">
                                  {lang.nativeName}
                                </span>
                              )}
                            </div>
                            
                            {/* Script & Greeting info */}
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span>{lang.script} Script</span>
                              {lang.greeting && (
                                <>
                                  <span className="text-slate-300">&bull;</span>
                                  <span className="text-slate-600 truncate max-w-[140px]" title={lang.greeting}>
                                    "{lang.greeting}"
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-xs flex-shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0">
                            {lang.stateCode}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center px-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">No language matches found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching for state names like "Assam", "Manipur", "Nagaland", or "Mizo"
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedState('ALL'); }}
                className="mt-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>

        {/* 3. Footer Bar with Quick Switch Feedback */}
        <div className="p-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">
              {languages.length} North East Languages
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            MDoNER &bull; PostGIS i18n
          </span>
        </div>
      </>
    );
  }
}
