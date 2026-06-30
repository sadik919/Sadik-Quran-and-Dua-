import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, BookOpen, Calendar, ArrowLeft, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ArticlesSection() {
  const { articles } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div id="articles-section" className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedArticleId ? (
          /* List of Articles */
          <motion.div
            key="articles-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="article-search"
                type="text"
                placeholder="Search articles by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Articles Stack */}
            <div className="grid gap-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <motion.div
                    key={art.id}
                    id={`article-card-${art.id}`}
                    onClick={() => setSelectedArticleId(art.id)}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                    whileHover={{ y: -1 }}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full inline-block">
                        {art.category}
                      </span>
                      <h4 className="font-bold text-slate-850 dark:text-white text-lg leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {art.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-750/50 pt-3 mt-4 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> By {art.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {art.date}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No articles found matching your query.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Article Detail View */
          <motion.div
            key="article-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4"
          >
            {/* Header / Back */}
            <button
              onClick={() => setSelectedArticleId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </button>

            {/* Meta */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full inline-block">
                {selectedArticle?.category}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-850 dark:text-white leading-tight">
                {selectedArticle?.title}
              </h3>
              
              <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedArticle?.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle?.date}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-slate-100 dark:border-slate-700"></div>

            {/* Content Body */}
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line tracking-wide">
              {selectedArticle?.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
