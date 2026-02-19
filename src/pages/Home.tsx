import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote as QuoteIcon, Sparkles, Filter } from 'lucide-react';
import { quotes, categories, getTodaysQuote } from '../data';

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const todaysQuote = getTodaysQuote();

  const filtered = activeCategory === 'All'
    ? quotes
    : quotes.filter(q => q.category === activeCategory);

  const allCategories = ['All', ...categories];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
              <QuoteIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Daily Quotes</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{quotes.length} quotes</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Today's Quote Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(`/quote/${todaysQuote.slug}`)}
          className="relative rounded-2xl p-8 mb-12 cursor-pointer overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, ${todaysQuote.accent}18 0%, ${todaysQuote.accent}08 100%)`,
            border: `1px solid ${todaysQuote.accent}30`,
          }}
        >
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20"
            style={{ background: todaysQuote.accent }} />

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: todaysQuote.accent }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: todaysQuote.accent }}>
              Today's Quote
            </span>
          </div>

          <blockquote className="text-2xl font-bold leading-relaxed mb-6 max-w-3xl" style={{ color: 'var(--text-primary)', fontFamily: 'Fredoka, sans-serif' }}>
            "{todaysQuote.text}"
          </blockquote>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{todaysQuote.author}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{todaysQuote.role}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: `${todaysQuote.accent}20`, color: todaysQuote.accent }}>
              {todaysQuote.category}
            </span>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)' : 'var(--bg-card)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quote Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((quote, i) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => navigate(`/quote/${quote.slug}`)}
              className="rounded-xl p-6 cursor-pointer group transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${quote.accent}40`;
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              }}
            >
              {/* Accent bar */}
              <div className="w-8 h-1 rounded-full mb-4" style={{ background: quote.accent }} />

              <blockquote
                className="text-sm leading-relaxed mb-4 line-clamp-4"
                style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
              >
                "{quote.text}"
              </blockquote>

              <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{quote.author}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{quote.role}</p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: `${quote.accent}18`, color: quote.accent }}
                >
                  {quote.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
