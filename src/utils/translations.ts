import { useApp } from '../context/AppContext';

export const translations: Record<string, { English: string; Bangla: string }> = {
  // Navigation & Branding
  "app_name": { English: "Sadik Quran", Bangla: "সাদিক কুরআন" },
  "app_title": { English: "Sadik Quran And Dua", Bangla: "সাদিক কুরআন ও দোয়া" },
  "app_subtitle": { English: "Islamic Companion", Bangla: "ইসলামিক জীবনসঙ্গী" },
  "home_dashboard": { English: "Home Dashboard", Bangla: "হোম ড্যাশবোর্ড" },
  "noble_quran": { English: "Noble Quran", Bangla: "আল-কুরআন" },
  "hadith_scholar": { English: "Hadith Scholar", Bangla: "হাদিস গ্রন্থ" },
  "supplications": { English: "Supplications", Bangla: "দোয়া সমূহ" },
  "prayer_times": { English: "Prayer Times", Bangla: "নামাজের সময়সূচী" },
  "islamic_tools": { English: "Islamic Tools", Bangla: "ইসলামিক টুলস" },
  "profile_bookmarks": { English: "Profile & Bookmarks", Bangla: "প্রোফাইল ও বুকমার্ক" },
  "app_settings": { English: "App Settings", Bangla: "অ্যাপ সেটিংস" },
  "home": { English: "Home", Bangla: "হোম" },
  "quran": { English: "Quran", Bangla: "কুরআন" },
  "hadith": { English: "Hadith", Bangla: "হাদিস" },
  "dua": { English: "Dua", Bangla: "দোয়া" },
  "tools": { English: "Tools", Bangla: "টুলস" },
  "profile": { English: "Profile", Bangla: "প্রোফাইল" },
  "online_synced": { English: "Online Synced Secure", Bangla: "অনলাইন সিঙ্কড ও নিরাপদ" },

  // Home Dashboard
  "current_time": { English: "Current Time", Bangla: "বর্তমান সময়" },
  "calculated_for": { English: "Calculated for {city}", Bangla: "{city}-এর জন্য হিসাবকৃত" },
  "view_all": { English: "View All", Bangla: "সব দেখুন" },
  "quick_features": { English: "Quick Features", Bangla: "গুরুত্বপূর্ণ ফিচারসমূহ" },
  "tasbih": { English: "Tasbih", Bangla: "তাসবীহ" },
  "qibla": { English: "Qibla", Bangla: "কিবলা" },
  "99_names": { English: "99 Names", Bangla: "আল্লাহর ৯৯ নাম" },
  "calendar": { English: "Calendar", Bangla: "ক্যালেন্ডার" },
  "articles": { English: "Articles", Bangla: "নিবন্ধ সমূহ" },
  "hadith_of_the_day": { English: "Hadith of the Day", Bangla: "আজকের হাদিস" },
  "dua_of_the_day": { English: "Dua of the Day", Bangla: "আজকের দোয়া" },
  "narrated_by": { English: "Narrated by", Bangla: "বর্ণনাকারী" },
  "reference": { English: "Reference", Bangla: "সূত্র" },

  // Greetings
  "greeting_night": { English: "Selamat Malam / Good Night", Bangla: "শুভ রাত্রি / আসসালামু আলাইকুম" },
  "greeting_morning": { English: "Assalamu Alaikum (Good Morning)", Bangla: "আসসালামু আলাইকুম (শুভ সকাল)" },
  "greeting_afternoon": { English: "Assalamu Alaikum (Good Afternoon)", Bangla: "আসসালামু আলাইকুম (শুভ দুপুর)" },
  "greeting_evening": { English: "Assalamu Alaikum (Good Evening)", Bangla: "আসসালামু আলাইকুম (শুভ সন্ধ্যা)" },

  // Verification Banner
  "email_verification_required": { English: "Email Verification Required", Bangla: "ইমেইল ভেরিফিকেশন প্রয়োজন" },
  "verification_details": { 
    English: "Please verify your email address to unlock cloud database synchronization and the Admin Dashboard.", 
    Bangla: "ক্লাউড ডাটাবেজ সিনক্রোনাইজেশন এবং এডমিন প্যানেল আনলক করতে অনুগ্রহ করে আপনার ইমেইল ভেরিফাই করুন।" 
  },
  "verify_now": { English: "Verify Now", Bangla: "এখনই ভেরিফাই করুন" },

  // Prayer Names
  "fajr": { English: "Fajr", Bangla: "ফজর" },
  "sunrise": { English: "Sunrise", Bangla: "সূর্যোদয়" },
  "dhuhr": { English: "Dhuhr", Bangla: "যোহর" },
  "asr": { English: "Asr", Bangla: "আসর" },
  "maghrib": { English: "Maghrib", Bangla: "মাগরিব" },
  "isha": { English: "Isha", Bangla: "এশা" },

  // Categories / Labels
  "All": { English: "All", Bangla: "সব" },
  "Daily": { English: "Daily", Bangla: "দৈনিক" },
  "Morning & Evening": { English: "Morning & Evening", Bangla: "সকাল ও সন্ধ্যা" },
  "Travel": { English: "Travel", Bangla: "সফর" },
  "Food": { English: "Food", Bangla: "খাবার" },
  "Prayer": { English: "Prayer", Bangla: "সালাত/নামাজ" },
  "Other": { English: "Other", Bangla: "অন্যান্য" },

  // Settings
  "quranic_settings": { English: "Quranic & Display Settings", Bangla: "কুরআন ও প্রদর্শন সেটিংস" },
  "font_size_label": { English: "Quranic Arabic Font Size", Bangla: "কুরআনের আরবি ফন্টের সাইজ" },
  "decrease_font": { English: "Decrease A-", Bangla: "কমানো A-" },
  "increase_font": { English: "Increase A+", Bangla: "বাড়ানো A+" },
  "arabic_font_style": { English: "Arabic Font Style", Bangla: "আরবি ফন্ট স্টাইল" },
  "bengali_font_style": { English: "Bengali Font Style", Bangla: "বাংলা ফন্ট স্টাইল" },
  "preferences": { English: "Preferences", Bangla: "পছন্দসমূহ" },
  "dark_theme": { English: "Dark Theme Override", Bangla: "ডার্ক থিম" },
  "dark_theme_desc": { English: "Toggle nighttime display theme manually", Bangla: "ম্যানুয়ালি ডার্ক থিম চালু বা বন্ধ করুন" },
  "translation_lang": { English: "Translation Language", Bangla: "অনুবাদ ভাষা" },
  "translation_lang_desc": { English: "Set preferred translation language", Bangla: "আপনার পছন্দের অনুবাদের ভাষা নির্বাচন করুন" },
  "prayer_reminder": { English: "Prayer Reminder Offset", Bangla: "নামাজের রিমাইন্ডার" },
  "prayer_reminder_desc": { English: "Minutes before prayer times to remind", Bangla: "নামাজের কত মিনিট আগে রিমাইন্ডার দেওয়া হবে" },
  "app_version": { English: "Sadik Quran And Dua v1.2.0", Bangla: "সাদিক কুরআন ও দোয়া সংস্করণ ১.২.০" },
  "app_desc": { 
    English: "A completely responsive full-stack companion for Muslims, featuring high-quality content translations, dark mode, prayer tracking, tasbih counters, and secure offline storage synchronized globally.", 
    Bangla: "মুসলিমদের জন্য একটি সম্পূর্ণ রেসপনসিভ ফুল-স্ট্যাক লাইফস্টাইল অ্যাপ। এতে রয়েছে উচ্চমানের অনুবাদ, ডার্ক মোড, নামাজের সময়সূচী, ডিজিটাল তাসবীহ এবং বিশ্বব্যাপী সুরক্ষিত ক্লাউড সিঙ্ক।" 
  },
  "developer_credit": { English: "Developed with excellence for creators and communities.", Bangla: "উন্নত প্রযুক্তি ও নান্দনিক ডিজাইনে তৈরি।" },

  // Quran Section
  "search_surah": { English: "Search Surah...", Bangla: "সূরা খুঁজুন..." },
  "all_surahs": { English: "All Surahs", Bangla: "সকল সূরা" },
  "meccan": { English: "Meccan", Bangla: "মাক্কী" },
  "medinan": { English: "Medinan", Bangla: "মাদানী" },
  "ayahs_count": { English: "{count} Ayahs", Bangla: "{count} আয়াত" },
  "surah_details": { English: "Surah Details", Bangla: "সূরার বিস্তারিত" },
  "read_surah": { English: "Read Surah", Bangla: "সূরা পড়ুন" },
  "play_full_surah": { English: "Play Full Surah", Bangla: "সম্পূর্ণ সূরা শুনুন" },
  "pause_audio": { English: "Pause Audio", Bangla: "অডিও থামান" },
  "search_ayah": { English: "Search Ayah or meaning...", Bangla: "আয়াতের অর্থ বা শব্দ খুঁজুন..." },
  "verses": { English: "Verses", Bangla: "আয়াত সমূহ" },

  // Hadith Section
  "search_hadith": { English: "Search Hadith...", Bangla: "হাদিস খুঁজুন..." },
  "category_all": { English: "All", Bangla: "সব" },
  "no_hadiths": { English: "No hadiths found matching your criteria.", Bangla: "আপনার ফিল্টারের সাথে কোনো হাদিস মেলেনি।" },

  // Dua Section
  "search_dua": { English: "Search Dua...", Bangla: "দোয়া খুঁজুন..." },
  "no_duas": { English: "No duas found matching your criteria.", Bangla: "আপনার ফিল্টারের সাথে কোনো দোয়া মেলেনি।" },

  // Islamic Tools
  "tasbih_counter": { English: "Tasbih Counter", Bangla: "ডিজিটাল তাসবীহ" },
  "target_count": { English: "Target Count", Bangla: "গণনার লক্ষ্য" },
  "tap_anywhere": { English: "Tap anywhere to count", Bangla: "গণনা করতে যেকোনো স্থানে চাপুন" },
  "history": { English: "History", Bangla: "ইতিহাস" },
  "reset": { English: "Reset", Bangla: "রিসেট" },
  "clear_history": { English: "Clear History", Bangla: "ইতিহাস মুছুন" },
  "recent_counts": { English: "Recent counts will appear here.", Bangla: "আপনার সাম্প্রতিক গণনা এখানে দেখা যাবে।" },
  "select_dhikr": { English: "Select Dhikr", Bangla: "যিকির নির্বাচন করুন" },

  // Qibla
  "qibla_finder": { English: "Qibla Finder", Bangla: "কিবলা কম্পাস" },
  "qibla_desc": { English: "Compass calibration or camera orientation might be required.", Bangla: "কম্পাস ক্যালিব্রেশন বা ক্যামেরার ওরিয়েন্টেশন প্রয়োজন হতে পারে।" },
  "qibla_angle": { English: "Qibla Angle", Bangla: "কিবলার কোণ" },

  // Names of Allah
  "names_title": { English: "99 Beautiful Names of Allah", Bangla: "আল্লাহ তাআলার ৯৯টি সুন্দর নাম" },
  "search_names": { English: "Search Name...", Bangla: "নাম খুঁজুন..." },

  // Calendar
  "calendar_title": { English: "Islamic & Gregorian Calendar", Bangla: "হিজরী ও গ্রেগরিয়ান ক্যালেন্ডার" },
  "upcoming_events": { English: "Upcoming Islamic Events", Bangla: "আসন্ন ইসলামিক দিনসমূহ" },

  // Articles
  "articles_title": { English: "Islamic Articles", Bangla: "ইসলামিক নিবন্ধ সমূহ" },
  "search_articles": { English: "Search articles...", Bangla: "নিবন্ধ খুঁজুন..." },

  // Profile
  "profile_customization": { English: "Profile & Customization", Bangla: "প্রোফাইল ও কাস্টমাইজেশন" },
  "my_bookmarked_ayahs": { English: "My Bookmarked Ayahs", Bangla: "আমার বুকমার্ক করা আয়াতসমূহ" },
  "my_bookmarked_hadiths": { English: "My Bookmarked Hadiths", Bangla: "আমার বুকমার্ক করা হাদিসসমূহ" },
  "my_bookmarked_duas": { English: "My Bookmarked Duas", Bangla: "আমার বুকমার্ক করা দোয়া সমূহ" },
  "no_bookmarks_yet": { English: "No bookmarks yet. Save items to view them here.", Bangla: "কোনো বুকমার্ক নেই। সংরক্ষণ করা আইটেম এখানে দেখা যাবে।" },
  "admin_panel": { English: "Admin Panel", Bangla: "এডমিন প্যানেল" },
  "developer_dashboard": { English: "Developer Dashboard", Bangla: "ডেভেলপার ড্যাশবোর্ড" },
  "sign_in_up": { English: "Sign In / Sign Up", Bangla: "লগইন / সাইনআপ" },
  "log_out": { English: "Log Out", Bangla: "লগআউট" }
};

export function useTranslation() {
  const { settings } = useApp();
  const currentLanguage: 'English' | 'Bangla' = settings?.language || 'English';

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) {
      return key;
    }
    return item[currentLanguage] || item['English'];
  };

  return { t, currentLanguage };
}
