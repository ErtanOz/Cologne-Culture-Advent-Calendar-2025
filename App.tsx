
import React, { useState, useEffect } from 'react';
import { CalendarDay, EditModalTranslations } from './types';
import { DayWindow } from './components/DayWindow';
import { EditModal } from './components/EditModal';
import { CologneSkyline } from './components/CologneSkyline';
import { BackgroundMusic } from './components/BackgroundMusic';
import { Settings, Lock, Unlock, Download, Globe } from 'lucide-react';

// -----------------------------------------------------------------------------
// ANLEITUNG ZUM VERÖFFENTLICHEN:
// 1. Bearbeite deinen Kalender im Browser (?admin=true).
// 2. Klicke im Admin-Modus auf "Export Data".
// 3. Füge den kopierten Text unten zwischen die eckigen Klammern von STATIC_DATA ein.
// -----------------------------------------------------------------------------
const STATIC_DATA: CalendarDay[] = [];
// -----------------------------------------------------------------------------

const TOTAL_DAYS = 24;

type Language = 'de' | 'en';

const TRANSLATIONS = {
  de: {
    title: "Kölner Kultur Adventskalender 2025",
    subtitle: "Tag für Tag wird ein verborgener Kunst- und Denkmalschatz Kölns enthüllt, neu interpretiert und überraschend in Szene gesetzt.",
    adminButton: "Admin",
    editingOn: "Bearbeiten",
    exportData: "Daten exportieren",
    exportAlert: "Daten kopiert! \n\nFüge diese Daten nun in die Datei 'App.tsx' bei 'const STATIC_DATA = ...' ein, um den Kalender für alle sichtbar zu machen.",
    exportError: "Fehler beim Kopieren. Prüfe die Konsole.",
    infoBanner: "Klicke auf ein Fenster, um Bild und Link hinzuzufügen. Vergiss nicht, danach zu 'Exportieren'!",
    footer: "Mit festlicher Stimmung erstellt",
    dayEditLabel: "Bearbeiten",
    shareLabel: "Teilen",
    copyLabel: "Link kopieren",
    copiedLabel: "Link kopiert!",
    lockedLabel: "Noch nicht geöffnet! 🎄",
    modal: {
      editDay: "Tag bearbeiten",
      titleLabel: "Titel / Beschriftung",
      titlePlaceholder: "z.B. Weihnachtsmarkt am Dom",
      titleHelp: "Ein kurzer Name für die Überraschung des Tages.",
      imageLabel: "Bild/GIF URL",
      imagePlaceholder: "https://beispiel.de/bild.gif",
      imageHelp: "Leer lassen, um das Fragezeichen (?) anzuzeigen.",
      linkLabel: "Ziel-Link URL",
      linkPlaceholder: "https://youtube.com/...",
      linkHelp: "Wohin soll der Nutzer gelangen, wenn er auf das Bild klickt?",
      preview: "Vorschau",
      clear: "Leeren",
      cancel: "Abbrechen",
      save: "Speichern"
    }
  },
  en: {
    title: "Cologne Culture Advent Calendar 2025",
    subtitle: "Day by day, a hidden art and monument treasure of Cologne is revealed, reinterpreted, and surprisingly showcased.",
    adminButton: "Admin",
    editingOn: "Editing",
    exportData: "Export Data",
    exportAlert: "Data copied! \n\nNow paste this data into the 'App.tsx' file at 'const STATIC_DATA = ...' to make your calendar visible to everyone.",
    exportError: "Error copying. Check console for data.",
    infoBanner: "Click on a window to add an image and link. Don't forget to 'Export' afterwards!",
    footer: "Made with holiday spirit",
    dayEditLabel: "Edit",
    shareLabel: "Share",
    copyLabel: "Copy Link",
    copiedLabel: "Link copied!",
    lockedLabel: "Not yet open! 🎄",
    modal: {
      editDay: "Edit Day",
      titleLabel: "Title / Caption",
      titlePlaceholder: "e.g. Christmas Market at Dom",
      titleHelp: "A short name for the day's surprise.",
      imageLabel: "Image/GIF URL",
      imagePlaceholder: "https://example.com/image.gif",
      imageHelp: "Leave empty to show the question mark (?).",
      linkLabel: "Target Link URL",
      linkPlaceholder: "https://youtube.com/...",
      linkHelp: "Where should the user go when they click the image?",
      preview: "Preview",
      clear: "Clear",
      cancel: "Cancel",
      save: "Save Changes"
    }
  }
};

// Initial data generation
const generateInitialData = (): CalendarDay[] => {
  return Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    day: i + 1,
    imageUrl: '',
    linkUrl: '',
    title: '',
  }));
};

