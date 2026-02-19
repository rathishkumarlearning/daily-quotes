import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Quote from './pages/Quote';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/daily-quotes">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote/:slug" element={<Quote />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
