import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Search, Play, Pause, Bookmark, Share2, Copy, ArrowLeft, Sliders, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuranSection() {
  const {
    surahs,
    ayahs,
    bookmarkedAyahs,
    toggleBookmarkAyah,
    settings,
    activeAudio,
    playAudio,
    stopAudio,
    togglePlayPauseAudio,
    selectedSurah,
    setSelectedSurah
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [ayahSearchQuery, setAyahSearchQuery] = useState("");
  const [textLanguage, setTextLanguage] = useState<'both' | 'bangla' | 'english'>('both');

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

  const handlePlayAyahAudio = (ayah: any) => {
  const audioUrl = "https://raw.githubusercontent.com/sadik919/Quran-audio/main/001.mp3";
    playAudio(`Surah ${selectedSurah} - Ayah ${ayah.ayahNumber}`, audioUrl);
  };

  const copyAyah = (ayah: any) => {
    const text = `${ayah.textArabic}\n\n[English]: ${ayah.textEnglish}\n[Bangla]: ${ayah.textBangla}\n(Surah ${selectedSurah}:${ayah.ayahNumber})`;
    navigator.clipboard.writeText(text);
    alert("Ayah copied to clipboard!");
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
                placeholder="Search Surah by English or Arabic name..."
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
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-emerald-800 dark:text-emerald-400 block" style={{ fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit' }}>
                      {surah.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                      {surah.revelationType}
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
                Back to List
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
                  Both
                </button>
                <button
                  onClick={() => setTextLanguage('bangla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    textLanguage === 'bangla'
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  Bangla
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
              <div className="relative z-10 space-y-1">
                <h3 className="text-2xl font-serif font-bold text-amber-200">
                  {surahs.find(s => s.number === selectedSurah)?.englishName}
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  {surahs.find(s => s.number === selectedSurah)?.englishNameTranslation} • {surahs.find(s => s.number === selectedSurah)?.numberOfAyahs} Ayahs
                </p>
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
                placeholder="Search ayah by translation or number..."
                value={ayahSearchQuery}
                onChange={(e) => setAyahSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Ayah Cards */}
            <div className="space-y-4">
              {filteredAyahs.map((ayah) => {
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
                          onClick={() => handlePlayAyahAudio(ayah)}
                          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
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
                          <span className="font-semibold text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase mb-0.5">Bangla</span>
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
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
