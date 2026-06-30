import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuranSurah, QuranAyah, Hadith, DuaItem, IslamicEvent, Article, TasbihHistory } from '../types';
import {
  initialSurahs,
  initialAyahs,
  initialHadiths,
  initialDuas,
  initialAllahNames,
  initialArticles,
  initialEvents,
  defaultSettings
} from '../data/initialData';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextType {
  // Data lists (backed by fallback + firebase overrides)
  surahs: QuranSurah[];
  ayahs: QuranAyah[];
  hadiths: Hadith[];
  duas: DuaItem[];
  articles: Article[];
  events: IslamicEvent[];
  allahNames: typeof initialAllahNames;

  // Selected Quran reader state
  selectedSurah: number | null;
  setSelectedSurah: React.Dispatch<React.SetStateAction<number | null>>;

  // Setters for Admin Features
  setSurahs: React.Dispatch<React.SetStateAction<QuranSurah[]>>;
  setAyahs: React.Dispatch<React.SetStateAction<QuranAyah[]>>;
  setHadiths: React.Dispatch<React.SetStateAction<Hadith[]>>;
  setDuas: React.Dispatch<React.SetStateAction<DuaItem[]>>;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setEvents: React.Dispatch<React.SetStateAction<IslamicEvent[]>>;

  // User state
  currentUser: any;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  loginAsAdmin: (email: string, password: string) => boolean;
  logout: () => void;

  // Bookmarks & Favorites
  bookmarkedAyahs: string[]; // ayah ids
  bookmarkedHadiths: string[]; // hadith ids
  bookmarkedDuas: string[]; // dua ids
  toggleBookmarkAyah: (id: string) => void;
  toggleBookmarkHadith: (id: string) => void;
  toggleBookmarkDua: (id: string) => void;

  // Tasbih
  tasbihCount: number;
  setTasbihCount: React.Dispatch<React.SetStateAction<number>>;
  activeTasbihName: string;
  setActiveTasbihName: (name: string) => void;
  tasbihHistory: TasbihHistory[];
  saveTasbihCounter: () => void;
  resetTasbihCounter: () => void;
  clearTasbihHistory: () => void;

  // App settings
  settings: typeof defaultSettings;
  updateSettings: (key: keyof typeof defaultSettings, value: any) => void;

  // Active audio player
  activeAudio: {
    title: string;
    url: string;
    isPlaying: boolean;
    duration?: number;
    currentTime?: number;
  } | null;
  playAudio: (title: string, url: string) => void;
  stopAudio: () => void;
  togglePlayPauseAudio: () => void;

  // Prayer time helper
  city: string;
  setCity: (city: string) => void;

  // Toast System
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load local state
  const [surahs, setSurahs] = useState<QuranSurah[]>(() => {
    const local = localStorage.getItem('noor_surahs');
    return local ? JSON.parse(local) : initialSurahs;
  });

  const [ayahs, setAyahs] = useState<QuranAyah[]>(() => {
    const local = localStorage.getItem('noor_ayahs');
    return local ? JSON.parse(local) : initialAyahs;
  });

  const [hadiths, setHadiths] = useState<Hadith[]>(() => {
    const local = localStorage.getItem('noor_hadiths');
    return local ? JSON.parse(local) : initialHadiths;
  });

  const [duas, setDuas] = useState<DuaItem[]>(() => {
    const local = localStorage.getItem('noor_duas');
    return local ? JSON.parse(local) : initialDuas;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const local = localStorage.getItem('noor_articles');
    return local ? JSON.parse(local) : initialArticles;
  });

  const [events, setEvents] = useState<IslamicEvent[]>(() => {
    const local = localStorage.getItem('noor_events');
    return local ? JSON.parse(local) : initialEvents;
  });

  // User & Admin states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  // Bookmarks
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<string[]>(() => {
    const local = localStorage.getItem('noor_b_ayahs');
    return local ? JSON.parse(local) : [];
  });
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<string[]>(() => {
    const local = localStorage.getItem('noor_b_hadiths');
    return local ? JSON.parse(local) : [];
  });
  const [bookmarkedDuas, setBookmarkedDuas] = useState<string[]>(() => {
    const local = localStorage.getItem('noor_b_duas');
    return local ? JSON.parse(local) : [];
  });

  // Tasbih State
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    const local = localStorage.getItem('noor_tasbih_count');
    return local ? parseInt(local) : 0;
  });
  const [activeTasbihName, setActiveTasbihName] = useState<string>("SubhanAllah");
  const [tasbihHistory, setTasbihHistory] = useState<TasbihHistory[]>(() => {
    const local = localStorage.getItem('noor_tasbih_history');
    return local ? JSON.parse(local) : [];
  });

  // Settings
  const [settings, setSettings] = useState<typeof defaultSettings>(() => {
    const local = localStorage.getItem('noor_settings');
    return local ? { ...defaultSettings, ...JSON.parse(local) } : defaultSettings;
  });

  // Audio player state
  const [activeAudio, setActiveAudio] = useState<AppContextType['activeAudio']>(null);

  // City for prayer times
  const [city, setCity] = useState<string>("Dhaka");

  // Toast System State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasCheckedSettings, setHasCheckedSettings] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem('noor_surahs', JSON.stringify(surahs));
  }, [surahs]);

  useEffect(() => {
    localStorage.setItem('noor_ayahs', JSON.stringify(ayahs));
  }, [ayahs]);

  useEffect(() => {
    localStorage.setItem('noor_hadiths', JSON.stringify(hadiths));
  }, [hadiths]);

  useEffect(() => {
    localStorage.setItem('noor_duas', JSON.stringify(duas));
  }, [duas]);

  useEffect(() => {
    localStorage.setItem('noor_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('noor_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('noor_b_ayahs', JSON.stringify(bookmarkedAyahs));
  }, [bookmarkedAyahs]);

  useEffect(() => {
    localStorage.setItem('noor_b_hadiths', JSON.stringify(bookmarkedHadiths));
  }, [bookmarkedHadiths]);

  useEffect(() => {
    localStorage.setItem('noor_b_duas', JSON.stringify(bookmarkedDuas));
  }, [bookmarkedDuas]);

  useEffect(() => {
    localStorage.setItem('noor_tasbih_count', tasbihCount.toString());
  }, [tasbihCount]);

  useEffect(() => {
    localStorage.setItem('noor_tasbih_history', JSON.stringify(tasbihHistory));
  }, [tasbihHistory]);

  useEffect(() => {
    localStorage.setItem('noor_settings', JSON.stringify(settings));
    // Apply theme class
    const root = window.document.documentElement;
    if (settings.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Sync to Firestore settings collection only if user is authenticated in Firebase as administrator
    // We check isFirestoreSynced to ensure we don't overwrite cloud settings with local settings on load
    const isAuthAdmin = auth?.currentUser && (
      auth.currentUser.email === 'sadikullhaque999@gmail.com' ||
      auth.currentUser.email === 'sadikullhaque99@gmail.com' ||
      auth.currentUser.email?.startsWith('admin@')
    );

    if (db && isAdmin && isAuthAdmin && isFirestoreSynced) {
      setDoc(doc(db, 'settings', 'global'), settings).catch(err => {
        try {
          handleFirestoreError(err, OperationType.WRITE, 'settings/global');
        } catch (e) {
          console.warn("Could not save settings to Firestore:", e);
        }
      });
    }
  }, [settings, isAdmin, currentUser, isFirestoreSynced]);

  // Auth Sync (Firebase if enabled)
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
          // Check for admin email (default admin is the user email from metadata)
          if (user.email === 'sadikullhaque999@gmail.com' || user.email === 'sadikullhaque99@gmail.com' || user.email?.startsWith('admin@')) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      });
      return unsubscribe;
    }
  }, []);

  // Monitor auth state and run one-time check/write to /settings/global upon successful login
  useEffect(() => {
    let active = true;
    if (db && currentUser && auth?.currentUser && !hasCheckedSettings) {
      const checkAndSeedGlobalSettings = async () => {
        try {
          const settingsDocRef = doc(db, 'settings', 'global');
          const docSnap = await getDoc(settingsDocRef);
          
          if (!active) return;
          if (!docSnap.exists()) {
            console.log("Global settings document not found, initializing in Firestore...");
            await setDoc(settingsDocRef, defaultSettings);
            showToast("Global settings initialized in Firestore successfully!", "success");
          } else {
            console.log("Global settings document verified.");
          }
          setHasCheckedSettings(true);
        } catch (err: any) {
          console.warn("Could not check or initialize global settings in Firestore:", err);
          showToast(`settings/global check failed: ${err.message || "Permission denied"}`, "error");
          setHasCheckedSettings(true);
        }
      };
      checkAndSeedGlobalSettings();
    }
    return () => {
      active = false;
    };
  }, [currentUser, hasCheckedSettings]);

  // Sync with Firestore on mount or when currentUser/isAdmin changes
  useEffect(() => {
    async function syncFirestoreData() {
      if (db) {
        try {
          const isAuthAdmin = auth?.currentUser && (
            auth.currentUser.email === 'sadikullhaque999@gmail.com' ||
            auth.currentUser.email === 'sadikullhaque99@gmail.com' ||
            auth.currentUser.email?.startsWith('admin@')
          );
          const canSeed = isAdmin && isAuthAdmin;

          // 1. Surahs
          let surahsSnap;
          try {
            surahsSnap = await getDocs(collection(db, 'surahs'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'surahs');
            return;
          }

          if (!surahsSnap.empty) {
            setSurahs(surahsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding surahs collection...");
            for (const s of initialSurahs) {
              try {
                await setDoc(doc(db, 'surahs', `surah_${s.number}`), s);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `surahs/surah_${s.number}`);
              }
            }
          }

          // 2. Ayahs
          let ayahsSnap;
          try {
            ayahsSnap = await getDocs(collection(db, 'ayahs'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'ayahs');
            return;
          }

          if (!ayahsSnap.empty) {
            setAyahs(ayahsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding ayahs collection...");
            for (const a of initialAyahs) {
              try {
                await setDoc(doc(db, 'ayahs', a.id), a);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `ayahs/${a.id}`);
              }
            }
          }

          // 3. Hadith & Hadiths (syncing both singular and plural)
          let hadithSnap;
          try {
            hadithSnap = await getDocs(collection(db, 'hadith'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'hadith');
            return;
          }

          if (hadithSnap.empty && canSeed) {
            console.log("Seeding hadith collection...");
            for (const h of initialHadiths) {
              try {
                await setDoc(doc(db, 'hadith', h.id), h);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `hadith/${h.id}`);
              }
            }
          }

          let hadithsSnap;
          try {
            hadithsSnap = await getDocs(collection(db, 'hadiths'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'hadiths');
            return;
          }

          if (!hadithsSnap.empty) {
            setHadiths(hadithsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding hadiths collection...");
            for (const h of initialHadiths) {
              try {
                await setDoc(doc(db, 'hadiths', h.id), h);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `hadiths/${h.id}`);
              }
            }
          }

          // 4. Duas
          let duasSnap;
          try {
            duasSnap = await getDocs(collection(db, 'duas'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'duas');
            return;
          }

          if (!duasSnap.empty) {
            setDuas(duasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding duas collection...");
            for (const d of initialDuas) {
              try {
                await setDoc(doc(db, 'duas', d.id), d);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `duas/${d.id}`);
              }
            }
          }

          // 5. Articles
          let articlesSnap;
          try {
            articlesSnap = await getDocs(collection(db, 'articles'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'articles');
            return;
          }

          if (!articlesSnap.empty) {
            setArticles(articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding articles collection...");
            for (const art of initialArticles) {
              try {
                await setDoc(doc(db, 'articles', art.id), art);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `articles/${art.id}`);
              }
            }
          }

          // 6. Quran (general/meta info)
          let quranSnap;
          try {
            quranSnap = await getDocs(collection(db, 'quran'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'quran');
            return;
          }

          if (quranSnap.empty && canSeed) {
            console.log("Seeding quran collection...");
            const sampleQuranMeta = [
              { id: "info", title: "Introduction to the Noble Quran", desc: "The holy book of Islam, revealed to Prophet Muhammad (PBUH)." },
              { id: "stats", totalSurahs: 114, totalAyahs: 6236 }
            ];
            for (const q of sampleQuranMeta) {
              try {
                await setDoc(doc(db, 'quran', q.id), q);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `quran/${q.id}`);
              }
            }
          }

          // 7. Categories
          let categoriesSnap;
          try {
            categoriesSnap = await getDocs(collection(db, 'categories'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'categories');
            return;
          }

          if (categoriesSnap.empty && canSeed) {
            console.log("Seeding categories collection...");
            const sampleCategories = [
              { id: "quran", name: "Quranic Sciences" },
              { id: "hadith", name: "Hadith Studies" },
              { id: "fiqh", name: "Fiqh & Jurisprudence" },
              { id: "history", name: "Islamic History" }
            ];
            for (const cat of sampleCategories) {
              try {
                await setDoc(doc(db, 'categories', cat.id), cat);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `categories/${cat.id}`);
              }
            }
          }

          // 8. PrayerTimes
          let prayerTimesSnap;
          try {
            prayerTimesSnap = await getDocs(collection(db, 'prayerTimes'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'prayerTimes');
            return;
          }

          if (prayerTimesSnap.empty && canSeed) {
            console.log("Seeding prayerTimes collection...");
            const samplePrayerTimes = [
              { id: "fajr", name: "Fajr", defaultTime: "04:30" },
              { id: "dhuhr", name: "Dhuhr", defaultTime: "12:15" },
              { id: "asr", name: "Asr", defaultTime: "15:45" },
              { id: "maghrib", name: "Maghrib", defaultTime: "18:40" },
              { id: "isha", name: "Isha", defaultTime: "20:00" }
            ];
            for (const pt of samplePrayerTimes) {
              try {
                await setDoc(doc(db, 'prayerTimes', pt.id), pt);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `prayerTimes/${pt.id}`);
              }
            }
          }

          // 9. Settings
          let settingsSnap;
          try {
            settingsSnap = await getDocs(collection(db, 'settings'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'settings');
            return;
          }

          if (settingsSnap.empty && canSeed) {
            console.log("Seeding settings collection...");
            try {
              await setDoc(doc(db, 'settings', 'global'), defaultSettings);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, 'settings/global');
            }
          } else if (!settingsSnap.empty) {
            const globalSettingsDoc = settingsSnap.docs.find(d => d.id === 'global');
            if (globalSettingsDoc) {
              setSettings(prev => ({ ...prev, ...globalSettingsDoc.data() }));
            }
          }

          // 10. Events
          let eventsSnap;
          try {
            eventsSnap = await getDocs(collection(db, 'events'));
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'events');
            return;
          }

          if (!eventsSnap.empty) {
            setEvents(eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
          } else if (canSeed) {
            console.log("Seeding events collection...");
            for (const ev of initialEvents) {
              try {
                await setDoc(doc(db, 'events', ev.id), ev);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `events/${ev.id}`);
              }
            }
          }

          // Mark sync complete to allow user-triggered settings changes to be saved
          setIsFirestoreSynced(true);

        } catch (err: any) {
          console.warn("Firestore sync/seed status:", err.message || err);
          // Set to true even if there was a seeding warning to unblock the UI saving
          setIsFirestoreSynced(true);
        }
      }
    }
    syncFirestoreData();
  }, [currentUser, isAdmin]);

  // Admin login helper (with memory credentials fallback)
  const loginAsAdmin = (email: string, password: string) => {
    const isSpecialAdmin = (email === 'sadikullhaque99@gmail.com' && password === 'sadikull123') || 
                           (email === 'sadikullhaque999@gmail.com' && password === 'sadikull123') ||
                           password === 'admin123' || password === 'NoorIslam2026';
    if (isSpecialAdmin) {
      setIsAdmin(true);
      setCurrentUser({
        uid: 'admin_uid',
        email: email || 'sadikullhaque99@gmail.com',
        displayName: 'Administrator',
        role: 'admin'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (auth) {
      auth.signOut();
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setIsFirestoreSynced(false);
  };

  // Toggle Bookmark logic
  const toggleBookmarkAyah = (id: string) => {
    setBookmarkedAyahs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleBookmarkHadith = (id: string) => {
    setBookmarkedHadiths(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleBookmarkDua = (id: string) => {
    setBookmarkedDuas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Tasbih actions
  const saveTasbihCounter = () => {
    if (tasbihCount > 0) {
      const record: TasbihHistory = {
        id: 'tasbih_' + Date.now(),
        name: activeTasbihName,
        count: tasbihCount,
        date: new Date().toLocaleDateString()
      };
      setTasbihHistory(prev => [record, ...prev]);
      setTasbihCount(0);
    }
  };

  const resetTasbihCounter = () => {
    setTasbihCount(0);
  };

  const clearTasbihHistory = () => {
    setTasbihHistory([]);
  };

  // Settings
  const updateSettings = (key: keyof typeof defaultSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Audio system simulation
  const playAudio = (title: string, url: string) => {
    setActiveAudio({
      title,
      url,
      isPlaying: true,
      duration: 120, // simulate duration
      currentTime: 0
    });
  };

  const stopAudio = () => {
    setActiveAudio(null);
  };

  const togglePlayPauseAudio = () => {
    if (activeAudio) {
      setActiveAudio({
        ...activeAudio,
        isPlaying: !activeAudio.isPlaying
      });
    }
  };

  return (
    <AppContext.Provider value={{
      surahs, ayahs, hadiths, duas, articles, events, allahNames: initialAllahNames,
      setSurahs, setAyahs, setHadiths, setDuas, setArticles, setEvents,
      currentUser, isAdmin, setIsAdmin, setCurrentUser, loginAsAdmin, logout,
      bookmarkedAyahs, bookmarkedHadiths, bookmarkedDuas,
      toggleBookmarkAyah, toggleBookmarkHadith, toggleBookmarkDua,
      tasbihCount, setTasbihCount, activeTasbihName, setActiveTasbihName,
      tasbihHistory, saveTasbihCounter, resetTasbihCounter, clearTasbihHistory,
      settings, updateSettings,
      activeAudio, playAudio, stopAudio, togglePlayPauseAudio,
      city, setCity,
      selectedSurah, setSelectedSurah,
      toast, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
