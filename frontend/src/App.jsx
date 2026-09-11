import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RoadProvider } from './context/RoadContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import GovtPortal from './pages/GovtPortal';

export default function App() {
  return (
    <LanguageProvider>
      <RoadProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            toastOptions={{
              style: {
                borderRadius: '16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
              }
            }}
          />
          <Header />
          <main className="flex-1 relative">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/citizen" element={<CitizenPortal />} />
              <Route path="/govt" element={<GovtPortal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </RoadProvider>
    </LanguageProvider>
  );
}
