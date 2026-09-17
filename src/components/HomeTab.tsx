import React from 'react';
import FarmerStats from './FarmerStats';
import { useTranslation } from '@/i18n/useTranslation';

interface HomeTabProps {
  language: 'EN' | 'TE';
  cycle: 'H1' | 'H2';
  setCycle: (c: 'H1' | 'H2') => void;
  onClickBill: () => void;
  stats: any;
  feed: any[];
  allFeed: any[];
  isLoading?: boolean;
  monthLabel?: string;
  daysInMonth?: number;
}

export default function HomeTab({ 
  language, 
  cycle, 
  setCycle, 
  onClickBill,
  stats,
  feed,
  allFeed,
  isLoading,
  monthLabel = 'Oct',
  daysInMonth = 31
}: HomeTabProps) {
  const { t } = useTranslation(language);

  return (
    <>
      {/* COLLECTION CYCLE SELECTOR */}
      <section className="bg-surface-container-lowest border-2 border-outline rounded-xl p-3.5 space-y-2.5 tactile-shadow">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
            {t('home.collection_cycle')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCycle('H1')}
            className={`${cycle === 'H1' ? 'bg-primary-container text-on-primary' : 'bg-surface-bright text-on-surface hover:bg-surface-container'} border-2 border-outline rounded-xl p-2.5 text-left tactile-shadow active:translate-y-0.5 transition-transform`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-headline-sm text-label-md">1 – 15 {monthLabel}</span>
              {cycle === 'H1' ? (
                <span className="material-symbols-outlined text-[16px]" data-weight="fill">check_circle</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              )}
            </div>
            <span className="font-label-sm text-[11px] block opacity-90">{t('home.first_half')}</span>
          </button>
          <button
            onClick={() => setCycle('H2')}
            className={`${cycle === 'H2' ? 'bg-primary-container text-on-primary' : 'bg-surface-bright text-on-surface hover:bg-surface-container'} border-2 border-outline rounded-xl p-2.5 text-left tactile-shadow active:translate-y-0.5 transition-transform`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-headline-sm text-label-md">16 – {daysInMonth} {monthLabel}</span>
              {cycle === 'H2' ? (
                <span className="material-symbols-outlined text-[16px]" data-weight="fill">check_circle</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              )}
            </div>
            <span className="font-label-sm text-[11px] block opacity-90">{t('home.second_half')}</span>
          </button>
        </div>
      </section>

      <div className="w-full">
        <FarmerStats stats={stats} cycle={cycle} onCycleChange={setCycle} onClickBill={onClickBill} language={language} />
        <section className="mt-8 space-y-4">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface px-1">{t('home.recent_receipts')}</h2>
          <div className="flex flex-col gap-4">
            {isLoading && allFeed.length === 0 ? (
              /* Skeleton loading placeholders */
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-surface-container-lowest border-2 border-outline rounded-xl overflow-hidden tactile-shadow animate-pulse">
                  <div className="bg-secondary/30 px-3.5 py-2 flex items-center justify-between border-b-2 border-outline">
                    <div className="h-4 w-32 bg-outline/20 rounded"></div>
                    <div className="h-4 w-16 bg-outline/20 rounded"></div>
                  </div>
                  <div className="grid grid-cols-4 divide-x-2 divide-outline border-b-2 border-outline bg-surface-bright text-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="py-2.5 px-1">
                        <div className="h-3 w-10 bg-outline/20 rounded mx-auto mb-1"></div>
                        <div className="h-5 w-12 bg-outline/20 rounded mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : allFeed.length === 0 ? (
              <div className="text-center py-10 bg-surface-container-lowest border-2 border-outline rounded-xl tactile-shadow">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2 block">receipt_long</span>
                <p className="font-headline-sm text-on-surface-variant">{t('home.no_receipts') || 'No receipts yet'}</p>
                <p className="font-body-sm text-on-surface-variant mt-1">{t('home.scan_first') || 'Scan your first receipt to get started'}</p>
              </div>
            ) : (
              allFeed.slice(0, 5).map((slip, idx) => (
              <div key={idx} className="bg-surface-container-lowest border-2 border-outline rounded-xl overflow-hidden tactile-shadow">
                <div className="bg-secondary px-3.5 py-2 flex items-center justify-between text-on-secondary border-b-2 border-outline">
                  <span className="font-headline-sm text-label-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    {slip.date} • {slip.shift}
                  </span>
                  <span className="font-label-sm text-[11px] bg-surface-container-lowest text-secondary px-2 py-0.5 rounded border border-outline">{t('home.buffalo')}</span>
                </div>
                <div className="grid grid-cols-4 divide-x-2 divide-outline border-b-2 border-outline bg-surface-bright text-center">
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">{t('home.liters')}</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.liters} L</p>
                  </div>
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">{t('home.fat')}</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.fat}%</p>
                  </div>
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">{t('home.snf')}</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.snf}</p>
                  </div>
                  <div className="py-2.5 px-1 bg-surface-container-low">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">{t('home.amount')}</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5 font-bold">₹{slip.amount}</p>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
