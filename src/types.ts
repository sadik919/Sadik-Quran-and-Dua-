export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string; // YYYY-MM-DD
  hijriDate?: string;
}

export interface Hadith {
  id: string;
  book: string;
  chapter: string;
  hadithNumber: string;
  narrator: string;
  arabic: string;
  english: string;
  bangla: string;
  category: string;
  isBookmarked?: boolean;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface QuranAyah {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  textArabic: string;
  textEnglish: string;
  textBangla: string;
  audioUrl?: string;
  isBookmarked?: boolean;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'Daily' | 'Morning & Evening' | 'Travel' | 'Food' | 'Prayer' | 'Other';
  arabic: string;
  transliteration?: string;
  english: string;
  bangla: string;
  reference?: string;
}

export interface TasbihHistory {
  id: string;
  name: string;
  count: number;
  date: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  dateHijri: string;
  dateGregorian: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown or plain text
  author: string;
  date: string;
  imageUrl?: string;
}

export interface AllahName {
  number: number;
  arabic: string;
  transliteration: string;
  banglaMeaning: string;
  englishMeaning: string;
  audioUrl?: string;
}
