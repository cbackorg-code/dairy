import React from 'react';
import ReceiptCapture from './ReceiptCapture';
import { useTranslation } from '@/i18n/useTranslation';

interface BottomNavProps {
  language: 'EN' | 'TE';
  currentTab: 'home' | 'records' | 'profile';
  setCurrentTab: (tab: 'home' | 'records' | 'profile') => void;
  handleSaveReceipt: (data: any) => void;
}

export default function BottomNav({ 
  language, 
  currentTab, 
  setCurrentTab, 
  handleSaveReceipt 
}: BottomNavProps) {
  const { t } = useTranslation(language);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t-[3px] border-outline">
      <div className="max-w-lg mx-auto h-[76px] px-space-md grid grid-cols-3 items-center">
        {/* Left Tab: Home */}
        <div className="flex justify-center">
          <button 
            onClick={() => setCurrentTab('home')}
            aria-label="Home" 
            className={`flex flex-col items-center justify-center w-[72px] h-[72px] p-2 active:translate-y-0.5 transition-transform rounded-2xl ${currentTab === 'home' ? 'bg-primary-container text-on-primary border-2 border-outline' : 'text-on-surface-variant hover:bg-surface-container border-2 border-transparent'}`}
          >
            <span className="material-symbols-outlined text-[28px]" data-weight={currentTab === 'home' ? 'fill' : 'regular'}>home</span>
            <span className="font-label-sm text-[11px] mt-1">{t('nav.home')}</span>
          </button>
        </div>
        
        {/* Center Elevated OCR Camera Button */}
        <div className="flex justify-center">
          <div className="relative -top-5">
            <ReceiptCapture onSave={handleSaveReceipt} language={language} />
          </div>
        </div>

        {/* Right Tab: Records */}
        <div className="flex justify-center">
          <button 
            onClick={() => setCurrentTab('records')}
            aria-label="Records" 
            className={`flex flex-col items-center justify-center w-[72px] h-[72px] p-2 active:translate-y-0.5 transition-transform rounded-2xl ${currentTab === 'records' ? 'bg-primary-container text-on-primary border-2 border-outline' : 'text-on-surface-variant hover:bg-surface-container border-2 border-transparent'}`}
          >
            <span className="material-symbols-outlined text-[28px]" data-weight={currentTab === 'records' ? 'fill' : 'regular'}>receipt_long</span>
            <span className="font-label-sm text-[11px] mt-1">{t('nav.records')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
