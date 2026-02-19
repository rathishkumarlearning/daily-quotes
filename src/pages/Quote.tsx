import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Quote as QuoteIcon, Tag, BookOpen, Calendar, Play, Pause, Square } from 'lucide-react';
import { getQuote, quotes } from '../data';
import { useNarration } from '../hooks/useNarration';

export default function Quote() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const quote = getQuote(slug || '');
  const { state, supported, speak, pause, resume, stop } = useNarration();

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

  const idx = quotes.findIndex(q => q.slug === slug);
  const prev = idx > 0 ? quotes[idx - 1] : null;
  const next = idx < quotes.length - 1 ? quotes[idx + 1] : null;

  const handleNarrate = () => {
    if (state === 'playing') {
      pause();
    } else if (state === 'paused') {
      resume();
    } else {
      speak(quote.text, quote.author);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => { stop(); navigate('/'); }}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            All Quotes
          </button>
          <div className="h-4 w-px" style={{ background: 'var(--border)' }} />
          <span className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{quote.author}</span>

          {/* Narration controls in header */}
          {supported && (
            <div className="ml-auto flex items-center gap-2">
              {state !== 'idle' && (
                <button
                  onClick={stop}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  title="Stop"
                >
                  <Square className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                </button>
              )}
              <button
                onClick={handleNarrate}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: state === 'playing' ? `${quote.accent}25` : 'var(--bg-card)',
                  border: `1px solid ${state !== 'idle' ? quote.accent + '50' : 'var(--border)'}`,
                  color: state !== 'idle' ? quote.accent : 'var(--text-secondary)',
                }}
              >
                {state === 'playing' ? (
                  <>
                    <motion.div
                      className="flex items-center gap-0.5"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <span className="w-0.5 h-3 rounded-full" style={{ background: quote.accent }} />
                      <span className="w-0.5 h-5 rounded-full" style={{ background: quote.accent }} />
                      <span className="w-0.5 h-3 rounded-full" style={{ background: quote.accent }} />
                    </motion.div>
                    <span>Pause</span>
                  </>
                ) : state === 'paused' ? (
                  <><Play className="w-3 h-3" /><span>Resume</span></>
                ) : (
                  <><Play className="w-3 h-3" /><span>Listen</span></>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Category */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-8">
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
          <QuoteIcon className="absolute -top-4 -left-2 w-12 h-12 opacity-10" style={{ color: quote.accent }} />
          <blockquote
            className="text-3xl md:text-4xl font-bold leading-tight pl-6"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Fredoka, sans-serif',
              borderLeft: `4px solid ${quote.accent}`,
            }}
          >
            {quote.text}
          </blockquote>

          {/* Big listen button below quote */}
          {supported && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mt-8 pl-6"
            >
              <button
                onClick={handleNarrate}
                className="flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: state !== 'idle'
                    ? `${quote.accent}25`
                    : `linear-gradient(135deg, ${quote.accent}30, ${quote.accent}15)`,
                  border: `1px solid ${quote.accent}40`,
                  color: quote.accent,
                }}
              >
                {state === 'playing' ? (
                  <>
                    <motion.div
                      className="flex items-center gap-0.5"
                      animate={{ scaleY: [1, 1.5, 0.8, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                      {[...Array(4)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="w-0.5 h-4 rounded-full inline-block"
                          style={{ background: quote.accent }}
                          animate={{ scaleY: [1, 1.5 - i * 0.2, 0.8, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        />
                      ))}
                    </motion.div>
                    <Pause className="w-4 h-4" />
                    Pause narration
                  </>
                ) : state === 'paused' ? (
                  <><Play className="w-4 h-4" fill="currentColor" /> Resume narration</>
                ) : (
                  <><Play className="w-4 h-4" fill="currentColor" /> Listen to this quote</>
                )}
              </button>

              {state !== 'idle' && (
                <button
                  onClick={stop}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all hover:opacity-70"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  <Square className="w-4 h-4" fill="currentColor" />
                  Stop
                </button>
              )}
            </motion.div>
          )}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10">
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
              onClick={() => { stop(); navigate(`/quote/${prev.slug}`); }}
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
              onClick={() => { stop(); navigate(`/quote/${next.slug}`); }}
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
