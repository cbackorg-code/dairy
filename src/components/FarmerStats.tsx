import React from 'react';

export interface ShiftData {
  id: string;
  shift: 'AM' | 'PM';
  date: string;
  quantity: number;
  fat: number;
  snf: number;
  rate: number;
  total_amount: number;
  water_percent: number;
}

interface FarmerStatsProps {
  stats: {
    totalPayout: number;
    totalMilk: number;
    averageRate: number;
    amShifts: number;
    pmShifts: number;
    avgFat: number;
    avgWater: number;
  };
  cycle: 'H1' | 'H2';
  onCycleChange: (c: 'H1' | 'H2') => void;
  onClickBill?: () => void;
  language: 'EN' | 'TE';
}

import { useTranslation } from '@/i18n/useTranslation';

export default function FarmerStats({ stats, cycle, onCycleChange, onClickBill, language }: FarmerStatsProps) {
  const { t } = useTranslation(language);
  const { totalPayout, totalMilk, averageRate, amShifts, pmShifts, avgFat, avgWater } = stats;

  // Compute dynamic cycle progress
  const now = new Date();
  const dayOfMonth = now.getDate();
  const monthName = now.toLocaleString(language === 'TE' ? 'te-IN' : 'en-US', { month: 'short' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // How many days have elapsed in the selected half
  let daysElapsed: number;
  let totalDaysInHalf: number;
  let isCycleClosed: boolean;
  if (cycle === 'H1') {
    totalDaysInHalf = 15;
    daysElapsed = dayOfMonth <= 15 ? dayOfMonth : 15;
    isCycleClosed = dayOfMonth > 15;
  } else {
    totalDaysInHalf = daysInMonth - 15;
    daysElapsed = dayOfMonth > 15 ? dayOfMonth - 15 : totalDaysInHalf;
    isCycleClosed = dayOfMonth <= 15; // H2 of previous context is closed if we're now in H1
  }

  const calculatedDateStr = `${dayOfMonth} ${monthName}`;
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
      
      {/* ESTIMATED BILL VALUE (HERO) */}
      <section className="space-y-2">
        <div className="px-1">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {t('stats.estimated_bill')}
          </h2>
        </div>
        <article 
          onClick={onClickBill}
          className="bg-primary-container text-on-primary border-2 border-outline p-space-lg rounded-[24px] tactile-shadow-lg relative overflow-hidden cursor-pointer active:translate-y-1 active:shadow-none transition-all"
        >
          {/* Top meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-on-surface border-2 border-outline px-2.5 py-0.5 rounded-full font-label-sm text-label-sm shrink-0">
              <span className="material-symbols-outlined text-primary text-[15px]">verified</span>
              {daysElapsed} {language === 'TE' ? 'రోజులు పూర్తయ్యాయి' : `Day${daysElapsed !== 1 ? 's' : ''} Complete`}
            </span>
            <span className="font-label-sm text-label-sm opacity-90 whitespace-nowrap">
              {language === 'TE' ? 'లెక్కించబడింది' : 'Calculated'}: {calculatedDateStr}
            </span>
          </div>

          {/* Main Value */}
          <div className="my-3">
            <p className="font-label-md text-label-md uppercase tracking-wider text-on-primary-container">
              {t('stats.estimated_bill')}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-xl text-[34px] leading-tight font-bold tracking-tight">
                ₹{totalPayout.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-primary-container mt-1">
              {t('stats.total_pour')} {totalMilk.toFixed(1)} {t('stats.liters')} • {t('stats.cycle_15_day')}
            </p>
          </div>

          {/* Divider line */}
          <div className="h-0.5 bg-outline opacity-40 my-3"></div>

          {/* Metrics Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary border-2 border-outline flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div>
                <p className="font-label-sm text-[11px] text-on-primary-container uppercase">
                  {t('stats.avg_rate')}
                </p>
                <p className="font-headline-sm text-headline-sm leading-none">₹{averageRate.toFixed(2)} / L</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-on-primary-container text-primary font-headline-sm text-label-sm px-2.5 py-1 rounded-lg border border-outline">
                {isCycleClosed ? t('stats.cycle_closed') : (language === 'TE' ? 'ప్రగతిలో ఉంది' : 'In Progress')}
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* COLLECTION METRICS GRID (4 CARDS) */}
      <section className="space-y-2">
        <h2 className="font-headline-md text-headline-md text-on-surface px-1">
          {t('stats.collection_metrics')}
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Total Milk */}
          <div className="bg-surface-container-lowest border-2 border-outline rounded-xl p-3 tactile-shadow flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('stats.total_milk')}
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">water_drop</span>
            </div>
            <div>
              <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{totalMilk.toFixed(1)} L</p>
              <p className="font-label-sm text-[11px] text-primary flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                {t('stats.great_yield')}
              </p>
            </div>
          </div>

          {/* Card 2: Avg Rate */}
          <div className="bg-surface-container-lowest border-2 border-outline rounded-xl p-3 tactile-shadow flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('stats.avg_rate')}
              </span>
              <span className="material-symbols-outlined text-tertiary-container text-[20px]">currency_rupee</span>
            </div>
            <div>
              <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                ₹{averageRate.toFixed(2)}<span className="text-xs">/L</span>
              </p>
              <p className="font-label-sm text-[11px] text-primary mt-0.5">
                {t('stats.with_bonus')}
              </p>
            </div>
          </div>

          {/* Card 3: Quality */}
          <div className="bg-surface-container-lowest border-2 border-outline rounded-xl p-3 tactile-shadow flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('stats.quality')}
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">science</span>
            </div>
            <div>
              <p className="font-headline-sm text-[16px] text-on-surface leading-snug">{avgFat.toFixed(1)}% FAT</p>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                {t('stats.grade_a')}
              </p>
            </div>
          </div>

          {/* Card 4: Shifts Attended */}
          <div className="bg-surface-container-lowest border-2 border-outline rounded-xl p-3 tactile-shadow flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('stats.shifts_attended')}
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">event_available</span>
            </div>
            <div>
              <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{amShifts + pmShifts}</p>
              <p className="font-label-sm text-[11px] text-error mt-0.5 truncate">
                {t('stats.total_shifts')}
              </p>
            </div>
          </div>
        </div>

        {/* Shift breakdown pill bar */}
        <div className="bg-surface-container-low border-2 border-outline rounded-xl px-3 py-2 flex items-center justify-between text-on-surface font-label-sm text-label-sm mt-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-tertiary-container">light_mode</span>
            {amShifts} {t('stats.morning')}
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">dark_mode</span>
            {pmShifts} {t('stats.evening')}
          </span>
        </div>
      </section>
    </div>
  );
}
