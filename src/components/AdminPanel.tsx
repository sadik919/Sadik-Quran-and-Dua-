import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings, Database, FileOutput, FileInput, Plus, Trash2, Edit, AlertCircle,
  BarChart2, Users, Bell, Globe, Sparkles, FolderUp, CheckCircle, Save, ArrowLeft, Search, Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export default function AdminPanel() {
  const {
    surahs, ayahs, hadiths, duas, articles, events,
    setSurahs, setAyahs, setHadiths, setDuas, setArticles, setEvents,
    settings, updateSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'quran' | 'hadith' | 'dua' | 'articles' | 'events' | 'categories' | 'database'>('dashboard');
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Create/Edit/Delete Form state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Quran Form
  const [quranForm, setQuranForm] = useState({ surahNumber: 1, ayahNumber: 1, textArabic: "", textEnglish: "", textBangla: "" });
  // Hadith Form
  const [hadithForm, setHadithForm] = useState({ book: "Sahih al-Bukhari", chapter: "", hadithNumber: "", narrator: "", arabic: "", english: "", bangla: "", category: "" });
  // Dua Form
  const [duaForm, setDuaForm] = useState({ title: "", category: "Daily" as any, arabic: "", transliteration: "", english: "", bangla: "", reference: "" });
  // Article Form
  const [articleForm, setArticleForm] = useState({ title: "", category: "", content: "", author: "Islamic Knowledge Team" });
  // Event Form
  const [eventForm, setEventForm] = useState({ title: "", dateHijri: "", dateGregorian: "", description: "" });
  // Category Form
  const [categoryForm, setCategoryForm] = useState({ name: "" });

  // Categories list
  const [categoriesList, setCategoriesList] = useState<{ id: string, name: string }[]>(() => [
    { id: "quran", name: "Quranic Sciences" },
    { id: "hadith", name: "Hadith Studies" },
    { id: "fiqh", name: "Fiqh & Jurisprudence" },
    { id: "history", name: "Islamic History" }
  ]);

  useEffect(() => {
    setAdminSearchQuery("");
  }, [activeTab]);

  useEffect(() => {
    const fetchCats = async () => {
      if (db) {
        try {
          const snap = await getDocs(collection(db, 'categories'));
          if (!snap.empty) {
            setCategoriesList(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
          }
        } catch (err) {
          console.error("Error loading categories:", err);
        }
      }
    };
    fetchCats();
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Add or Edit Category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingId || `cat_${Date.now()}`;
      const payload = { id, name: categoryForm.name };
      if (db) {
        await setDoc(doc(db, 'categories', id), payload);
      }
      if (editingId) {
        setCategoriesList(prev => prev.map(c => c.id === editingId ? payload : c));
        triggerToast("Category updated successfully!");
      } else {
        setCategoriesList(prev => [...prev, payload]);
        triggerToast("Category added successfully!");
      }
      setCategoryForm({ name: "" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'categories', id));
      setCategoriesList(prev => prev.filter(c => c.id !== id));
      triggerToast("Category deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Add or Edit Quran content
  const handleQuranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...quranForm, id: editingId || `ayah_${Date.now()}` };
      if (db) {
        await setDoc(doc(db, 'ayahs', payload.id), payload);
      }
      if (editingId) {
        setAyahs(prev => prev.map(a => a.id === editingId ? { ...a, ...quranForm } : a));
        triggerToast("Ayah updated successfully!");
      } else {
        setAyahs(prev => [...prev, payload]);
        triggerToast("Ayah added successfully!");
      }
      setQuranForm({ surahNumber: 1, ayahNumber: 1, textArabic: "", textEnglish: "", textBangla: "" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Delete Ayah
  const handleDeleteAyah = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'ayahs', id));
      setAyahs(prev => prev.filter(a => a.id !== id));
      triggerToast("Ayah deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Add or Edit Hadith
  const handleHadithSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...hadithForm, id: editingId || `hadith_${Date.now()}` };
      if (db) {
        await setDoc(doc(db, 'hadiths', payload.id), payload);
      }
      if (editingId) {
        setHadiths(prev => prev.map(h => h.id === editingId ? { ...h, ...hadithForm } : h));
        triggerToast("Hadith updated successfully!");
      } else {
        setHadiths(prev => [...prev, payload]);
        triggerToast("Hadith added successfully!");
      }
      setHadithForm({ book: "Sahih al-Bukhari", chapter: "", hadithNumber: "", narrator: "", arabic: "", english: "", bangla: "", category: "" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteHadith = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'hadiths', id));
      setHadiths(prev => prev.filter(h => h.id !== id));
      triggerToast("Hadith deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Add or Edit Dua
  const handleDuaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...duaForm, id: editingId || `dua_${Date.now()}` };
      if (db) {
        await setDoc(doc(db, 'duas', payload.id), payload);
      }
      if (editingId) {
        setDuas(prev => prev.map(d => d.id === editingId ? { ...d, ...duaForm } : d));
        triggerToast("Dua updated successfully!");
      } else {
        setDuas(prev => [...prev, payload]);
        triggerToast("Dua added successfully!");
      }
      setDuaForm({ title: "", category: "Daily", arabic: "", transliteration: "", english: "", bangla: "", reference: "" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteDua = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'duas', id));
      setDuas(prev => prev.filter(d => d.id !== id));
      triggerToast("Dua deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Add or Edit Article
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...articleForm, id: editingId || `art_${Date.now()}`, date: new Date().toISOString().split('T')[0] };
      if (db) {
        await setDoc(doc(db, 'articles', payload.id), payload);
      }
      if (editingId) {
        setArticles(prev => prev.map(a => a.id === editingId ? { ...a, ...articleForm } : a));
        triggerToast("Article updated successfully!");
      } else {
        setArticles(prev => [...prev, payload]);
        triggerToast("Article added successfully!");
      }
      setArticleForm({ title: "", category: "", content: "", author: "Islamic Knowledge Team" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'articles', id));
      setArticles(prev => prev.filter(a => a.id !== id));
      triggerToast("Article deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Add or Edit Event
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...eventForm, id: editingId || `ev_${Date.now()}` };
      if (db) {
        await setDoc(doc(db, 'events', payload.id), payload);
      }
      if (editingId) {
        setEvents(prev => prev.map(ev => ev.id === editingId ? { ...ev, ...eventForm } : ev));
        triggerToast("Event updated successfully!");
      } else {
        setEvents(prev => [...prev, payload]);
        triggerToast("Event added successfully!");
      }
      setEventForm({ title: "", dateHijri: "", dateGregorian: "", description: "" });
      setEditingId(null);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      if (db) await deleteDoc(doc(db, 'events', id));
      setEvents(prev => prev.filter(ev => ev.id !== id));
      triggerToast("Event deleted successfully!");
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  // Database Export
  const handleExportData = () => {
    const dataStr = JSON.stringify({ surahs, ayahs, hadiths, duas, articles, events }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `noor_islam_backup_${Date.now()}.json`;
    link.click();
    triggerToast("JSON backup generated!");
  };

  // Database Import JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.ayahs) setAyahs(parsed.ayahs);
          if (parsed.hadiths) setHadiths(parsed.hadiths);
          if (parsed.duas) setDuas(parsed.duas);
          if (parsed.articles) setArticles(parsed.articles);
          if (parsed.events) setEvents(parsed.events);

          // Write back to Firestore if online
          if (db) {
            for (const d of parsed.duas || []) {
              await setDoc(doc(db, 'duas', d.id), d);
            }
            for (const a of parsed.ayahs || []) {
              await setDoc(doc(db, 'ayahs', a.id), a);
            }
            for (const h of parsed.hadiths || []) {
              await setDoc(doc(db, 'hadiths', h.id), h);
            }
          }
          triggerToast("All database records imported successfully!");
        } catch (err) {
          triggerToast("Failed to parse JSON file.", true);
        }
      };
    }
  };

  return (
    <div id="admin-panel" className="space-y-6">
      {/* Toast Alert Feedback */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-xl z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-xl z-50 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Title Bar */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Control Panel</span>
          <h3 className="text-2xl font-serif font-black text-amber-100 flex items-center gap-1.5">
            <Settings className="w-6 h-6 text-amber-400" />
            Sadik Quran And Dua Admin
          </h3>
        </div>
      </div>

      {/* Admin Quick Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: BarChart2 },
          { key: 'quran', label: 'Quran Content', icon: Plus },
          { key: 'hadith', label: 'Hadith', icon: Plus },
          { key: 'dua', label: 'Dua Items', icon: Plus },
          { key: 'articles', label: 'Articles', icon: Plus },
          { key: 'events', label: 'Islamic Events', icon: Plus },
          { key: 'categories', label: 'Categories', icon: Folder },
          { key: 'database', label: 'Database Backup', icon: Database }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setEditingId(null); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-650 dark:text-slate-350"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content switcher based on Tab */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-700/50 pb-3">
              Application Metrics
            </h4>

            {/* Grid of stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Ayahs", count: ayahs.length, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
                { label: "Total Hadiths", count: hadiths.length, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
                { label: "Dua Repository", count: duas.length, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
                { label: "Live Articles", count: articles.length, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" }
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl border border-slate-50 dark:border-slate-750 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold block">{stat.label}</span>
                    <span className="text-2xl font-mono font-black text-slate-800 dark:text-white mt-1 block">{stat.count}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.color} shrink-0`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick settings control panel */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                Global Platform Customizations
              </h5>
              <div className="grid gap-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span>Accessibility Screen-Reader Option</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibilityMode}
                    onChange={(e) => updateSettings('accessibilityMode', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Athan Notification Timing Threshold</span>
                  <select
                    value={settings.reminderMinutes}
                    onChange={(e) => updateSettings('reminderMinutes', parseInt(e.target.value))}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value={5}>5 mins before</option>
                    <option value={10}>10 mins before</option>
                    <option value={15}>15 mins before</option>
                    <option value={30}>30 mins before</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quran Panel Manager */}
        {activeTab === 'quran' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Quran Content Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setQuranForm({ surahNumber: 1, ayahNumber: 1, textArabic: "", textEnglish: "", textBangla: "" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Ayah
              </button>
            </h4>

            {/* Ayah Form */}
            <form onSubmit={handleQuranSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Surah Number</label>
                  <input
                    type="number"
                    required
                    value={quranForm.surahNumber}
                    onChange={(e) => setQuranForm({ ...quranForm, surahNumber: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ayah Number</label>
                  <input
                    type="number"
                    required
                    value={quranForm.ayahNumber}
                    onChange={(e) => setQuranForm({ ...quranForm, ayahNumber: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Arabic Text</label>
                <textarea
                  required
                  rows={2}
                  value={quranForm.textArabic}
                  onChange={(e) => setQuranForm({ ...quranForm, textArabic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-right font-serif focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white text-base"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bangla Translation</label>
                <textarea
                  required
                  rows={2}
                  value={quranForm.textBangla}
                  onChange={(e) => setQuranForm({ ...quranForm, textBangla: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">English Translation</label>
                <textarea
                  required
                  rows={2}
                  value={quranForm.textEnglish}
                  onChange={(e) => setQuranForm({ ...quranForm, textEnglish: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Ayah Record" : "Save New Ayah"}
              </button>
            </form>

            {/* List for Edit/Delete */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-750">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ayahs Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ayahs..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {ayahs.filter(a => 
                  `surah ${a.surahNumber}`.includes(adminSearchQuery.toLowerCase()) ||
                  a.ayahNumber.toString().includes(adminSearchQuery) ||
                  (a.textEnglish && a.textEnglish.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (a.textBangla && a.textBangla.includes(adminSearchQuery)) ||
                  (a.textArabic && a.textArabic.includes(adminSearchQuery))
                ).map((a) => (
                  <div key={a.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>Surah {a.surahNumber}:{a.ayahNumber}</strong> — {a.textArabic}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(a.id);
                          setQuranForm({
                            surahNumber: a.surahNumber,
                            ayahNumber: a.ayahNumber,
                            textArabic: a.textArabic,
                            textEnglish: a.textEnglish,
                            textBangla: a.textBangla
                          });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAyah(a.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hadith Panel Manager */}
        {activeTab === 'hadith' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Hadith Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setHadithForm({ book: "Sahih al-Bukhari", chapter: "", hadithNumber: "", narrator: "", arabic: "", english: "", bangla: "", category: "" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Hadith
              </button>
            </h4>

            {/* Hadith Form */}
            <form onSubmit={handleHadithSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hadith Book</label>
                  <select
                    value={hadithForm.book}
                    onChange={(e) => setHadithForm({ ...hadithForm, book: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  >
                    <option value="Sahih al-Bukhari">Sahih al-Bukhari</option>
                    <option value="Sahih Muslim">Sahih Muslim</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hadith Number</label>
                  <input
                    type="text"
                    required
                    value={hadithForm.hadithNumber}
                    onChange={(e) => setHadithForm({ ...hadithForm, hadithNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Narrator</label>
                  <input
                    type="text"
                    required
                    value={hadithForm.narrator}
                    placeholder="e.g. Abu Hurayrah"
                    onChange={(e) => setHadithForm({ ...hadithForm, narrator: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={hadithForm.category}
                    placeholder="e.g. Faith (Iman)"
                    onChange={(e) => setHadithForm({ ...hadithForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Arabic Hadith</label>
                <textarea
                  required
                  rows={2}
                  value={hadithForm.arabic}
                  onChange={(e) => setHadithForm({ ...hadithForm, arabic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-right font-serif text-base focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bangla Hadith</label>
                <textarea
                  required
                  rows={2}
                  value={hadithForm.bangla}
                  onChange={(e) => setHadithForm({ ...hadithForm, bangla: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">English Hadith</label>
                <textarea
                  required
                  rows={2}
                  value={hadithForm.english}
                  onChange={(e) => setHadithForm({ ...hadithForm, english: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Hadith Record" : "Save Hadith"}
              </button>
            </form>

            {/* Hadith List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-755">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hadith Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search hadiths..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {hadiths.filter(h => 
                  (h.book && h.book.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (h.hadithNumber && h.hadithNumber.includes(adminSearchQuery)) ||
                  (h.narrator && h.narrator.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (h.english && h.english.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (h.bangla && h.bangla.includes(adminSearchQuery)) ||
                  (h.category && h.category.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                ).map((h) => (
                  <div key={h.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>{h.book} ({h.hadithNumber})</strong> — {h.narrator}: {h.english}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(h.id);
                          setHadithForm({ ...h });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteHadith(h.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dua Manager */}
        {activeTab === 'dua' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Dua Items Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setDuaForm({ title: "", category: "Daily", arabic: "", transliteration: "", english: "", bangla: "", reference: "" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Dua
              </button>
            </h4>

            {/* Dua Form */}
            <form onSubmit={handleDuaSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dua Title</label>
                  <input
                    type="text"
                    required
                    value={duaForm.title}
                    onChange={(e) => setDuaForm({ ...duaForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={duaForm.category}
                    onChange={(e) => setDuaForm({ ...duaForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Morning & Evening">Morning & Evening</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Prayer">Prayer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Arabic Text</label>
                <textarea
                  required
                  rows={2}
                  value={duaForm.arabic}
                  onChange={(e) => setDuaForm({ ...duaForm, arabic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-right font-serif text-base focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Transliteration (Optional)</label>
                <input
                  type="text"
                  value={duaForm.transliteration}
                  onChange={(e) => setDuaForm({ ...duaForm, transliteration: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bangla Meaning</label>
                  <textarea
                    required
                    value={duaForm.bangla}
                    onChange={(e) => setDuaForm({ ...duaForm, bangla: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">English Meaning</label>
                  <textarea
                    required
                    value={duaForm.english}
                    onChange={(e) => setDuaForm({ ...duaForm, english: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Dua" : "Save Dua"}
              </button>
            </form>

            {/* Duas List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-755">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duas Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search duas..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {duas.filter(d => 
                  (d.title && d.title.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (d.category && d.category.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (d.english && d.english.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (d.bangla && d.bangla.includes(adminSearchQuery)) ||
                  (d.arabic && d.arabic.includes(adminSearchQuery))
                ).map((d) => (
                  <div key={d.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>{d.title}</strong> — {d.category}: {d.arabic}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(d.id);
                          setDuaForm({ ...d });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDua(d.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Articles Manager */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Articles Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setArticleForm({ title: "", category: "", content: "", author: "Islamic Knowledge Team" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Article
              </button>
            </h4>

            {/* Article Form */}
            <form onSubmit={handleArticleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={articleForm.category}
                    placeholder="e.g. Belief, History, Fiqh"
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Article" : "Save Article"}
              </button>
            </form>

            {/* Articles List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-755">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Articles Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {articles.filter(art => 
                  (art.title && art.title.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (art.category && art.category.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (art.author && art.author.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (art.content && art.content.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                ).map((art) => (
                  <div key={art.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>{art.title}</strong> — {art.category} by {art.author}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(art.id);
                          setArticleForm({
                            title: art.title,
                            category: art.category,
                            content: art.content,
                            author: art.author
                          });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Islamic Events Manager */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Islamic Events Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEventForm({ title: "", dateHijri: "", dateGregorian: "", description: "" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Event
              </button>
            </h4>

            {/* Event Form */}
            <form onSubmit={handleEventSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hijri Date</label>
                  <input
                    type="text"
                    required
                    value={eventForm.dateHijri}
                    placeholder="e.g. 10 Dhul-Hijjah 1447"
                    onChange={(e) => setEventForm({ ...eventForm, dateHijri: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gregorian Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.dateGregorian}
                    onChange={(e) => setEventForm({ ...eventForm, dateGregorian: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none text-slate-850 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Event" : "Save Event"}
              </button>
            </form>

            {/* Events List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-755">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Islamic Events Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {events.filter(ev => 
                  (ev.title && ev.title.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (ev.dateHijri && ev.dateHijri.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                  (ev.dateGregorian && ev.dateGregorian.includes(adminSearchQuery)) ||
                  (ev.description && ev.description.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                ).map((ev) => (
                  <div key={ev.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>{ev.title}</strong> — {ev.dateHijri} ({ev.dateGregorian})
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(ev.id);
                          setEventForm({
                            title: ev.title,
                            dateHijri: ev.dateHijri,
                            dateGregorian: ev.dateGregorian,
                            description: ev.description
                          });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Manager */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>Category Manager</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setCategoryForm({ name: "" });
                }}
                className="text-[10px] bg-emerald-800 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Clear / New Category
              </button>
            </h4>

            {/* Category Form */}
            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  placeholder="e.g. Seerah, Islamic Creed, Supplications"
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Category" : "Save Category"}
              </button>
            </form>

            {/* Categories List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-755">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Category Database</span>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-[10px] text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {categoriesList.filter(c => 
                  c.name.toLowerCase().includes(adminSearchQuery.toLowerCase())
                ).map((cat) => (
                  <div key={cat.id} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex-1 pr-4 line-clamp-1 text-slate-700 dark:text-slate-350">
                      <strong>{cat.name}</strong> <span className="text-[10px] text-slate-400">({cat.id})</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setCategoryForm({ name: cat.name });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Database Backup & CSV/JSON Imports */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-700/50 pb-3">
              App Engine Storage & Data Synchronization
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              {/* Export Panel */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                <h5 className="font-bold text-emerald-850 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileOutput className="w-4 h-4" />
                  Database Export Utility
                </h5>
                <p className="text-slate-500 dark:text-slate-400">
                  Generate and download a self-contained JSON backup file containing all Quran, Hadith, Duas, and Islamic events records.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Generate JSON Backup
                </button>
              </div>

              {/* Import Panel */}
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40 space-y-3">
                <h5 className="font-bold text-amber-850 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileInput className="w-4 h-4" />
                  Database Import Utility
                </h5>
                <p className="text-slate-500 dark:text-slate-400">
                  Import Quran content, Hadiths, or custom Duas directly into the offline cache and Firestore database using JSON files.
                </p>
                
                <label className="block">
                  <span className="sr-only">Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="block w-full text-xs text-slate-550
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-semibold
                      file:bg-amber-100 file:text-amber-800
                      hover:file:bg-amber-200 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
