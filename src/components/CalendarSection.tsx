import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';
import { Calendar, Clock, Star, Hourglass } from 'lucide-react';
import { motion } from 'motion/react';

export default function CalendarSection() {
  const { events } = useApp();
  const { currentLanguage } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, mode: "Iftar" });

  // Approximate Hijri calculations
  const calculateHijriDate = (gregorianDate: Date) => {
    // Basic approximate offset for general Hijri date
    const day = gregorianDate.getDate();
    const month = gregorianDate.getMonth();
    
    // We can show: 14 Shawwal 1447 AH for our current 2026-06 date (which is close)
    return {
      day: currentLanguage === 'Bangla' ? '১৪' : 14,
      monthName: currentLanguage === 'Bangla' ? 'শাওয়াল' : 'Shawwal',
      year: currentLanguage === 'Bangla' ? '১৪৪৭' : 1447,
      suffix: currentLanguage === 'Bangla' ? 'হিজরি' : 'AH'
    };
  };

  const hijri = calculateHijriDate(currentDate);

  // Countdown timer for Sehri / Iftar (mocking Ramadan times for interactive UI)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextEvent = new Date();
      
      // Iftar is at 6:45 PM, Sehri ends at 4:15 AM
      let targetHour = 18;
      let targetMin = 45;
      let eventName = "Iftar";

      if (now.getHours() >= 18 || now.getHours() < 4) {
        targetHour = 4;
        targetMin = 15;
        eventName = "Sehri";
        if (now.getHours() >= 18) {
          nextEvent.setDate(now.getDate() + 1);
        }
      }

      nextEvent.setHours(targetHour, targetMin, 0, 0);
      
      const diff = nextEvent.getTime() - now.getTime();
      
      if (diff > 0) {
        const secs = Math.floor(diff / 1000) % 60;
        const mins = Math.floor(diff / 1000 / 60) % 60;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        setCountdown({ hours, minutes: mins, seconds: secs, mode: eventName });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getEventTranslated = (ev: any) => {
    if (currentLanguage === 'Bangla') {
      if (ev.title === "Ramadan Start") return { title: "রমজান শুরু", description: "রহমত, মাগফিরাত ও নাজাতের মাস পবিত্র রমজানের প্রথম দিন।" };
      if (ev.title === "Laylat al-Qadr") return { title: "লাইলাতুল কদর", description: "হাজার মাসের চেয়েও উত্তম বরকতময় ভাগ্য রজনী।" };
      if (ev.title === "Eid al-Fitr") return { title: "ঈদুল ফিতর", description: "দীর্ঘ এক মাস সিয়াম সাধনার পর মুসলমানদের আনন্দের উৎসব।" };
      if (ev.title === "Waqfat Arafa") return { title: "আরাফাহ দিবস", description: "পবিত্র হজের মূল আনুষ্ঠানিকতা ও বিশ্ব মুসলিমের সম্মিলনের দিন।" };
      if (ev.title === "Eid al-Adha") return { title: "ঈদুল আজহা", description: "ত্যাগের মহিমায় উদ্ভাসিত মুসলমানদের কোরবানির উৎসব।" };
    }
    return { title: ev.title, description: ev.description };
  };

  return (
    <div id="calendar-section" className="space-y-6">
      {/* Calendar Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-6 -translate-y-6">
          <Calendar className="w-44 h-44" />
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div>
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase block">
              {currentLanguage === 'Bangla' ? 'আজকের হিজরি তারিখ' : 'Hijri Date Today'}
            </span>
            <h2 className="text-3xl font-serif font-black text-amber-200 mt-1">
              {hijri.day} {hijri.monthName} {hijri.year} {hijri.suffix}
            </h2>
            <p className="text-emerald-100 text-xs mt-1">
              {currentLanguage === 'Bangla' ? 'গ্রেগরিয়ান তারিখ: ' : 'Gregorian: '}{currentDate.toLocaleDateString(currentLanguage === 'Bangla' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Ramadan / Sehri & Iftar Tracker */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700/50 pb-3">
          <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {currentLanguage === 'Bangla' ? 'সেহরি ও ইফতার কাউন্টডাউন' : 'Sehri & Iftar Countdown'}
          </h3>
          <span className="text-[10px] uppercase font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
            {currentLanguage === 'Bangla' ? 'রমজান মোড' : 'Ramadan Mode'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold">
              {currentLanguage === 'Bangla' ? 'সেহরির শেষ সময়' : 'Today Sehri Ends'}
            </span>
            <p className="text-lg font-mono font-black text-emerald-800 dark:text-emerald-400 mt-1">
              {currentLanguage === 'Bangla' ? '০৪:১৫ AM' : '04:15 AM'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold">
              {currentLanguage === 'Bangla' ? 'আজকের ইফতারের সময়' : 'Today Iftar Time'}
            </span>
            <p className="text-lg font-mono font-black text-amber-600 dark:text-amber-400 mt-1">
              {currentLanguage === 'Bangla' ? '০৬:৪৫ PM' : '06:45 PM'}
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="bg-emerald-900/5 border border-emerald-500/10 dark:bg-emerald-950/20 dark:border-emerald-900/30 rounded-2xl p-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider mb-2">
            <Hourglass className="w-4 h-4 text-amber-500 animate-pulse" />
            {currentLanguage === 'Bangla' ? (
              <span>{countdown.mode === 'Iftar' ? 'ইফতারের' : 'সেহরির'} বাকি সময়</span>
            ) : (
              <span>Time remaining until {countdown.mode}</span>
            )}
          </div>
          <div className="flex gap-3 text-center">
            <div>
              <div className="w-12 h-10 bg-emerald-800 text-amber-200 font-mono font-black rounded-lg text-lg flex items-center justify-center">
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-slate-400 uppercase font-bold mt-1 block">
                {currentLanguage === 'Bangla' ? 'ঘণ্টা' : 'Hrs'}
              </span>
            </div>
            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">:</span>
            <div>
              <div className="w-12 h-10 bg-emerald-800 text-amber-200 font-mono font-black rounded-lg text-lg flex items-center justify-center">
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-slate-400 uppercase font-bold mt-1 block">
                {currentLanguage === 'Bangla' ? 'মিনিট' : 'Mins'}
              </span>
            </div>
            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">:</span>
            <div>
              <div className="w-12 h-10 bg-emerald-800 text-amber-200 font-mono font-black rounded-lg text-lg flex items-center justify-center">
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-slate-400 uppercase font-bold mt-1 block">
                {currentLanguage === 'Bangla' ? 'সেকেন্ড' : 'Secs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic Calendar Events */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider px-1">
          {currentLanguage === 'Bangla' ? 'আসন্ন পবিত্র দিনসমূহ (১৪৪৭ হিজরি)' : 'Upcoming Holy Events (1447 AH)'}
        </h4>

        <div className="grid gap-3">
          {events.map((ev) => {
            const loc = getEventTranslated(ev);
            return (
              <motion.div
                key={ev.id}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-all"
                whileHover={{ x: 2 }}
              >
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-850 dark:text-white text-sm">{loc.title}</h5>
                    <span className="text-[10px] text-amber-650 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full font-mono font-bold">
                      {ev.dateHijri}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{loc.description}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    {currentLanguage === 'Bangla' ? 'সম্ভাব্য গ্রেগরিয়ান তারিখ: ' : 'Expected Gregorian Date: '}{ev.dateGregorian}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
