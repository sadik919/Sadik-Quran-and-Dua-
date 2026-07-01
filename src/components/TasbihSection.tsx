import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { RefreshCw, Volume2, Save, Trash2, History } from 'lucide-react';
import { motion } from 'motion/react';

export default function TasbihSection() {
  const {
    tasbihCount,
    setTasbihCount,
    activeTasbihName,
    setActiveTasbihName,
    tasbihHistory,
    saveTasbihCounter,
    resetTasbihCounter,
    clearTasbihHistory
  } = useApp();

  const { t, currentLanguage } = useTranslation();
  const [target, setTarget] = useState<number>(33);
  const [dhikrArabic, setDhikrArabic] = useState<string>("سُبْحَانَ ٱللَّٰهِ");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const dhikrPresets = [
    { name: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ", translation: "Glory be to Allah", translationBn: "আল্লাহ তাআলা পবিত্র" },
    { name: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", translation: "Praise be to Allah", translationBn: "সকল প্রশংসা আল্লাহর জন্য" },
    { name: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", translation: "Allah is the Greatest", translationBn: "আল্লাহ সর্বশ্রেষ্ঠ" },
    { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", translation: "I seek forgiveness from Allah", translationBn: "আমি আল্লাহর ক্ষমা প্রার্থনা করছি" },
    { name: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translation: "There is no deity but Allah", translationBn: "আল্লাহ ছাড়া কোনো উপাস্য নেই" }
  ];

  const handleDhikrChange = (name: string) => {
    setActiveTasbihName(name);
    const preset = dhikrPresets.find(p => p.name === name);
    if (preset) {
      setDhikrArabic(preset.arabic);
    }
  };

  const incrementCounter = () => {
    // Sound beep simulation using browser AudioContext
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Slightly higher beep when completing a loop/target
        if ((tasbihCount + 1) % target === 0) {
          oscillator.frequency.value = 600;
          gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        } else {
          oscillator.frequency.value = 400;
          gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        }
        
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
      } catch (err) {
        // Safe fail if AudioContext is blocked by browser autoplay rules
      }
    }

    // Try standard vibration API if supported
    if (navigator.vibrate) {
      if ((tasbihCount + 1) % target === 0) {
        navigator.vibrate([100, 50, 100]); // double tap on target completion
      } else {
        navigator.vibrate(35); // standard short tap
      }
    }

    setTasbihCount(prev => prev + 1);
  };

  const progressPercentage = Math.min((tasbihCount / target) * 100, 100);

  return (
    <div id="tasbih-section" className="space-y-6">
      {/* Selector & Target Presets */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 flex justify-between items-center shadow-sm gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">{t("select_dhikr")}</label>
          <select
            id="dhikr-selector"
            value={activeTasbihName}
            onChange={(e) => handleDhikrChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl px-3 py-2 text-sm w-full font-medium text-slate-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {dhikrPresets.map((p) => (
              <option key={p.name} value={p.name}>
                {currentLanguage === 'Bangla' ? p.translationBn : p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">{t("target_count")}</label>
          <div className="flex gap-1.5">
            {[33, 99, 100].map((num) => (
              <button
                key={num}
                onClick={() => setTarget(num)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  target === num
                    ? "bg-amber-400 text-emerald-950 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-150 dark:border-slate-750"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Counter Stage */}
      <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700/40 p-6 relative shadow-sm">
        <span className="text-3xl font-serif text-emerald-700 dark:text-emerald-400 font-bold mb-1">
          {dhikrArabic}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-450 uppercase tracking-widest font-semibold mb-6">
          {currentLanguage === 'Bangla'
            ? dhikrPresets.find(p => p.name === activeTasbihName)?.translationBn
            : dhikrPresets.find(p => p.name === activeTasbihName)?.translation}
        </span>

        {/* Outer Circular Touch Area */}
        <motion.button
          id="tasbih-main-button"
          onClick={incrementCounter}
          className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-650 hover:to-emerald-600 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-900/10 active:scale-95 transition-transform border-4 border-amber-400/20 group cursor-pointer"
          whileTap={{ scale: 0.94 }}
        >
          {/* Circular progress bar */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-950/20"></div>
          
          <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 mb-1">
            {currentLanguage === 'Bangla' ? 'মোট গণনা' : 'Total count'}
          </div>
          <span className="text-6xl font-mono font-black text-amber-200 drop-shadow-sm group-active:text-white transition-colors">
            {tasbihCount}
          </span>
          <div className="text-[10px] bg-emerald-900/60 text-emerald-100 px-3 py-1 rounded-full mt-2 font-semibold">
            {currentLanguage === 'Bangla' ? 'লক্ষ্য: ' : 'Target: '}{target}
          </div>

          {/* Dynamic light ring */}
          <div className="absolute -inset-1 rounded-full border-2 border-dashed border-amber-400/30 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.button>

        {/* Progress bar line */}
        <div className="w-full max-w-xs mt-8">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5">
            <span>{currentLanguage === 'Bangla' ? 'ধাপের অগ্রগতি' : 'Loop Progress'}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="flex gap-4 mt-8 w-full max-w-xs justify-center">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-full transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer ${
              soundEnabled
                ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={resetTasbihCounter}
            className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-full hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title={currentLanguage === 'Bangla' ? 'রিসেট' : 'Reset'}
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={saveTasbihCounter}
            className="p-3 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-750 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title={currentLanguage === 'Bangla' ? 'ইতিহাসে সংরক্ষণ করুন' : 'Save To History'}
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History panel */}
      <div id="tasbih-history-log" className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {currentLanguage === 'Bangla' ? 'তাসবীহ সেশনের ইতিহাস' : 'Tasbih Sessions History'}
          </h4>
          {tasbihHistory.length > 0 && (
            <button
              onClick={clearTasbihHistory}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> {currentLanguage === 'Bangla' ? 'সব মুছুন' : 'Clear All'}
            </button>
          )}
        </div>

        {tasbihHistory.length > 0 ? (
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {tasbihHistory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentLanguage === 'Bangla' ? (dhikrPresets.find(p => p.name === item.name)?.translationBn || item.name) : item.name}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.date}</p>
                </div>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                  {item.count} {currentLanguage === 'Bangla' ? 'বার' : 'counts'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400 py-6">{t("recent_counts")}</p>
        )}
      </div>
    </div>
  );
}
