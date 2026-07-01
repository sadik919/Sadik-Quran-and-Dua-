import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { Search, Bookmark, Copy, Share2, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function HadithSection() {
  const { hadiths, bookmarkedHadiths, toggleBookmarkHadith, settings } = useApp();
  const { t, currentLanguage } = useTranslation();
  const [selectedBook, setSelectedBook] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const books = ["All", "Sahih al-Bukhari", "Sahih Muslim"];

  const filteredHadiths = hadiths.filter(h => {
    const matchesBook = selectedBook === "All" || h.book === selectedBook;
    const matchesSearch =
      h.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.bangla.includes(searchQuery) ||
      h.arabic.includes(searchQuery) ||
      h.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hadithNumber.includes(searchQuery);
    return matchesBook && matchesSearch;
  });

  const copyHadith = (hadith: any) => {
    const text = `Hadith (${hadith.book})\nNarrator: ${hadith.narrator}\n\n${hadith.arabic}\n\n[English]: ${hadith.english}\n[Bangla]: ${hadith.bangla}\nNumber: ${hadith.hadithNumber}`;
    navigator.clipboard.writeText(text);
    alert(currentLanguage === 'Bangla' ? "হাদিস ক্লিপবোর্ডে কপি করা হয়েছে!" : "Hadith copied to clipboard!");
  };

  const shareHadith = (hadith: any) => {
    const text = `Hadith ${hadith.hadithNumber} - ${hadith.narrator}\n${hadith.arabic}`;
    if (navigator.share) {
      navigator.share({
        title: `${hadith.book} - ${hadith.hadithNumber}`,
        text: text,
        url: window.location.href
      });
    } else {
      copyHadith(hadith);
    }
  };

  return (
    <div id="hadith-section" className="space-y-4">
      {/* Book Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {books.map((book) => (
          <button
            key={book}
            onClick={() => setSelectedBook(book)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedBook === book
                ? "bg-emerald-800 text-white shadow-md"
                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
          >
            {book === "All" ? t("All") : book}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="hadith-search"
          type="text"
          placeholder={t("search_hadith")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Hadith Cards */}
      <div className="space-y-4">
        {filteredHadiths.length > 0 ? (
          filteredHadiths.map((hadith) => {
            const isBookmarked = bookmarkedHadiths.includes(hadith.id);
            return (
              <motion.div
                key={hadith.id}
                id={`hadith-card-${hadith.id}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -1 }}
              >
                {/* Book & Metadata */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {hadith.book}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
                      {currentLanguage === 'Bangla' ? 'হাদিস নং: ' : 'Hadith No: '} {hadith.hadithNumber} • {currentLanguage === 'Bangla' ? 'অধ্যায়: ' : 'Chapter: '} {hadith.chapter}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBookmarkHadith(hadith.id)}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => copyHadith(hadith)}
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 rounded-full transition-colors cursor-pointer"
                    >
                      <Copy className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => shareHadith(hadith)}
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 rounded-full transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Narrator */}
                <div className="text-xs text-emerald-850 dark:text-emerald-300 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl">
                  {t("narrated_by")} {hadith.narrator}
                </div>

                {/* Arabic */}
                <p
                  className="text-right text-slate-900 dark:text-slate-100 leading-loose py-2 tracking-wide font-serif"
                  style={{
                    fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit',
                    fontSize: `${settings.fontSize + 2}px`
                  }}
                >
                  {hadith.arabic}
                </p>

                {/* Translations */}
                <div className="space-y-3 pt-2 border-t border-slate-50 dark:border-slate-700/45">
                  <p className="text-xs leading-relaxed text-slate-755 dark:text-slate-300 font-medium" style={{ fontFamily: settings.banglaFont === 'Hind Siliguri' ? 'Hind Siliguri, sans-serif' : 'inherit' }}>
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mr-2 uppercase">{currentLanguage === 'Bangla' ? 'বাংলা:' : 'Bangla:'}</span>
                    {hadith.bangla}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350">
                    <span className="text-[9px] font-bold text-slate-500 mr-2 uppercase">English:</span>
                    {hadith.english}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t("no_hadiths")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
