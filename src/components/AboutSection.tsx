import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, Globe, Info, Heart, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AboutSection() {
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.message) return;
    setIsSubmitting(true);

    try {
      if (db) {
        await addDoc(collection(db, 'feedbacks'), {
          ...feedback,
          timestamp: new Date().toISOString()
        });
      } else {
        // Fallback save to local storage array
        const list = JSON.parse(localStorage.getItem('noor_feedbacks') || '[]');
        list.push({ ...feedback, id: Date.now() });
        localStorage.setItem('noor_feedbacks', JSON.stringify(list));
      }
      setSubmitted(true);
      setFeedback({ name: "", email: "", message: "" });
    } catch (err) {
      console.warn("Feedback submit failed: ", err);
      // Fallback save to local storage array anyway
      const list = JSON.parse(localStorage.getItem('noor_feedbacks') || '[]');
      list.push({ ...feedback, id: Date.now() });
      localStorage.setItem('noor_feedbacks', JSON.stringify(list));
      setSubmitted(true);
      setFeedback({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="about-section" className="space-y-6">
      {/* App Branding */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 text-center shadow-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-900 flex items-center justify-center rounded-full text-amber-300 text-4xl mb-4 border-2 border-amber-400">
          ✦
        </div>
        <h3 className="text-2xl font-serif font-black text-slate-800 dark:text-white">Sadik Quran And Dua</h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-semibold mt-1">
          Your Comprehensive Islamic Companion
        </p>
        <span className="text-[10px] text-slate-400 mt-2 font-mono bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
          Version 1.2.0 (PWA Ready)
        </span>
      </div>

      {/* App Info Grid */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-700/50 pb-3">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          General Information
        </h4>

        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>Sadik Quran And Dua</strong> is a modern Progressive Web App (PWA) designed to provide Muslims worldwide with a visually beautiful, highly intuitive, and accurate platform for reading Quran, tracking prayer times, dhikr, and accessing daily Hadiths and Islamic knowledge.
          </p>
          <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Offline Capable:</strong> Standard Hadiths, Quran Surahs, Allah's 99 Names, and Tasbih counters run completely offline using local database structures.
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-700/50 pb-3">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Contact & Legal
        </h4>

        <div className="grid gap-3 text-xs text-slate-650 dark:text-slate-350">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-emerald-650" />
            <span>sadikullhaque999@gmail.com</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-emerald-650" />
            <span>www.noorislam.app</span>
          </div>
          <div className="flex items-start gap-2.5 mt-2 border-t border-slate-50 dark:border-slate-750/50 pt-2.5">
            <Heart className="w-4 h-4 text-red-500 fill-current mt-0.5" />
            <p>
              Developed for public welfare. Sadik Quran And Dua is open-source and respects user data. No tracking coordinates are saved in the cloud.
            </p>
          </div>
        </div>
      </div>

      {/* Send Feedback Form */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-700/50 pb-3">
          <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Share Feedback or Report Error
        </h4>

        {submitted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-300 p-4 rounded-2xl text-center text-xs">
            🎉 Jazakallah! Your valuable feedback has been submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  placeholder="Ali"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  placeholder="ali@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Message</label>
              <textarea
                required
                rows={3}
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                placeholder="Write your feedback or bug details here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Send Feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
