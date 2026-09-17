import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';

interface RecordsTabProps {
  language: 'EN' | 'TE';
  cycleFilter: 'all' | 'completed' | 'current';
  setCycleFilter: (filter: 'all' | 'completed' | 'current') => void;
  selectedCycleId: number | null;
  setSelectedCycleId: (id: number | null) => void;
  filteredCycles: any[];
  cycles: any[];
  feed: any[];
  isLoading?: boolean;
}

export default function RecordsTab({
  language,
  cycleFilter,
  setCycleFilter,
  selectedCycleId,
  setSelectedCycleId,
  filteredCycles,
  cycles,
  feed,
  isLoading
}: RecordsTabProps) {
  const { t } = useTranslation(language);

  // Compute summary totals from actual data
  const totalQuantity = cycles.reduce((sum: number, c: any) => sum + (c.milk || 0), 0);
  const totalBill = cycles.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
  const avgFat = cycles.length > 0
    ? cycles.reduce((sum: number, c: any) => sum + (c.fat || 0), 0) / cycles.length
    : 0;

  return (
    <div className="w-full">
      <section className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">{t('records.title')}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">{t('records.subtitle')}</p>
        </div>
      </section>

      {!selectedCycleId ? (
        <>
          {/* Collection Summary Card */}
          <section className="bg-primary-container text-on-primary rounded-xl border-2 border-outline p-space-md tactile-shadow-lg mb-6">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-on-primary">water_drop</span>
                <span className="font-headline-sm text-headline-sm text-on-primary">{t('records.summary')}</span>
              </div>
              <div className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border-2 border-outline">
                2026
              </div>
            </div>
            <div className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-xl p-3 my-2 grid grid-cols-3 divide-x-2 divide-outline">
              <div className="text-center px-1">
                <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.cycles')}</span>
                <span className="block font-headline-md text-headline-md text-on-surface mt-0.5">{cycles.length}</span>
              </div>
              <div className="text-center px-1">
                <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.quantity')}</span>
                <span className="block font-headline-md text-headline-md text-on-surface mt-0.5">{totalQuantity > 0 ? `${totalQuantity.toFixed(1)} L` : '—'}</span>
              </div>
              <div className="text-center px-1">
                <span className="block font-label-sm text-label-sm text-primary">{t('records.total_bill')}</span>
                <span className="block font-headline-md text-headline-md text-primary mt-0.5">{totalBill > 0 ? `₹${totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-on-primary">show_chart</span>
                <span className="font-label-md text-label-md text-on-primary">{t('records.avg_fat')}</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-primary opacity-90">{t('records.cumulative')}</span>
            </div>
          </section>

          {/* Billing Cycles Filter */}
          <section className="space-y-space-sm mb-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{t('records.billing_cycles')}</h2>
              <span className="font-label-sm text-label-sm text-tertiary">{t('records.every_15_days')}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button 
                onClick={() => setCycleFilter('all')}
                className={`${cycleFilter === 'all' ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'} border-2 border-outline font-label-md text-label-md px-4 py-2 rounded-xl tactile-shadow transition-transform active:translate-y-0.5 shrink-0`}
              >
                {t('records.filter_all')}
              </button>
              <button 
                onClick={() => setCycleFilter('completed')}
                className={`${cycleFilter === 'completed' ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'} border-2 border-outline font-label-md text-label-md px-4 py-2 rounded-xl tactile-shadow transition-transform active:translate-y-0.5 shrink-0`}
              >
                {t('records.filter_completed')}
              </button>
              <button 
                onClick={() => setCycleFilter('current')}
                className={`${cycleFilter === 'current' ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'} border-2 border-outline font-label-md text-label-md px-4 py-2 rounded-xl tactile-shadow transition-transform active:translate-y-0.5 shrink-0`}
              >
                {t('records.filter_current')}
              </button>
            </div>
          </section>

          {/* Historical Cards */}
          <section className="space-y-space-md pb-6">
            {filteredCycles.length > 0 ? (
              filteredCycles.map(c => (
                <article 
                  key={c.id} 
                  onClick={() => setSelectedCycleId(c.id)}
                  className="bg-surface-container-lowest border-2 border-outline rounded-xl tactile-shadow-lg overflow-hidden cursor-pointer active:translate-y-1 active:shadow-none transition-all"
                >
                  <div className={`${c.status === 'completed' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface'} px-space-md py-2.5 flex justify-between items-center border-b-2 border-outline`}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">event_note</span>
                      <span className="font-label-lg text-label-lg">{t('records.cycle')} {c.name === 'Current Cycle' && language === 'TE' ? 'ప్రస్తుత విడత' : c.name}</span>
                    </div>
                    <span className={`${c.status === 'completed' ? 'bg-surface-container-lowest text-on-surface' : 'bg-surface text-on-surface'} font-label-sm text-label-sm px-2 py-0.5 rounded border border-outline`}>
                      {c.type}
                    </span>
                  </div>
                  <div className="p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                      <div>
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.calculated_bill')}</span>
                        <span className="block font-headline-xl-mobile text-headline-xl-mobile text-primary">₹{c.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 font-label-md text-label-md px-3 py-1.5 rounded-full border-2 border-outline ${c.status === 'completed' ? 'bg-on-primary-container text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[16px]">{c.status === 'completed' ? 'check_circle' : 'pending'}</span>
                        <span className="capitalize">{c.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-1">
                      <div className="bg-surface-container-low p-2 rounded-lg border border-outline text-center">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.poured_milk')}</span>
                        <span className="block font-label-lg text-label-lg text-on-surface mt-0.5">{c.milk} L</span>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded-lg border border-outline text-center">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.avg_fat')}</span>
                        <span className="block font-label-lg text-label-lg text-on-surface mt-0.5">{c.fat}%</span>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded-lg border border-outline text-center">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">{t('records.avg_rate')}</span>
                        <span className="block font-label-lg text-label-lg text-on-surface mt-0.5">₹{c.rate}/L</span>
                      </div>
                    </div>
                    <div className="pt-2 text-primary font-label-md flex items-center justify-center gap-1">
                      <span>{t('records.view_receipts')}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-10 bg-surface-container-lowest border-2 border-outline rounded-xl tactile-shadow">
                <p className="font-headline-sm text-on-surface">{t('records.no_cycles')}</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="space-y-4 pb-6">
          <button 
            onClick={() => setSelectedCycleId(null)}
            className="flex items-center gap-2 font-label-md text-on-surface-variant mb-4 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {t('records.back')}
          </button>
          
          <div className="bg-surface-container-high border-2 border-outline rounded-xl p-4 tactile-shadow mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              {(cycles.find(c => c.id === selectedCycleId)?.name === 'Current Cycle' && language === 'TE' ? 'ప్రస్తుత విడత' : cycles.find(c => c.id === selectedCycleId)?.name)} {t('records.receipts_title')}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {feed.map((slip, idx) => (
              <div key={idx} className="bg-surface-container-lowest border-2 border-outline rounded-xl overflow-hidden tactile-shadow">
                <div className="bg-secondary px-3.5 py-2 flex items-center justify-between text-on-secondary border-b-2 border-outline">
                  <span className="font-headline-sm text-label-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    {slip.date} • {slip.shift}
                  </span>
                  <span className="font-label-sm text-[11px] bg-surface-container-lowest text-secondary px-2 py-0.5 rounded border border-outline">Buffalo</span>
                </div>
                <div className="grid grid-cols-4 divide-x-2 divide-outline border-b-2 border-outline bg-surface-bright text-center">
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">Liters</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.liters} L</p>
                  </div>
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">Fat</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.fat}%</p>
                  </div>
                  <div className="py-2.5 px-1">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">SNF</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-0.5">{slip.snf}</p>
                  </div>
                  <div className="py-2.5 px-1 bg-surface-container-low">
                    <p className="font-label-sm text-[11px] text-on-surface-variant uppercase">Amount</p>
                    <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5 font-bold">₹{slip.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
