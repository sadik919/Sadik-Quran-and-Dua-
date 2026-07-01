import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTranslation } from './utils/translations';
import SplashScreen from './components/SplashScreen';
import QuranSection from './components/QuranSection';
import HadithSection from './components/HadithSection';
import DuaSection from './components/DuaSection';
import PrayerTimesSection from './components/PrayerTimesSection';
import TasbihSection from './components/TasbihSection';
import QiblaSection from './components/QiblaSection';
import NamesSection from './components/NamesSection';
import CalendarSection from './components/CalendarSection';
import ArticlesSection from './components/ArticlesSection';
import AuthSection from './components/AuthSection';
import AdminPanel from './components/AdminPanel';

import {
  Home,
  BookOpen,
  Book,
  Heart,
  Grid,
  User,
  Settings,
  Compass,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Moon,
  Sun,
  Shield,
  ChevronRight,
  Sparkles,
  Calendar,
  Newspaper,
  Bookmark,
  Share2,
  Copy,
  Info,
  MapPin,
  ShieldAlert,
  Mail,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Coordinates matching PrayerTimesSection for consistency
const CITY_COORDINATES: Record<string, { lat: number; lng: number; timezone: number }> = {
  "Dhaka": { lat: 23.8103, lng: 90.4125, timezone: 6 },
  "London": { lat: 51.5074, lng: -0.1278, timezone: 1 },
  "New York": { lat: 40.7128, lng: -74.0060, timezone: -4 },
  "Riyadh": { lat: 24.7136, lng: 46.6753, timezone: 3 },
  "Cairo": { lat: 30.0444, lng: 31.2357, timezone: 3 },
  "Jakarta": { lat: -6.2088, lng: 106.8456, timezone: 7 },
  "Kuala Lumpur": { lat: 3.1390, lng: 101.6869, timezone: 8 },
  "Sydney": { lat: -33.8688, lng: 151.2093, timezone: 10 }
};

function NoorIslamAppContent() {
  const { t, currentLanguage } = useTranslation();
  const {
    city,
    settings,
    updateSettings,
    activeAudio,
    togglePlayPauseAudio,
    stopAudio,
    seekAudio,
    currentUser,
    isAdmin,
    hadiths,
    duas,
    ayahs,
    bookmarkedAyahs,
    bookmarkedHadiths,
    bookmarkedDuas,
    toggleBookmarkAyah,
    toggleBookmarkHadith,
    toggleBookmarkDua,
    articles,
    setSelectedSurah,
    toast,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Time & Greeting states
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hr = time.getHours();
    if (hr < 4) return t("greeting_night");
    if (hr < 12) return t("greeting_morning");
    if (hr < 15) return t("greeting_afternoon");
    if (hr < 18) return t("greeting_evening");
    return t("greeting_evening");
  };

  // Safe helper to get dynamic calculated times
  const getTimes = (cityName: string) => {
    const coords = CITY_COORDINATES[cityName] || CITY_COORDINATES["Dhaka"];
    const lat = coords.lat;
    const fajrHour = 4 + Math.round(lat / 25);
    const dhuhrHour = 12;
    const asrHour = 15 + Math.round(lat / 30);
    const maghribHour = 18 + Math.round(lat / 20);
    const ishaHour = 19 + Math.round(lat / 15);

    const calculated = {
      fajr: `${String(fajrHour).padStart(2, '0')}:15 AM`,
      sunrise: `${String(fajrHour + 1).padStart(2, '0')}:35 AM`,
      dhuhr: `12:05 PM`,
      asr: `${asrHour - 12}:30 PM`,
      maghrib: `${maghribHour - 12}:45 PM`,
      isha: `${ishaHour - 12}:55 PM`
    };

    return {
      fajr: settings.customPrayerTimes?.fajr || calculated.fajr,
      sunrise: settings.customPrayerTimes?.sunrise || calculated.sunrise,
      dhuhr: settings.customPrayerTimes?.dhuhr || calculated.dhuhr,
      asr: settings.customPrayerTimes?.asr || calculated.asr,
      maghrib: settings.customPrayerTimes?.maghrib || calculated.maghrib,
      isha: settings.customPrayerTimes?.isha || calculated.isha
    };
  };

  const todayTimes = getTimes(city);

  // Helper for rendering tabs and sub-views
  const handleQuickNav = (tab: string, subTool: string | null = null) => {
    setActiveTab(tab);
    setActiveTool(subTool);
  };

  // Helper to copy text to clipboard safely
  const handleCopy = (text: string, message: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    showToast(message, 'success');
  };

  // Main UI render logic based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Header / Islamic Greeting Card */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-850 to-emerald-950 text-white rounded-3xl p-6 shadow-lg shadow-emerald-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-700/10 rounded-full blur-2xl pointer-events-none -translate-y-12 translate-x-12"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase block">{getGreeting()}</span>
                  <h1 className="text-3xl font-serif font-bold text-amber-200 mt-1">{t("app_title")}</h1>
                  <p className="text-emerald-100 text-xs mt-1.5 flex items-center gap-1.5 opacity-90">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {city}, Bangladesh • {currentLanguage === 'Bangla' ? '১৪ শাওয়াল ১৪৪৭ হিজরি' : '14 Shawwal 1447 Hijri'}
                  </p>
                </div>
                <div className="bg-emerald-900/40 border border-emerald-700/60 rounded-2xl px-4 py-3 text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">{t("current_time")}</span>
                  <div className="font-mono text-2xl font-bold text-amber-200 mt-0.5">
                    {time.toLocaleTimeString(currentLanguage === 'Bangla' ? 'bn-BD' : [], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <span className="text-[10px] text-emerald-200 opacity-75">{time.toLocaleDateString(currentLanguage === 'Bangla' ? 'bn-BD' : [], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Quick Prayer Time Slider Widget */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                    <Clock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{t("prayer_times")}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{t("calculated_for").replace("{city}", city)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickNav("prayer-times")}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {t("view_all")} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of basic times */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {[
                  { name: t("fajr"), time: todayTimes.fajr, icon: "🌅" },
                  { name: t("dhuhr"), time: todayTimes.dhuhr, icon: "🌤️" },
                  { name: t("asr"), time: todayTimes.asr, icon: "⛅" },
                  { name: t("maghrib"), time: todayTimes.maghrib, icon: "🌇" },
                  { name: t("isha"), time: todayTimes.isha, icon: "🌙" }
                ].map((p) => (
                  <div
                    key={p.name}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-750/30 p-2.5 rounded-2xl text-center flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{p.name}</span>
                    <span className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Menu (Circular Icons) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">{t("quick_features")}</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: t("quran"), icon: <BookOpen className="w-6 h-6" />, color: "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300", tab: "quran" },
                  { name: t("hadith"), icon: <Book className="w-6 h-6" />, color: "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300", tab: "hadith" },
                  { name: t("dua"), icon: <Heart className="w-6 h-6" />, color: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300", tab: "dua" },
                  { name: t("tasbih"), icon: <Sparkles className="w-6 h-6" />, color: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300", tab: "tools", tool: "tasbih" },
                  { name: t("qibla"), icon: <Compass className="w-6 h-6" />, color: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300", tab: "tools", tool: "qibla" },
                  { name: t("99_names"), icon: <Shield className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-300", tab: "tools", tool: "names" },
                  { name: t("calendar"), icon: <Calendar className="w-6 h-6" />, color: "bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300", tab: "tools", tool: "calendar" },
                  { name: t("articles"), icon: <Newspaper className="w-6 h-6" />, color: "bg-amber-50 text-amber-850 dark:bg-amber-950/40 dark:text-amber-300", tab: "tools", tool: "articles" }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleQuickNav(item.tab, item.tool || null)}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-3 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer text-center group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-750 dark:text-slate-300">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Highlights (Hadith & Dua) */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Hadith of the Day */}
              {hadiths.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{t("hadith_of_the_day")}</span>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono mt-2">{hadiths[0].book} - {currentLanguage === 'Bangla' ? 'হাদিস ' : 'Hadith '}{hadiths[0].hadithNumber}</p>
                    <p className="font-serif text-right text-emerald-850 dark:text-emerald-400 text-lg leading-loose py-2 tracking-wide mt-1">
                      {hadiths[0].arabic}
                    </p>
                    <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium italic">
                      "{currentLanguage === 'Bangla' ? hadiths[0].bangla : hadiths[0].english}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-700/60 pt-3 mt-3">
                    <span className="text-[10px] font-bold text-slate-400">{t("narrated_by")} {hadiths[0].narrator}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleBookmarkHadith(hadiths[0].id)}
                        className={`p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 ${
                          bookmarkedHadiths.includes(hadiths[0].id) ? "text-amber-500" : "text-slate-400"
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => handleCopy(`${hadiths[0].arabic}\n\n${currentLanguage === 'Bangla' ? hadiths[0].bangla : hadiths[0].english}\n(${hadiths[0].book})`)}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dua of the Day */}
              {duas.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{t("dua_of_the_day")}</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-2">{duas[0].title}</p>
                    <p className="font-serif text-right text-emerald-850 dark:text-emerald-400 text-lg leading-loose py-2 tracking-wide mt-1">
                      {duas[0].arabic}
                    </p>
                    {duas[0].transliteration && (
                      <p className="text-[11px] text-slate-450 dark:text-slate-400 italic font-medium leading-relaxed">
                        {duas[0].transliteration}
                      </p>
                    )}
                    <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium mt-1">
                      {currentLanguage === 'Bangla' ? duas[0].bangla : duas[0].english}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-700/60 pt-3 mt-3">
                    <span className="text-[10px] text-slate-400 font-mono">{duas[0].reference || "Quran/Hadith"}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleBookmarkDua(duas[0].id)}
                        className={`p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 ${
                          bookmarkedDuas.includes(duas[0].id) ? "text-amber-500" : "text-slate-400"
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => handleCopy(`${duas[0].arabic}\n\n${currentLanguage === 'Bangla' ? duas[0].bangla : duas[0].english}`)}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Quote Banner */}
            <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-900/20 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
              <span className="text-3xl">✨</span>
              <div className="space-y-1">
                <p className="text-xs text-amber-850 dark:text-amber-300 font-serif leading-relaxed font-semibold">
                  {currentLanguage === 'Bangla'
                    ? '"তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যার চরিত্র সবচেয়ে সুন্দর ও উত্তম।"'
                    : '"The best among you are those who have the best manners and character."'}
                </p>
                <span className="text-[10px] font-bold text-amber-600 block uppercase font-mono">
                  {currentLanguage === 'Bangla' ? '— সহীহ আল-বুখারী' : '— Sahih al-Bukhari'}
                </span>
              </div>
            </div>

            {/* Latest Islamic Articles Preview */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {currentLanguage === 'Bangla' ? 'সর্বশেষ নিবন্ধসমূহ' : 'Latest Articles'}
                </h3>
                <button
                  onClick={() => handleQuickNav("tools", "articles")}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {currentLanguage === 'Bangla' ? 'সবগুলো দেখুন' : 'View All'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {articles.slice(0, 2).map((art) => {
                  const getArticleLoc = (item: any) => {
                    if (currentLanguage === 'Bangla') {
                      if (item.id === "art_1") {
                        return { title: "ইসলামের পঞ্চস্তম্ভের পরিচিতি", category: "মৌলিক জ্ঞান", author: "ইসলামিক নলেজ টিম" };
                      }
                      if (item.id === "art_2") {
                        return { title: "দৈনন্দিন জীবনে সুন্নাহর গুরুত্ব", category: "সুন্নাহ ও হাদিস", author: "ডা. আব্দুর রহমান" };
                      }
                    }
                    return { title: item.title, category: item.category, author: item.author };
                  };
                  const loc = getArticleLoc(art);
                  return (
                    <div
                      key={art.id}
                      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleQuickNav("tools", "articles")}
                    >
                      <div className="w-16 h-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400">
                        <Newspaper className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <span className="text-[9px] font-extrabold uppercase text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md inline-block">
                          {loc.category}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate">{loc.title}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                          {currentLanguage === 'Bangla' ? 'লেখক: ' : 'By '}{loc.author}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "quran":
        return <QuranSection />;

      case "hadith":
        return <HadithSection />;

      case "dua":
        return <DuaSection />;

      case "prayer-times":
        return <PrayerTimesSection />;

      case "tools":
        // Sub-routes for various utilities
        if (activeTool === "tasbih") {
          return (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
              >
                {currentLanguage === 'Bangla' ? '← টুলস তালিকায় ফিরুন' : '← Back to Tools list'}
              </button>
              <TasbihSection />
            </div>
          );
        }
        if (activeTool === "qibla") {
          return (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
              >
                {currentLanguage === 'Bangla' ? '← টুলস তালিকায় ফিরুন' : '← Back to Tools list'}
              </button>
              <QiblaSection />
            </div>
          );
        }
        if (activeTool === "names") {
          return (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
              >
                {currentLanguage === 'Bangla' ? '← টুলস তালিকায় ফিরুন' : '← Back to Tools list'}
              </button>
              <NamesSection />
            </div>
          );
        }
        if (activeTool === "calendar") {
          return (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
              >
                {currentLanguage === 'Bangla' ? '← টুলস তালিকায় ফিরুন' : '← Back to Tools list'}
              </button>
              <CalendarSection />
            </div>
          );
        }
        if (activeTool === "articles") {
          return (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
              >
                {currentLanguage === 'Bangla' ? '← টুলস তালিকায় ফিরুন' : '← Back to Tools list'}
              </button>
              <ArticlesSection />
            </div>
          );
        }

        // Standard tools grid list view
        return (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60 mb-2 text-center">
              <h2 className="text-xl font-serif font-bold text-emerald-800 dark:text-emerald-300">
                {currentLanguage === 'Bangla' ? 'ইসলামিক টুলস হাব' : 'Islamic Tools Hub'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {currentLanguage === 'Bangla' ? 'প্রতিদিনের আমল ও অধ্যয়নের জন্য সহায়ক টুলস' : 'Explore auxiliary utilities designed for daily practice & study'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "tasbih", title: currentLanguage === 'Bangla' ? "তাসবীহ কাউন্টার" : "Tasbih Counter", desc: currentLanguage === 'Bangla' ? "ডিজিটাল তাসবীহ ক্লিক করার সুবিধা এবং পূর্বের ইতিহাসের ট্র্যাক।" : "Interactive digital dhikr clicker with historic logs and preset phrases.", icon: <Sparkles className="w-6 h-6" />, color: "text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400" },
                { id: "qibla", title: currentLanguage === 'Bangla' ? "কিবলা কম্পাস" : "Qibla Finder", desc: currentLanguage === 'Bangla' ? "কাবা শরীফের সঠিক দিক কোণ পরিমাপ করার ভিজ্যুয়াল কম্পাস।" : "Visual compass overlay to calculate Kaaba direction.", icon: <Compass className="w-6 h-6" />, color: "text-sky-700 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400" },
                { id: "names", title: currentLanguage === 'Bangla' ? "আল্লাহর ৯৯টি নাম" : "99 Names of Allah", desc: currentLanguage === 'Bangla' ? "উচ্চারণ, অর্থ ও ফযীলতসহ আল্লাহর গুণবাচক নামের তালিকা।" : "Interactive list of Allah's attributes, with Bengali and English meanings.", icon: <Shield className="w-6 h-6" />, color: "text-emerald-850 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" },
                { id: "calendar", title: currentLanguage === 'Bangla' ? "হিজরি ক্যালেন্ডার ও দিবস" : "Hijri Calendar & Events", desc: currentLanguage === 'Bangla' ? "ইসলামিক হিজরি ক্যালেন্ডার এবং গুরুত্বপূর্ণ বিশেষ দিনসমূহ।" : "Trace upcoming holy dates and historic milestones.", icon: <Calendar className="w-6 h-6" />, color: "text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400" },
                { id: "articles", title: currentLanguage === 'Bangla' ? "নিবন্ধ ও জ্ঞান" : "Articles & Knowledge", desc: currentLanguage === 'Bangla' ? "ইসলামের সুন্দর উপদেশ, প্রবন্ধ ও শিক্ষণীয় নিবন্ধসমূহ।" : "Enriching Islamic lessons and educational articles.", icon: <Newspaper className="w-6 h-6" />, color: "text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400" }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 text-left flex gap-4 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors text-sm">{tool.title}</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">{tool.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <AuthSection />

            {/* Bookmarks list for both Guests & Logged-in users */}
            <div className="space-y-4">
              <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                <h3 className="text-md font-serif font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Bookmark className="w-5 h-5" /> {currentLanguage === 'Bangla' ? 'আপনার বুকমার্ক করা বিষয়সমূহ' : 'Your Bookmarked Content'}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentUser 
                    ? (currentLanguage === 'Bangla' ? "আপনার বুকমার্কগুলো অ্যাকাউন্টের সাথে সিঙ্ক করা হয়েছে।" : "Your bookmarks are synchronized to your account.")
                    : (currentLanguage === 'Bangla' ? "বুকমার্কগুলো ব্রাউজারে সংরক্ষিত আছে। অ্যাকাউন্ট সিঙ্ক করতে লগইন করুন।" : "Favorites are saved locally. Sign in to synchronize them across devices.")}
                </p>
              </div>

              <div className="space-y-6">
                {/* Bookmarked Ayahs */}
                <div>
                  <h4 className="text-xs font-bold text-slate-450 uppercase mb-2">
                    {currentLanguage === 'Bangla' ? `সংরক্ষিত কুরআনের আয়াত (${bookmarkedAyahs.length})` : `Saved Quranic Verses (${bookmarkedAyahs.length})`}
                  </h4>
                  {bookmarkedAyahs.length > 0 ? (
                    <div className="grid gap-2">
                      {bookmarkedAyahs.map((id) => {
                        const item = ayahs.find(a => a.id === id);
                        if (!item) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => {
                              setSelectedSurah(item.surahNumber);
                              setActiveTab("quran");
                            }}
                            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3.5 rounded-2xl flex justify-between items-center shadow-sm cursor-pointer hover:border-emerald-500/30 transition-colors"
                          >
                            <div className="space-y-0.5 overflow-hidden pr-3">
                              <span className="text-[9px] font-bold text-emerald-600 block">
                                {currentLanguage === 'Bangla' ? `সূরা ${item.surahNumber} • আয়াত ${item.ayahNumber}` : `Surah ${item.surahNumber} • Ayah ${item.ayahNumber}`}
                              </span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 truncate font-serif text-right">{item.textArabic}</p>
                              <p className="text-[10px] text-slate-400 truncate">{currentLanguage === 'Bangla' ? item.textBangla : item.textEnglish}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmarkAyah(id); }}
                              className="text-amber-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-850/40 p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700/40">
                      {currentLanguage === 'Bangla' ? 'কোনো আয়াত বুকমার্ক করা নেই। কোরআন পড়ার সময় বুকমার্ক আইকনে ক্লিক করুন।' : 'No saved verses. Browse Quran and click bookmark icon.'}
                    </p>
                  )}
                </div>

                {/* Bookmarked Hadiths */}
                <div>
                  <h4 className="text-xs font-bold text-slate-450 uppercase mb-2">
                    {currentLanguage === 'Bangla' ? `সংরক্ষিত হাদিস (${bookmarkedHadiths.length})` : `Saved Hadiths (${bookmarkedHadiths.length})`}
                  </h4>
                  {bookmarkedHadiths.length > 0 ? (
                    <div className="grid gap-2">
                      {bookmarkedHadiths.map((id) => {
                        const item = hadiths.find(h => h.id === id);
                        if (!item) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => setActiveTab("hadith")}
                            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3.5 rounded-2xl flex justify-between items-center shadow-sm cursor-pointer hover:border-emerald-500/30 transition-colors"
                          >
                            <div className="space-y-0.5 overflow-hidden pr-3">
                              <span className="text-[9px] font-bold text-indigo-600 block">
                                {item.book} • {currentLanguage === 'Bangla' ? `হাদিস ${item.hadithNumber}` : `Hadith ${item.hadithNumber}`}
                              </span>
                              <p className="text-xs text-slate-750 dark:text-slate-300 truncate font-serif text-right">{item.arabic}</p>
                              <p className="text-[10px] text-slate-400 truncate">{currentLanguage === 'Bangla' ? item.bangla : item.english}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmarkHadith(id); }}
                              className="text-amber-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-850/40 p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700/40">
                      {currentLanguage === 'Bangla' ? 'কোনো হাদিস বুকমার্ক করা নেই। হাদিস ব্রাউজ করার সময় বুকমার্ক আইকনে ক্লিক করুন।' : 'No saved hadiths. Browse Hadiths and click bookmark icon.'}
                    </p>
                  )}
                </div>

                {/* Bookmarked Duas */}
                <div>
                  <h4 className="text-xs font-bold text-slate-450 uppercase mb-2">
                    {currentLanguage === 'Bangla' ? `সংরক্ষিত দোয়া (${bookmarkedDuas.length})` : `Saved Supplications (${bookmarkedDuas.length})`}
                  </h4>
                  {bookmarkedDuas.length > 0 ? (
                    <div className="grid gap-2">
                      {bookmarkedDuas.map((id) => {
                        const item = duas.find(d => d.id === id);
                        if (!item) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => setActiveTab("dua")}
                            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3.5 rounded-2xl flex justify-between items-center shadow-sm cursor-pointer hover:border-emerald-500/30 transition-colors"
                          >
                            <div className="space-y-0.5 overflow-hidden pr-3">
                              <span className="text-[9px] font-bold text-rose-600 block">{item.title}</span>
                              <p className="text-xs text-slate-750 dark:text-slate-300 truncate font-serif text-right">{item.arabic}</p>
                              <p className="text-[10px] text-slate-400 truncate">{currentLanguage === 'Bangla' ? item.bangla : item.english}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmarkDua(id); }}
                              className="text-amber-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-850/40 p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700/40">
                      {currentLanguage === 'Bangla' ? 'কোনো দোয়া বুকমার্ক করা নেই। দোয়া ব্রাউজ করার সময় বুকমার্ক আইকনে ক্লিক করুন।' : 'No saved supplications. Browse Duas and click bookmark icon.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Bypass Link if logged in as admin */}
            {isAdmin && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 p-4 rounded-2xl text-center">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mb-2">✓ Administrator privileges active</p>
                <button
                  onClick={() => setActiveTab("admin")}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl inline-flex items-center gap-1 cursor-pointer shadow"
                >
                  <Shield className="w-4 h-4" /> Open Admin Panel
                </button>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-md border-b border-slate-50 dark:border-slate-700 pb-2">{t("quranic_settings")}</h3>

              {/* Font Size Adjustments */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{t("font_size_label")}</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{settings.fontSize}px</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSettings('fontSize', Math.max(14, settings.fontSize - 2))}
                    className="flex-1 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {t("decrease_font")}
                  </button>
                  <button
                    onClick={() => updateSettings('fontSize', Math.min(32, settings.fontSize + 2))}
                    className="flex-1 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {t("increase_font")}
                  </button>
                </div>
              </div>

              {/* Font selection */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">{t("arabic_font_style")}</label>
                  <select
                    value={settings.arabicFont}
                    onChange={(e) => updateSettings('arabicFont', e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Amiri">Amiri ({currentLanguage === 'Bangla' ? 'ক্লাসিক্যাল নাসখ' : 'Classical Naskh'})</option>
                    <option value="Default">{currentLanguage === 'Bangla' ? 'সিস্টেম ফন্ট' : 'System Sans-Serif'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">{t("bengali_font_style")}</label>
                  <select
                    value={settings.banglaFont}
                    onChange={(e) => updateSettings('banglaFont', e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Hind Siliguri">Hind Siliguri</option>
                    <option value="Default">{currentLanguage === 'Bangla' ? 'সিস্টেম ফন্ট' : 'System Sans-Serif'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* General App Settings */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-md border-b border-slate-50 dark:border-slate-700 pb-2">{t("preferences")}</h3>

              {/* Dark mode switcher */}
              <div className="flex justify-between items-center py-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-750 dark:text-white">{t("dark_theme")}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t("dark_theme_desc")}</p>
                </div>
                <button
                  onClick={() => updateSettings('isDarkMode', !settings.isDarkMode)}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    settings.isDarkMode
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {settings.isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              </div>

              {/* Language toggle */}
              <div className="flex justify-between items-center py-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-750 dark:text-white">{t("translation_lang")}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t("translation_lang_desc")}</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings('language', e.target.value)}
                  className="text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Bangla">Bangla</option>
                </select>
              </div>

              {/* Reminder offset */}
              <div className="flex justify-between items-center py-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-750 dark:text-white">{t("prayer_reminder")}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t("prayer_reminder_desc")}</p>
                </div>
                <select
                  value={settings.reminderMinutes}
                  onChange={(e) => updateSettings('reminderMinutes', parseInt(e.target.value))}
                  className="text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value={5}>5 {currentLanguage === 'Bangla' ? 'মিনিট' : 'mins'}</option>
                  <option value={10}>10 {currentLanguage === 'Bangla' ? 'মিনিট' : 'mins'}</option>
                  <option value={15}>15 {currentLanguage === 'Bangla' ? 'মিনিট' : 'mins'}</option>
                  <option value={30}>30 {currentLanguage === 'Bangla' ? 'মিনিট' : 'mins'}</option>
                </select>
              </div>
            </div>

            {/* About us / Info card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl shadow-sm text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t("app_version")}</h4>
              <p className="text-xs text-slate-450 dark:text-slate-550 leading-relaxed">
                {t("app_desc")}
              </p>
              <p className="text-[10px] text-slate-400 font-medium pt-2">{currentLanguage === 'Bangla' ? '© ২০২৬ সাদিক কুরআন ও দোয়া প্রকল্প। সর্বস্বত্ব সংরক্ষিত।' : '© 2026 Sadik Quran And Dua Project. All rights reserved.'}</p>
            </div>
          </div>
        );

      case "admin":
        if (currentUser && !currentUser.emailVerified) {
          return (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-8 rounded-3xl shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-bold text-slate-850 dark:text-white text-lg">Verification Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Access to the Admin Dashboard is protected. You must verify your email address (<strong>{currentUser.email}</strong>) in the Profile section before you can access administrative features.
              </p>
              <button
                onClick={() => setActiveTab("profile")}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-750 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Go to Profile
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Profile
              </button>
              <h3 className="text-md font-serif font-bold text-emerald-800 dark:text-emerald-300">Admin Dashboard</h3>
            </div>
            <AdminPanel />
          </div>
        );

      default:
        return <div className="p-4 text-center">Section under development</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-350">
      {/* 1. Desktop Sidebar Menu */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-850 border-r border-slate-200/50 dark:border-slate-800 shrink-0 select-none p-5">
        {/* Sidebar Brand Logo */}
        <div className="flex items-center gap-3 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center text-lg font-bold">
            ✦
          </div>
          <div>
            <h2 className="text-md font-serif font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">{t("app_name")}</h2>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">{t("app_subtitle")}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 pt-6">
          {[
            { id: "home", label: t("home_dashboard"), icon: <Home className="w-5 h-5" /> },
            { id: "quran", label: t("noble_quran"), icon: <BookOpen className="w-5 h-5" /> },
            { id: "hadith", label: t("hadith_scholar"), icon: <Book className="w-5 h-5" /> },
            { id: "dua", label: t("supplications"), icon: <Heart className="w-5 h-5" /> },
            { id: "prayer-times", label: t("prayer_times"), icon: <Clock className="w-5 h-5" /> },
            { id: "tools", label: t("islamic_tools"), icon: <Grid className="w-5 h-5" /> },
            { id: "profile", label: t("profile_bookmarks"), icon: <User className="w-5 h-5" /> },
            { id: "settings", label: t("app_settings"), icon: <Settings className="w-5 h-5" /> }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleQuickNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10 font-bold scale-[1.01]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-emerald-700 dark:hover:text-emerald-300"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t("app_name")}</span>
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-medium block mt-0.5">{t("online_synced")}</span>
        </div>
      </aside>

      {/* 2. Mobile Header Bar */}
      <header className="md:hidden sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 h-14 flex items-center justify-between px-4 z-40 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-emerald-800 dark:text-emerald-400">✦</span>
          <span className="text-sm font-serif font-bold text-emerald-800 dark:text-emerald-400 tracking-widest uppercase">{t("app_title")}</span>
        </div>

        {/* Quick Settings Icon Indicator */}
        <button
          onClick={() => updateSettings('isDarkMode', !settings.isDarkMode)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-colors cursor-pointer"
        >
          {settings.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* 3. Main Scrollable Container */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 max-w-4xl mx-auto w-full pb-28">
          {currentUser && !currentUser.emailVerified && activeTab !== "profile" && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-base text-amber-500">⚠️</span>
                <div>
                  <p className="font-bold">{t("email_verification_required")}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t("verification_details")}</p>
                </div>
              </div>
              <button
                onClick={() => handleQuickNav("profile")}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-[10px] whitespace-nowrap cursor-pointer transition-colors shadow-sm"
              >
                {t("verify_now")}
              </button>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeTool || "")}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Persistent Audio Bar */}
      {activeAudio && (
        <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:w-85 bg-slate-950/95 dark:bg-black/95 text-white rounded-2xl p-4 shadow-xl z-40 border border-slate-800 flex flex-col gap-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                {activeAudio.isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3.5 w-4 justify-center pb-[2px]">
                    <span className="w-[2px] h-full bg-slate-950 rounded-full sound-bar animate-sound-1" />
                    <span className="w-[2px] h-full bg-slate-950 rounded-full sound-bar animate-sound-2" />
                    <span className="w-[2px] h-full bg-slate-950 rounded-full sound-bar animate-sound-3" />
                    <span className="w-[2px] h-full bg-slate-950 rounded-full sound-bar animate-sound-4" />
                  </div>
                ) : (
                  <div className="flex items-end gap-[2px] h-3.5 w-4 justify-center pb-[2px]">
                    <span className="w-[2px] h-[3px] bg-slate-950 rounded-full" />
                    <span className="w-[2px] h-[3px] bg-slate-950 rounded-full" />
                    <span className="w-[2px] h-[3px] bg-slate-950 rounded-full" />
                    <span className="w-[2px] h-[3px] bg-slate-950 rounded-full" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Quran Audio</h5>
                <p className="text-xs font-semibold truncate text-slate-100">{activeAudio.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={togglePlayPauseAudio}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-full text-slate-200 transition-all cursor-pointer"
              >
                {activeAudio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={stopAudio}
                className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-950 active:scale-90 rounded-full transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Draggable progress slider */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={activeAudio.duration || 100}
                value={activeAudio.currentTime || 0}
                onChange={(e) => seekAudio(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((activeAudio.currentTime || 0) / (activeAudio.duration || 100)) * 100}%, #1e293b ${((activeAudio.currentTime || 0) / (activeAudio.duration || 100)) * 100}%, #1e293b 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{formatTime(activeAudio.currentTime || 0)}</span>
              <span>{activeAudio.duration ? formatTime(activeAudio.duration) : "00:00"}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Bottom Navigation Menu */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-250/55 dark:border-slate-800/80 h-16 flex items-center justify-around px-2 z-40 select-none pb-safe">
        {[
          { id: "home", label: t("home"), icon: <Home className="w-5 h-5" /> },
          { id: "quran", label: t("quran"), icon: <BookOpen className="w-5 h-5" /> },
          { id: "hadith", label: t("hadith"), icon: <Book className="w-5 h-5" /> },
          { id: "dua", label: t("dua"), icon: <Heart className="w-5 h-5" /> },
          { id: "tools", label: t("tools"), icon: <Grid className="w-5 h-5" /> },
          { id: "profile", label: t("profile"), icon: <User className="w-5 h-5" /> }
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => handleQuickNav(item.id)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-slate-450 dark:text-slate-500 hover:text-slate-650"
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Animated Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md p-4 rounded-2xl shadow-xl border flex items-center gap-3 z-50 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-350'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-350'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } shrink-0 animate-pulse`} />
            <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <NoorIslamAppContent key="app-content" />
        )}
      </AnimatePresence>
    </AppProvider>
  );
}
