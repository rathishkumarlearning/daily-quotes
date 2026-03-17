export interface Quote {
  id: number;
  slug: string;
  text: string;
  author: string;
  role: string;
  source: string;
  category: string;
  date: string;
  tags: string[];
  accent: string;
  context: string;
}

import { quotes as batch1 } from './quotes-batch-1';
import { quotes as batch2 } from './quotes-batch-2';
import { quotes as batch3 } from './quotes-batch-3';
import { quotes as batch4 } from './quotes-batch-4';

export const quotes: Quote[] = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
];

export const categories: string[] = [...new Set(quotes.map(q => q.category))];

export function getQuote(slug: string): Quote | undefined {
  return quotes.find(q => q.slug === slug);
}

export function getTodaysQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

export function getByCategory(category: string): Quote[] {
  return quotes.filter(q => q.category === category);
}
