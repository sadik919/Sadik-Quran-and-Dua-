import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { BookOpen, Search, Play, Pause, Bookmark, Share2, Copy, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuranSection() {
  const {
    surahs,
    ayahs,
    setAyahs,
    bookmarkedAyahs,
    toggleBookmarkAyah,
    settings,
    activeAudio,
    playAudio,
    togglePlayPauseAudio,
    selectedSurah,
    setSelectedSurah,
    showToast
  } = useApp();

  const { t, currentLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [ayahSearchQuery, setAyahSearchQuery] = useState("");
  const [textLanguage, setTextLanguage] = useState<'both' | 'bangla' | 'english'>('both');
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Filter surahs
  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.includes(searchQuery) ||
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter ayahs of the selected surah
  const selectedSurahAyahs = ayahs.filter(a => a.surahNumber === selectedSurah);
  const filteredAyahs = selectedSurahAyahs.filter(a =>
    a.textEnglish.toLowerCase().includes(ayahSearchQuery.toLowerCase()) ||
    a.textBangla.includes(ayahSearchQuery) ||
    a.ayahNumber.toString() === ayahSearchQuery
  );

  const currentSurah = surahs.find(s => s.number === selectedSurah);
  const surahAudioUrl = selectedSurah
    ? `https://server8.mp3quran.net/afs/${String(selectedSurah).padStart(3, '0')}.mp3`
    : "";
  const isCurrentSurahPlaying = !!(activeAudio && activeAudio.url === surahAudioUrl && activeAudio.isPlaying);
  const isCurrentSurahActive = !!(activeAudio && activeAudio.url === surahAudioUrl);

  const handlePlaySurahAudio = () => {
    if (!currentSurah) return;
    if (isCurrentSurahActive) {
      togglePlayPauseAudio();
    } else {
      playAudio(`Surah ${currentSurah.englishName}`, surahAudioUrl);
    }
  };

  const copyAyah = (ayah: any) => {
    const text = `${ayah.textArabic}\n\n[English]: ${ayah.textEnglish}\n[Bangla]: ${ayah.textBangla}\n(Surah ${selectedSurah}:${ayah.ayahNumber})`;
    navigator.clipboard.writeText(text);
    showToast(
      currentLanguage === 'Bangla' ? "আয়াত ক্লিপবোর্ডে কপি করা হয়েছে!" : "Ayah copied to clipboard!",
      "success"
    );
  };

  const shareAyah = (ayah: any) => {
    const text = `${ayah.textArabic}\n(Surah ${selectedSurah}:${ayah.ayahNumber})`;
    if (navigator.share) {
      navigator.share({
        title: `Quran Ayah ${selectedSurah}:${ayah.ayahNumber}`,
        text: text,
        url: window.location.href
      });
    } else {
      copyAyah(ayah);
    }
  };

  // Fetch ayahs when selectedSurah is not loaded
  useEffect(() => {
    if (!selectedSurah) return;

    const current = surahs.find(s => s.number === selectedSurah);
    if (!current) return;

    const existingAyahs = ayahs.filter(a => a.surahNumber === selectedSurah);
    if (existingAyahs.length === current.numberOfAyahs) {
      setIsLoadingAyahs(false);
      setLoadingError(null);
      return;
    }

    let isMounted = true;
    setIsLoadingAyahs(true);
    setLoadingError(null);

    const fetchAyahs = async () => {
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,bn.bengali,en.sahih`);
        if (!response.ok) throw new Error("Failed to fetch Quran data.");
        const json = await response.json();
        
        if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 3) {
          const arabicEd = json.data.find((e: any) => e.identifier === 'quran-uthmani') || json.data[0];
          const banglaEd = json.data.find((e: any) => e.identifier === 'bn.bengali') || json.data[1];
          const englishEd = json.data.find((e: any) => e.identifier === 'en.sahih') || json.data[2];

          if (arabicEd && arabicEd.ayahs) {
            const mapped = arabicEd.ayahs.map((ayah: any, idx: number) => {
              const textBangla = (banglaEd && banglaEd.ayahs[idx]) ? banglaEd.ayahs[idx].text : "";
              const textEnglish = (englishEd && englishEd.ayahs[idx]) ? englishEd.ayahs[idx].text : "";
              
              return {
                id: `${selectedSurah}_${ayah.numberInSurah}`,
                surahNumber: selectedSurah,
                ayahNumber: ayah.numberInSurah,
                textArabic: ayah.text,
                textEnglish: textEnglish,
                textBangla: textBangla
              };
            });

            if (isMounted) {
              setAyahs(prev => {
                const filtered = prev.filter(a => a.surahNumber !== selectedSurah);
                return [...filtered, ...mapped];
              });
              setIsLoadingAyahs(false);
            }
          } else {
            throw new Error("Invalid response format from server.");
          }
        } else {
          throw new Error("Could not retrieve all translations.");
        }
      } catch (err: any) {
        console.error("Error loading Quran text:", err);
        if (isMounted) {
          setLoadingError(
            currentLanguage === 'Bangla'
              ? "কুরআন ডাটা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।"
              : "Failed to load Quranic data. Please check your internet connection."
          );
          setIsLoadingAyahs(false);
        }
      }
    };

    fetchAyahs();

    return () => {
      isMounted = false;
    };
  }, [selectedSurah, surahs, ayahs, setAyahs, currentLanguage]);

  return (
    <div id="quran-section" className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedSurah ? (
          /* Surah List View */
          <motion.div
            key="surah-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="surah-search"
                type="text"
                placeholder={t("search_surah")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Grid of Surahs */}
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredSurahs.map((surah) => (
                <motion.button
                  key={surah.number}
                  id={`surah-card-${surah.number}`}
                  onClick={() => setSelectedSurah(surah.number)}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl text-left flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm font-mono border border-emerald-100 dark:border-emerald-900">
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {surah.englishName}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} {currentLanguage === 'Bangla' ? 'টি আয়াত' : 'Ayahs'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-emerald-800 dark:text-emerald-400 block" style={{ fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit' }}>
                      {surah.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                      {surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Surah Reader View */
          <motion.div
            key="surah-reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Navigation Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl shadow-sm">
              <button
                onClick={() => { setSelectedSurah(null); setAyahSearchQuery(""); }}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                {currentLanguage === 'Bangla' ? 'তালিকায় ফিরুন' : 'Back to List'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setTextLanguage('both')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    textLanguage === 'both'
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {currentLanguage === 'Bangla' ? 'উভয়' : 'Both'}
                </button>
                <button
                  onClick={() => setTextLanguage('bangla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    textLanguage === 'bangla'
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {currentLanguage === 'Bangla' ? 'বাংলা' : 'Bangla'}
                </button>
                <button
                  onClick={() => setTextLanguage('english')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    textLanguage === 'english'
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Surah Details Banner */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 text-center relative overflow-hidden shadow-lg shadow-emerald-900/10">
              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl font-serif font-bold text-amber-200">
                  {surahs.find(s => s.number === selectedSurah)?.englishName}
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  {surahs.find(s => s.number === selectedSurah)?.englishNameTranslation} • {surahs.find(s => s.number === selectedSurah)?.numberOfAyahs} {currentLanguage === 'Bangla' ? 'টি আয়াত' : 'Ayahs'}
                </p>

                {/* Main Play Surah Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handlePlaySurahAudio}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md cursor-pointer border-none"
                  >
                    {isCurrentSurahPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        {currentLanguage === 'Bangla' ? 'সূরা থামান' : 'Pause Surah'}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        {currentLanguage === 'Bangla' ? 'সম্পূর্ণ সূরা শুনুন' : 'Play Full Surah'}
                      </>
                    )}
                  </button>
                </div>

                {selectedSurah !== 1 && (
                  <div className="pt-4 text-xl font-serif text-amber-100" style={{ fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
              </div>
            </div>

            {/* Search within Surah */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="ayah-search"
                type="text"
                placeholder={currentLanguage === 'Bangla' ? 'আয়াত নম্বর বা অনুবাদ দিয়ে খুঁজুন...' : 'Search ayah by translation or number...'}
                value={ayahSearchQuery}
                onChange={(e) => setAyahSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Ayah Cards */}
            {isLoadingAyahs ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl space-y-4 shadow-sm">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">
                    {currentLanguage === 'Bangla' ? 'সুরাটির আয়াতসমূহ লোড করা হচ্ছে...' : 'Loading surah verses...'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {currentLanguage === 'Bangla' ? 'অনুবাদ ও আয়াতসমূহ ডাউনলোড হতে সামান্য সময় লাগতে পারে।' : 'Downloading translations & verses may take a moment.'}
                  </p>
                </div>
              </div>
            ) : loadingError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50/40 dark:bg-red-950/10 border border-red-100/60 dark:border-red-950/30 rounded-3xl space-y-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{loadingError}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {currentLanguage === 'Bangla' ? 'অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।' : 'Please check your connection and try again.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const currentSurahNum = selectedSurah;
                    setSelectedSurah(null);
                    setTimeout(() => setSelectedSurah(currentSurahNum), 50);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm border-none"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {currentLanguage === 'Bangla' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAyahs.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 text-xs">
                    {currentLanguage === 'Bangla' ? 'কোন আয়াত খুঁজে পাওয়া যায়নি।' : 'No verses found.'}
                  </div>
                ) : (
                  filteredAyahs.map((ayah) => {
                    const isBookmarked = bookmarkedAyahs.includes(ayah.id);
                    return (
                      <motion.div
                        key={ayah.id}
                        id={`ayah-card-${ayah.id}`}
                        className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {/* Header: Ayah Number & Actions */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                          <span className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 flex items-center justify-center font-mono">
                            {ayah.ayahNumber}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleBookmarkAyah(ayah.id)}
                              className={`p-2 rounded-full transition-colors cursor-pointer ${
                                isBookmarked
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500"
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => copyAyah(ayah)}
                              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full transition-colors cursor-pointer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => shareAyah(ayah)}
                              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full transition-colors cursor-pointer"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Arabic Text */}
                        <p
                          className="text-right text-slate-850 dark:text-slate-100 leading-loose py-2 tracking-wide font-medium"
                          style={{
                            fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit',
                            fontSize: `${settings.fontSize + 4}px`
                          }}
                        >
                          {ayah.textArabic}
                        </p>

                        {/* Translations */}
                        <div className="space-y-2 pt-2 text-slate-650 dark:text-slate-300">
                          {(textLanguage === 'both' || textLanguage === 'bangla') && (
                            <p className="text-sm border-l-2 border-emerald-500/30 pl-3 leading-relaxed" style={{ fontSize: `${settings.fontSize - 2}px`, fontFamily: settings.banglaFont === 'Hind Siliguri' ? 'Hind Siliguri, sans-serif' : 'inherit' }}>
                              <span className="font-semibold text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase mb-0.5">{currentLanguage === 'Bangla' ? 'বাংলা' : 'Bangla'}</span>
                              {ayah.textBangla}
                            </p>
                          )}

                          {(textLanguage === 'both' || textLanguage === 'english') && (
                            <p className="text-sm border-l-2 border-slate-300 dark:border-slate-600 pl-3 leading-relaxed" style={{ fontSize: `${settings.fontSize - 2}px` }}>
                              <span className="font-semibold text-[10px] text-slate-500 block uppercase mb-0.5">English</span>
                              {ayah.textEnglish}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
