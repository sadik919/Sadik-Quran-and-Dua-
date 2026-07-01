import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { Volume2, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function NamesSection() {
  const { allahNames, settings } = useApp();
  const { t, currentLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  const filteredNames = allahNames.filter(n =>
    n.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.banglaMeaning.includes(searchQuery) ||
    n.arabic.includes(searchQuery) ||
    n.number.toString() === searchQuery
  );

  const speakName = (nameObj: any) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const text = `${nameObj.transliteration}. Meaning: ${nameObj.englishMeaning}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      
      utterance.onstart = () => setSpeakingId(nameObj.number);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Speech synthesis fallback
      setSpeakingId(nameObj.number);
      setTimeout(() => setSpeakingId(null), 1500);
    }
  };

  return (
    <div id="names-section" className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden text-center">
        <div className="relative z-10 space-y-1">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase block">
            {currentLanguage === 'Bangla' ? 'আল্লাহ তাআলার ৯৯টি সুন্দর নাম' : '99 Beautiful Names of Allah'}
          </span>
          <h3 className="text-2xl font-serif font-bold text-amber-200">Asmaul Husna</h3>
          <p className="text-emerald-100 text-xs px-4">
            {currentLanguage === 'Bangla'
              ? 'তিনিই আল্লাহ, যিনি ছাড়া কোনো উপাস্য নেই, দৃশ্য ও অদৃশ্যের পরিজ্ঞাত। তিনি পরম দয়ালু, অতি দয়ালু।'
              : 'He is Allah, other than whom there is no deity, the Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="names-search"
          type="text"
          placeholder={currentLanguage === 'Bangla' ? 'আরবি, উচ্চারণ বা অর্থ দিয়ে আল্লাহর নাম খুঁজুন...' : 'Search Names by Arabic, transliteration or meaning...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Grid of Names */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {filteredNames.length > 0 ? (
          filteredNames.map((name) => (
            <motion.div
              key={name.number}
              id={`name-card-${name.number}`}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-4.5 rounded-2xl flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ y: -1 }}
              onClick={() => speakName(name)}
            >
              {/* Badge Number */}
              <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                #{String(name.number).padStart(2, '0')}
              </span>

              {/* Speaker Indicator */}
              <button
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                  speakingId === name.number
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
                    : "text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750 group-hover:text-slate-450"
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${speakingId === name.number ? 'animate-bounce' : ''}`} />
              </button>

              {/* Calligraphy Callout */}
              <span className="text-3xl font-serif font-black text-emerald-850 dark:text-emerald-400 mt-4 block" style={{ fontFamily: settings.arabicFont === 'Amiri' ? 'Amiri, serif' : 'inherit' }}>
                {name.arabic}
              </span>

              <span className="text-sm font-bold text-slate-850 dark:text-white mt-2 block">
                {name.transliteration}
              </span>

              {/* Divider */}
              <div className="w-8 h-0.5 bg-amber-400/30 my-2"></div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-medium text-slate-450 dark:text-slate-550 block">
                  {name.englishMeaning}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-500 block leading-tight" style={{ fontFamily: settings.banglaFont === 'Hind Siliguri' ? 'Hind Siliguri, sans-serif' : 'inherit' }}>
                  {name.banglaMeaning}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {currentLanguage === 'Bangla' ? 'কোনো নাম খুঁজে পাওয়া যায়নি।' : 'No Names match your query.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
