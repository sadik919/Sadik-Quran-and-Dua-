import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { Search, Bookmark, Copy, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function DuaSection() {
  const { duas, bookmarkedDuas, toggleBookmarkDua, settings } = useApp();
  const { t, currentLanguage } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Daily", "Morning & Evening", "Travel", "Food", "Prayer", "Other"];

  const filteredDuas = duas.filter(d => {
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.arabic.includes(searchQuery) ||
      d.bangla.includes(searchQuery) ||
      d.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyDua = (dua: any) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n[English]: ${dua.english}\n[Bangla]: ${dua.bangla}\nRef: ${dua.reference || "N/A"}`;
    navigator.clipboard.writeText(text);
    alert(currentLanguage === 'Bangla' ? "দোয়া ক্লিপবোর্ডে কপি করা হয়েছে!" : "Dua copied to clipboard!");
  };

  const shareDua = (dua: any) => {
    const text = `${dua.title}\n\n${dua.arabic}`;
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: text,
        url: window.location.href
      });
    } else {
      copyDua(dua);
    }
  };

  return (
    <div id="dua-section" className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/15"
                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="dua-search"
          type="text"
          placeholder={t("search_dua")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const isBookmarked = bookmarkedDuas.includes(dua.id);
            return (
              <motion.div
                key={dua.id}
                id={`dua-card-${dua.id}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -1 }}
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-base">
                      {dua.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {t(dua.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBookmarkDua(dua.id)}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => copyDua(dua)}
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 rounded-full transition-colors cursor-pointer"
                    >
                      <Copy className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => shareDua(dua)}
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 rounded-full transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic */}
                <p
                  className="text-right text-slate-900 dark:text-slate-100 leading-loose py-2 tracking-wide font-serif"
                  style={{
                    fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit',
                    fontSize: `${settings.fontSize + 3}px`
                  }}
                >
                  {dua.arabic}
                </p>

                {/* Transliteration */}
                {dua.transliteration && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-450 leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    {dua.transliteration}
                  </p>
                )}

                {/* Translations */}
                <div className="space-y-2 pt-1 border-t border-slate-50 dark:border-slate-700/40">
                  <p className="text-xs leading-relaxed text-slate-705 dark:text-slate-300 font-medium" style={{ fontFamily: settings.banglaFont === 'Hind Siliguri' ? 'Hind Siliguri, sans-serif' : 'inherit' }}>
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mr-2 uppercase">{currentLanguage === 'Bangla' ? 'বাংলা:' : 'Bangla:'}</span>
                    {dua.bangla}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-300">
                    <span className="text-[9px] font-bold text-slate-500 mr-2 uppercase">English:</span>
                    {dua.english}
                  </p>
                </div>

                {/* Reference */}
                {dua.reference && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right italic font-mono pt-1">
                    — {dua.reference}
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("no_duas")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
