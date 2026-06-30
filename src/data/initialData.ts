import { QuranSurah, QuranAyah, Hadith, DuaItem, AllahName, Article, IslamicEvent } from '../types';

export const initialSurahs: QuranSurah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Meccan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" }
];

export const initialAyahs: QuranAyah[] = [
  // Surah Al-Fatihah (1)
  { id: "1_1", surahNumber: 1, ayahNumber: 1, textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", textEnglish: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", textBangla: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।" },
  { id: "1_2", surahNumber: 1, ayahNumber: 2, textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", textEnglish: "All praise is [due] to Allah, Lord of the worlds -", textBangla: "সব প্রশংসা বিশ্বজগতের পালনকর্তা আল্লাহর জন্য।" },
  { id: "1_3", surahNumber: 1, ayahNumber: 3, textArabic: "الرَّحْمَٰنِ الرَّحِيمِ", textEnglish: "The Entirely Merciful, the Especially Merciful,", textBangla: "যিনি পরম করুণাময় ও অতি দয়ালু।" },
  { id: "1_4", surahNumber: 1, ayahNumber: 4, textArabic: "مَالِكِ يَوْمِ الدِّينِ", textEnglish: "Sovereign of the Day of Recompense.", textBangla: "যিনি বিচার দিনের মালিক।" },
  { id: "1_5", surahNumber: 1, ayahNumber: 5, textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", textEnglish: "It is You we worship and You we ask for help.", textBangla: "আমরা একমাত্র আপনারই ইবাদত করি এবং শুধুমাত্র আপনারই সাহায্য চাই।" },
  { id: "1_6", surahNumber: 1, ayahNumber: 6, textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", textEnglish: "Guide us to the straight path -", textBangla: "আমাদের সরল পথ দেখান।" },
  { id: "1_7", surahNumber: 1, ayahNumber: 7, textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", textEnglish: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", textBangla: "তাদের পথ, যাদের আপনি নেয়ামত দিয়েছেন। তাদের পথ নয়, যারা ক্রোধের শিকার হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।" },

  // Surah Al-Ikhlas (112)
  { id: "112_1", surahNumber: 112, ayahNumber: 1, textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", textEnglish: "Say, \"He is Allah, [who is] One,", textBangla: "বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।" },
  { id: "112_2", surahNumber: 112, ayahNumber: 2, textArabic: "اللَّهُ الصَّمَدُ", textEnglish: "Allah, the Eternal Refuge.", textBangla: "আল্লাহ কারো মুখাপেক্ষী নন, সবাই তাঁর মুখাপেক্ষী।" },
  { id: "112_3", surahNumber: 112, ayahNumber: 3, textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", textEnglish: "He neither begets nor is born,", textBangla: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেয়া হয়নি।" },
  { id: "112_4", surahNumber: 112, ayahNumber: 4, textArabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", textEnglish: "Nor is there to Him any equivalent.\"", textBangla: "এবং তাঁর সমকক্ষ কেউ নেই।" },

  // Surah Al-Mulk (67) extract
  { id: "67_1", surahNumber: 67, ayahNumber: 1, textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", textEnglish: "Blessed is He in whose hand is dominion, and He is over all things competent -", textBangla: "পরম কল্যাণময় তিনি, যাঁর হাতে রাজত্ব। তিনি সব কিছুর ওপর সর্বশক্তিমান।" },
  { id: "67_2", surahNumber: 67, ayahNumber: 2, textArabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", textEnglish: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -", textBangla: "যিনি সৃষ্টি করেছেন মরণ ও জীবন, যাতে তোমাদের পরীক্ষা করেন যে, তোমাদের মধ্যে আমলের দিক থেকে কে উত্তম? তিনি পরাক্রমশালী, ক্ষমাশীল।" }
];

export const initialHadiths: Hadith[] = [
  {
    id: "hadith_1",
    book: "Sahih al-Bukhari",
    chapter: "Revelation",
    hadithNumber: "1",
    narrator: "Umar bin Al-Khattab",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
    bangla: "সমস্ত কাজের ফলাফল নিয়তের ওপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।",
    category: "Intentions (Niyyah)"
  },
  {
    id: "hadith_2",
    book: "Sahih al-Bukhari",
    chapter: "Belief (Iman)",
    hadithNumber: "9",
    narrator: "Abu Hurayrah",
    arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ",
    english: "Faith has over seventy branches, and modesty is a branch of faith.",
    bangla: "ঈমানের সত্তরটিরও বেশি শাখা রয়েছে, আর লজ্জা হচ্ছে ঈমানের একটি বিশেষ শাখা।",
    category: "Faith (Iman)"
  },
  {
    id: "hadith_3",
    book: "Sahih Muslim",
    chapter: "Purification (Taharah)",
    hadithNumber: "223",
    narrator: "Abu Malik al-Ash'ari",
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    english: "Purity is half of faith.",
    bangla: "পবিত্রতা ঈমানের অর্ধেক।",
    category: "Purity"
  }
];

export const initialDuas: DuaItem[] = [
  {
    id: "dua_1",
    title: "Before Sleeping",
    category: "Morning & Evening",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa-ahya",
    english: "In Your name, O Allah, I die and I live.",
    bangla: "হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করি (ঘুমাই) এবং জীবিত হই (জেগে উঠি)।",
    reference: "Sahih al-Bukhari 6324"
  },
  {
    id: "dua_2",
    title: "Upon Waking Up",
    category: "Morning & Evening",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhee ahyana ba'da ma amatana wa-ilayhin-nushoor",
    english: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    bangla: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (ঘুমের) পর পুনরায় জীবিত করলেন এবং তাঁরই দিকে ফিরে যেতে হবে।",
    reference: "Sahih al-Bukhari 6314"
  },
  {
    id: "dua_3",
    title: "Before Eating",
    category: "Food",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    english: "In the name of Allah.",
    bangla: "আল্লাহর নামে শুরু করছি।",
    reference: "Abu Dawud 3767"
  },
  {
    id: "dua_4",
    title: "Dua for Traveling",
    category: "Travel",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
    transliteration: "Subhanal-ladhee sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon",
    english: "Glory is to Him Who has subjected this to us, and we were not able to do it ourselves. And surely, to our Lord we are returning.",
    bangla: "পবিত্র ও মহান তিনি, যিনি একে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা একে বশীভূত করতে সমর্থ ছিলাম না। আর অবশ্যই আমরা আমাদের প্রতিপালকের দিকে প্রত্যাবর্তন করব।",
    reference: "Surah Az-Zukhruf 13-14"
  }
];

export const initialAllahNames: AllahName[] = [
  { number: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", banglaMeaning: "পরম দয়ালু", englishMeaning: "The Most Gracious" },
  { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", banglaMeaning: "অতিশয় মেহেরবান", englishMeaning: "The Most Merciful" },
  { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", banglaMeaning: "সর্বাধিকারী / রাজাধিরাজ", englishMeaning: "The Sovereign Lord" },
  { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", banglaMeaning: "অতি পবিত্র", englishMeaning: "The Holy" },
  { number: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", banglaMeaning: "শান্তি ও নিরাপত্তা দাতা", englishMeaning: "The Source of Peace" },
  { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", banglaMeaning: "ঈমান ও নিরাপত্তা দানকারী", englishMeaning: "The Guardian of Faith" },
  { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", banglaMeaning: "রক্ষণাবেক্ষণকারী", englishMeaning: "The Protector" },
  { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", banglaMeaning: "মহা পরাক্রমশালী", englishMeaning: "The Mighty" },
  { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", banglaMeaning: "মহাপ্রতাপশালী", englishMeaning: "The Compeller" }
];

export const initialArticles: Article[] = [
  {
    id: "art_1",
    title: "Understanding the Pillars of Islam",
    category: "Basics of Islam",
    content: "Islam is built upon five pillars: Shahadah (Faith), Salah (Prayer), Zakah (Almsgiving), Sawm (Fasting), and Hajj (Pilgrimage). These form the framework of a Muslim's life, guiding their worship, charity, self-discipline, and devotion to Allah.",
    author: "Islamic Knowledge Team",
    date: "2026-06-25",
    imageUrl: ""
  },
  {
    id: "art_2",
    title: "The Importance of Sunnah in Daily Life",
    category: "Sunnah & Hadith",
    content: "Following the Sunnah of Prophet Muhammad (PBUH) is essential for every Muslim. It provides a practical guide on how to implement the teachings of the Holy Quran, fostering character development, spiritual growth, and a deeper connection with the Creator.",
    author: "Dr. Abdur Rahman",
    date: "2026-06-20",
    imageUrl: ""
  }
];

export const initialEvents: IslamicEvent[] = [
  { id: "ev_1", title: "Ramadan Begins", dateHijri: "01 Ramadan 1447", dateGregorian: "2026-02-18", description: "The holy month of fasting, prayer, and reflection." },
  { id: "ev_2", title: "Eid al-Fitr", dateHijri: "01 Shawwal 1447", dateGregorian: "2026-03-20", description: "Festival of breaking the fast, celebrating the end of Ramadan." },
  { id: "ev_3", title: "Day of Arafah", dateHijri: "09 Dhul-Hijjah 1447", dateGregorian: "2026-05-26", description: "The holiest day of the year, a key part of the Hajj pilgrimage." },
  { id: "ev_4", title: "Eid al-Adha", dateHijri: "10 Dhul-Hijjah 1447", dateGregorian: "2026-05-27", description: "Festival of Sacrifice, honoring Prophet Ibrahim's obedience." }
];

export const defaultSettings = {
  language: "English" as 'English' | 'Bangla',
  arabicFont: "Amiri" as 'Amiri' | 'Default',
  banglaFont: "Hind Siliguri" as 'Hind Siliguri' | 'Default',
  fontSize: 18,
  accessibilityMode: false,
  reminderMinutes: 15,
  isDarkMode: false
};
