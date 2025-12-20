
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
// 3. Füge den kopierten Text unten als Partial<CalendarDay> Objekte ein.
// 4. Nur Tage mit Inhalt müssen definiert werden - leere Tage werden automatisch generiert.
// -----------------------------------------------------------------------------
// Optimiert: Nur Tage mit tatsächlichem Inhalt werden hier gespeichert
const STATIC_DATA: Partial<CalendarDay>[] = [
  {
    day: 1,
    imageUrl: "https://media-cdn.holidaycheck.com/w_2880,h_1620,c_fit,q_auto,f_auto/ugc/images/134f2038-5eff-30ff-9c06-29578567e672",
    linkUrl: "https://www.youtube.com/watch?v=EnlRd0ceLRU",
    title: "Tag 1: Tünnes und Schäl",
  },
  {
    day: 2,
    imageUrl: "https://www.meisterdrucke.com/kunstwerke/1260px/Max_Liebermann_-_The_Bleaching_of_Linen_1882_-_(MeisterDrucke-764448).jpg",
    linkUrl: "https://youtu.be/kn8a8FCdMZ8",
    title: "Das Bleichen von Leinen",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 2, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 3,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Weihestein_Vagdavercustis.JPG",
    linkUrl: "https://www.youtube.com/watch?v=ztSp9LAu4EE&list=PLlpjEPcD1L8QDTtaoapPD4MnLINEG14vD",
    title: "Tag 3: Römische Denkmal für die Gottheiten",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 2, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 4,
    imageUrl: "https://img.destination.one/remote/.webp?url=https%3A%2F%2Fdam.destination.one%2F2567659%2Fc7bcfa0727b5d923f0da1fb7cffccdebacbd495490b67d12e48f8636ceac0844%2Fwilly-millowitsch-denkmal.jpg&scale=both&mode=crop&quality=90&width=707https://img.destination.one/remote/.webp?url=https%3A%2F%2Fdam.destination.one%2F2567659%2Fc7bcfa0727b5d923f0da1fb7cffccdebacbd495490b67d12e48f8636ceac0844%2Fwilly-millowitsch-denkmal.jpg",
    linkUrl: "https://youtube.com/shorts/S5uw_9jhiwQ",
    title: "Tag 4: Willy Millowitsch Denkmal ",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 2, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 5,
    imageUrl: "https://museenkoeln.de/portal/medien/img_bdw/hi/2001_14.jpg",
    linkUrl: "https://www.youtube.com/shorts/HUGAk6URnwU?feature=share",
    title: "𝗧𝗮𝗴 𝟱: 𝗖𝗵𝗿𝗶𝘀𝘁𝘂𝘀 𝗮𝘂𝗳 𝗱𝗲𝗺 𝗣𝗮𝗹𝗺𝗲𝘀𝗲𝗹, 𝘂𝗺 𝟭𝟱𝟮𝟬 (𝗠𝘂𝘀𝗲𝘂𝗺 𝗦𝗰𝗵𝗻𝘂𝘁𝗴𝗲𝗻)",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 6, imageUrl: "...", linkUrl: "...", title: "..." },
   {
    day: 6,
    imageUrl: "https://rp-online.de/imgs/32/2/0/4/1/4/6/7/5/tok_fb1006db870b8e7ffa55b61c89f2572b/w940_h528_x470_y264_6ec27c188e599122.jpg",
    linkUrl: "https://youtu.be/IJnD2wMCtiM",
    title: "𝗧𝗮𝗴 𝟲: 𝗗𝗲𝗿 𝗕𝗮𝗵𝗻𝗵𝗼𝗳 𝘃𝗼𝗻 𝗣𝗲𝗿𝗽𝗶𝗴𝗻𝗮𝗻, 𝗦𝗮𝗹𝘃𝗮𝗱𝗼𝗿 𝗗𝗮𝗹𝗶, (𝗞𝗼𝗹𝗻𝗲𝗿 𝗠𝘂𝘀𝗲𝘂𝗺 𝗟𝘂𝗱𝘄𝗶𝗴)",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 6, imageUrl: "...", linkUrl: "...", title: "..." },
   {
    day: 7,
    imageUrl: "https://www.lempertz.com//lempertz_api/images/1064-134-Carl-Ruedell-View-of-the-Old.jpg",
    linkUrl: "https://youtube.com/shorts/A594a6uY3-8",
    title: "𝗧𝗮𝗴 𝟳 – 𝗖𝗮𝗿𝗹 𝗥𝘂𝗱𝗲𝗹𝗹 - 𝗞ö𝗹𝗻𝗲𝗿 𝗔𝗹𝘁𝘀𝘁𝗮𝗱𝘁 𝗺𝗶𝘁 𝗚𝗿𝗼ß 𝗦𝘁. 𝗠𝗮𝗿𝘁𝗶𝗻 𝘂𝗻𝗱 𝘀𝗽𝗶𝗲𝗹𝗲𝗻𝗱𝗲𝗻 𝗞𝗶𝗻𝗱𝗲𝗿𝗻 (𝟭𝟵. 𝗝𝗵.)"},
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 7, imageUrl: "...", linkUrl: "...", title: "..." },
   {
    day: 8,
    imageUrl: "https://museum-fuer-ostasiatische-kunst.de/medien/abb/2647/44716__2759315_lo.jpg",
    linkUrl: "https://youtube.com/shorts/0t8j2iGuSbk",
    title: "𝗧𝗮𝗴 𝟴: Ü𝗯𝗲𝗿 𝗱𝗶𝗲 „𝗟𝗶𝗻𝗶𝗲“ – 𝗠𝘂𝘀𝗲𝘂𝗺 𝗳𝘂𝗿 𝗢𝘀𝘁𝗮𝘀𝗶𝗮𝘁𝗶𝘀𝗰𝗵𝗲𝘀 𝗞𝘂𝗻𝘀𝘁 𝗞ö𝗹𝗻",
   },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 9, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 9,
    imageUrl: "https://www.wallraf.museum/fileadmin/user_upload/content/Ausstellungen/2025/2025-11-14-Expedition_Zeichnung/Teaser/Teaserfoto_Website_Expedition_Zeichnung.jpg",
    linkUrl: "https://youtu.be/8N_3Z22UtbM",
    title: "𝗧𝗮𝗴 𝟵: 𝗔𝗻𝘀𝗶𝗰𝗵𝘁 𝘃𝗼𝗻 𝗠ü𝗹𝗵𝗲𝗶𝗺 𝗮𝘂𝘀. 𝗗𝗼𝗼𝗺𝗲𝗿, 𝗟𝗮𝗺𝗯𝗲𝗿𝘁 𝗞ö𝗹𝗻. 𝗪𝗮𝗹𝗹𝗿𝗮𝗳-𝗥𝗶𝗰𝗵𝗮𝗿𝘁𝘇-𝗠𝘂𝘀𝗲𝘂𝗺",
  },
  {
    day: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rathausturm_K%C3%B6ln_-_Evergislus_-_Severin_-_Jabbek_-_Maternus_-_Ursula_%284171-73%29.jpg",
    linkUrl: "https://youtu.be/GwCVMvRaxXY",
    title: "𝗧𝗮𝗴 𝟭𝟬: 𝗗𝗲𝗿 𝗣𝗹𝗮𝘁𝘇𝗷𝗮𝗯𝗯𝗲𝗰𝗸",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 11, imageUrl: "...", linkUrl: "...", title: "..." },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 9, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 11,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/St._C%C3%A4cilien_K%C3%B6ln_-_Totentanz_-_Harald_Naegeli_%287900-02%29.jpg",
    linkUrl: "https://youtube.com/shorts/TNELDlcZF18",
    title: "𝗧𝗮𝗴 𝟭1: Der Kölner Totentanz an St. Cäcilien (2010), Museum Schnütgen ",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 12, imageUrl: "...", linkUrl: "...", title: "..." },
   {
    day: 12,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Alter_Markt_K%C3%B6ln_um_1850.jpg",
    linkUrl: "https://youtu.be/UkQPq_SW7fw",
    title: "𝗧𝗮𝗴 𝟭2: Alter Markt Köln um 1850",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 13, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 13,
    imageUrl: "https://sportmuseum.de/media/pages/unser-museum/sammlung/4dbdc2465f-1649057235/13-06-7.jpg",
    linkUrl: "https://youtube.com/watch?v=mQd0MU92JKQ",
    title: "𝗧𝗮𝗴 𝟭𝟯: 𝗗𝗲𝘂𝘁𝘀𝗰𝗵𝗲𝘀 𝗧𝘂𝗿𝗻𝗳𝗲𝘀𝘁 𝟭𝟵𝟮𝟴 𝗶𝗻 𝗞𝗼𝗹𝗻 | 𝗗𝗲𝘂𝘁𝘀𝗰𝗵𝗲𝘀 𝗦𝗽𝗼𝗿𝘁 & 𝗢𝗹𝘆𝗺𝗽𝗶𝗮 𝗠𝘂𝘀𝗲𝘂𝗺",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 14, imageUrl: "...", linkUrl: "...", title: "..." },  
  {
    day: 14,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Ostermannbrunnen%2C_Ostermannplatz%2C_K%C3%B6ln-9969.jpg",
    linkUrl: "https://youtu.be/MoQ8vVhodL8",
    title: "Tag 14: Der Ostermann-Brunnen (1939)",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 15, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 15,
    imageUrl: "https://www.erzbistum-koeln.de/export/sites/ebkportal/.content/.galleries/news/2025/251007_suitbertus/Suitbertusschrei_Langseite_C.jpg_830849982.jpg",
    linkUrl: "https://youtu.be/0LqQLol2s-s",
    title: "Tag 15: Der Kaiserswerther Suitbertusschrein, Kölner Domschatzkammer",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 16, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 16,
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy8NByKKAyhlimTqIzV4VV7iY7-Ly0lqkWwNkDnzeeyJbAgcszl8M6kjxzez5GfkjQx4nfYiLheDjPbcTnxBOOiH_gfiehTnWPIZ1hLFo8dQJ5ZY3jA1pc3quexKPPxFhQvbPq3FQ=s680-w680-h510-rw",
    linkUrl: "https://youtube.com/shorts/4H81Uy1QiUo",
    title: "Tag 16: Die Statue Harihara, RJM Köln",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 17, imageUrl: "...", linkUrl: "...", title: "..." },
 {
    day: 17,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Wandgem%C3%A4lde_Gie%C3%9Fener_Stra%C3%9Fe%2C_K%C3%B6ln-Humboldt-49772_%28cropped%29.jpg",
    linkUrl: "https://www.youtube.com/shorts/DPbrlldW7CU",
    title: "Tag 17: Der Wanderer 4.0, das Wandgemälde im Kölner Stadtteil Kalk",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 17, imageUrl: "...", linkUrl: "...", title: "..." },
 {
    day: 18,
    imageUrl: "https://makk.de/assets/static/images/1-3_teaser/_n33_teaser/E2109.jpg",
    linkUrl: "https://youtu.be/rAgLmnhOYIw",
    title: "𝗧𝗮𝗴 𝟭𝟴: 𝗙𝗔𝗩𝗦𝗧𝗜𝗡𝗔 𝗗𝗜𝗩𝗔, 𝗘𝗶𝗻 𝗕𝗹𝗶𝗰𝗸 𝗶𝗻 𝗱𝗶𝗲 𝗚𝗲𝘀𝗰𝗵𝗶𝗰𝗵𝘁𝗲  (𝗠𝘂𝘀𝗲𝘂𝗺 𝗠𝗔𝗞𝗞)",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 19, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 19,
    imageUrl: "https://img.destination.one/remote/.webp?url=https%3A%2F%2Fdam.destination.one%2F1749399%2Fbdf4fe3283f217abe88ac3ccf7119e519e0d21f3ef35d2e912b249984ae593dd%2Fheinzelmaennchenbrunnen.jpg",
    linkUrl: "https://youtu.be/mxgSf3uUJcA",
    title: "𝗧𝗮𝗴 𝟭𝟵: 𝗛𝗲𝗶𝗻𝘇𝗲𝗹𝗺ä𝗻𝗻𝗰𝗵𝗲𝗻𝗯𝗿𝘂𝗻𝗻𝗲𝗻 𝟭𝟴𝟵𝟵/𝟭𝟵𝟬𝟬",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 20, imageUrl: "...", linkUrl: "...", title: "..." },
  {
    day: 20,
    imageUrl: "https://img.destination.one/remote/.webp?url=https%3A%2F%2Fdam.destination.one%2F3444509%2Fe6dc04915ba56fdb6503bcfb058fb4b0b44e9d4962f49359c9f0df4a8b5c3f7b%2Fecce-homo-k-ln-um-1460-1500-lindenholz-mit-vier-fassungen.jpg",
    linkUrl: "https://youtu.be/5aimCtIllVg",
    title: "𝗧𝗮𝗴 20: Eco Hommo, Columba Museum",
  },
  // Weitere Tage hier hinzufügen, wenn sie Inhalt haben
  // Beispiel: { day: 20, imageUrl: "...", linkUrl: "...", title: "..." },

  
];

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

// Merge static data with generated defaults
const mergeStaticData = (): CalendarDay[] => {
  const defaults = generateInitialData();
  
  // Create a map for quick lookup
  const staticMap = new Map(
    STATIC_DATA.map(item => [item.day, item])
  );
  
  // Merge: defaults with static data overlay
  return defaults.map(day => ({
    ...day,
    ...(staticMap.get(day.day) || {})
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
      // Merge static data with generated defaults for all 24 days
      setDays(mergeStaticData());
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