const App: React.FC = () => {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminAccess, setIsAdminAccess] = useState(false);
  const [lang, setLang] = useState<Language>('de');

  const t = TRANSLATIONS[lang];

  // Check for admin URL parameter and Deep Linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Admin Check
    if (params.get('admin') === 'true') {
      setIsAdminAccess(true);
    }

    // Deep Link Scroll
    const dayParam = params.get('day');
    if (dayParam) {
      // Use a timeout to ensure DOM is ready after React renders initial state
      setTimeout(() => {
        const dayElement = document.getElementById(`day-${dayParam}`);
        if (dayElement) {
          dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Add a temporary highlight effect
          dayElement.classList.add('ring-4', 'ring-gold-400');
          setTimeout(() => dayElement.classList.remove('ring-4', 'ring-gold-400'), 2000);
        }
      }, 500);
    }
  }, []);

  // Load data: Priority 1: LocalStorage (User edits), Priority 2: STATIC_DATA (Published), Priority 3: Empty
  useEffect(() => {
    const savedData = localStorage.getItem('cologneAdventData');
    
    if (savedData) {
      // Migrate old data
      const parsed = JSON.parse(savedData);
      const migrated = parsed.map((d: any) => ({ ...d, title: d.title || '' }));
      setDays(migrated);
    } else if (STATIC_DATA && STATIC_DATA.length > 0) {
      setDays(STATIC_DATA);
    } else {
      setDays(generateInitialData());
    }
  }, []);

  // Save to local storage whenever days change
  useEffect(() => {
    if (days.length > 0) {
      localStorage.setItem('cologneAdventData', JSON.stringify(days));
    }
  }, [days]);

  const handleEditClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleSaveDay = (dayNum: number, imageUrl: string, linkUrl: string, title: string) => {
    setDays((prevDays) =>
      prevDays.map((d) =>
        d.day === dayNum ? { ...d, imageUrl, linkUrl, title } : d
      )
    );
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(days, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert(t.exportAlert);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert(t.exportError);
      console.log(dataStr);
    });
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'de' ? 'en' : 'de');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-red-950/40 overflow-x-hidden flex flex-col relative font-sans">
      
      {/* Top Controls (Admin + Language + Music) */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
        {/* Background Music Control */}
        <BackgroundMusic />

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md shadow-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <Globe size={16} />
          <span className="text-sm font-bold w-6 text-center">{lang.toUpperCase()}</span>
        </button>

        {/* Admin Buttons - Only visible if ?admin=true is in URL */}
        {isAdminAccess && (
          <>
            {isEditMode && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all border border-blue-400/30"
                title="Export data for App.tsx"
              >
                <Download size={16} />
                <span className="text-sm font-medium hidden sm:inline">{t.exportData}</span>
              </button>
            )}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 border border-white/10
                ${isEditMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}
              `}
            >
              {isEditMode ? <Unlock size={16} /> : <Settings size={16} />}
              <span className="text-sm font-medium hidden sm:inline">{isEditMode ? t.editingOn : t.adminButton}</span>
            </button>
          </>
        )}
      </div>

      {/* Header */}
      <header className="pt-12 md:pt-8 pb-4 px-4 text-center z-10 relative">
        <h1 className="text-4xl md:text-6xl font-bold font-christmas text-red-100 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] tracking-wide mb-2">
          {t.title}
        </h1>
        <p className="text-red-200/80 text-lg md:text-xl font-light max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      {/* Main Grid */}
      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-6xl">
           {/* Info Banner in Edit Mode */}
           {isEditMode && (
            <div className="bg-blue-500/20 border border-blue-500/50 text-blue-100 px-6 py-3 rounded-lg mb-8 text-center backdrop-blur-md animate-fade-in-down">
              <p className="flex items-center justify-center gap-2">
                <Edit2Icon className="w-4 h-4" /> 
                {t.infoBanner}
              </p>
            </div>
           )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {days.map((day) => (
              <DayWindow
                key={day.day}
                dayData={day}
                isEditMode={isEditMode}
                onEdit={handleEditClick}
                editLabel={t.dayEditLabel}
                shareLabel={t.shareLabel}
                copyLabel={t.copyLabel}
                copiedLabel={t.copiedLabel}
                lockedLabel={t.lockedLabel}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer / Skyline */}
      <footer className="mt-auto relative w-full">
         <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
         <CologneSkyline className="w-full text-red-950/40 relative z-0" />
         <div className="absolute bottom-2 w-full text-center text-white/20 text-xs z-10">
            {t.footer}
         </div>
      </footer>

      {/* Modals */}
      <EditModal
        dayData={selectedDay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDay}
        t={t.modal}
      />

    </div>
  );
};

// Helper icon component for inline usage
const Edit2Icon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

export default App;
