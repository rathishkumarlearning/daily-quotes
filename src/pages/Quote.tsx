import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Quote as QuoteIcon, Tag, BookOpen, Calendar } from 'lucide-react';
import { getQuote, quotes } from '../data';

export default function Quote() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const quote = getQuote(slug || '');

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: 'var(--text-muted)' }}>Quote not found</p>
          <button onClick={() => navigate('/')} className="text-sm" style={{ color: '#8B5CF6' }}>← Back home</button>
        </div>
      </div>
    );
  }

  // Get prev/next
  const idx = quotes.findIndex(q => q.slug === slug);
  const prev = idx > 0 ? quotes[idx - 1] : null;
  const next = idx < quotes.length - 1 ? quotes[idx + 1] : null;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            All Quotes
          </button>
          <div className="h-4 w-px" style={{ background: 'var(--border)' }} />
          <span className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{quote.author}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: `${quote.accent}20`, color: quote.accent }}
          >
            {quote.category}
          </span>
        </motion.div>

        {/* Main Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-12"
        >
          <QuoteIcon
            className="absolute -top-4 -left-2 w-12 h-12 opacity-10"
            style={{ color: quote.accent }}
          />
          <blockquote
            className="text-3xl md:text-4xl font-bold leading-tight pl-6"
            style={{ color: 'var(--text-primary)', fontFamily: 'Fredoka, sans-serif', borderLeft: `4px solid ${quote.accent}` }}
          >
            {quote.text}
          </blockquote>
        </motion.div>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-6 mb-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold"
              style={{ background: `${quote.accent}25`, color: quote.accent }}
            >
              {quote.author[0]}
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{quote.author}</p>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{quote.role}</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{quote.source}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Why It Matters
          </h3>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {quote.context}
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 flex-wrap mb-16"
        >
          <Tag className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          {quote.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              #{tag}
            </span>
          ))}
          <span className="text-xs ml-auto flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Calendar className="w-3 h-3" />
            {quote.date}
          </span>
        </motion.div>

        {/* Prev / Next */}
        <div className="grid grid-cols-2 gap-4 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          {prev ? (
            <button
              onClick={() => navigate(`/quote/${prev.slug}`)}
              className="text-left rounded-xl p-4 transition-all hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>← Previous</p>
              <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{prev.author}</p>
              <p className="text-xs line-clamp-2 mt-1" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{prev.text}"</p>
            </button>
          ) : <div />}

          {next ? (
            <button
              onClick={() => navigate(`/quote/${next.slug}`)}
              className="text-right rounded-xl p-4 transition-all hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Next →</p>
              <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{next.author}</p>
              <p className="text-xs line-clamp-2 mt-1" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{next.text}"</p>
            </button>
          ) : <div />}
        </div>

      </div>
    </div>
  );
}
