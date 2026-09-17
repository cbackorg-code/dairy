'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { User } from '@/types';

import LoginScreen from '@/components/LoginScreen';
import Header from '@/components/Header';
import HomeTab from '@/components/HomeTab';
import RecordsTab from '@/components/RecordsTab';
import ProfileTab from '@/components/ProfileTab';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';

export default function Home() {
  const today = new Date();
  const initialCycle = today.getDate() <= 15 ? 'H1' : 'H2';
  const [cycle, setCycle] = useState<'H1' | 'H2'>(initialCycle);
  const [currentTab, setCurrentTab] = useState<'home' | 'records' | 'profile'>('home');
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);
  const [cycleFilter, setCycleFilter] = useState<'all' | 'completed' | 'current'>('all');

  const EMPTY_STATS = { totalPayout: 0, totalMilk: 0, averageRate: 0, amShifts: 0, pmShifts: 0, avgFat: 0, avgWater: 0 };

  // Try loading cached dashboard data from localStorage for instant display
  const getInitialDashboardData = () => {
    if (typeof window === 'undefined') return { stats: EMPTY_STATS, feed: [], cycles: [] };
    try {
      const cached = localStorage.getItem('dairybill_dashboard_cache');
      if (cached) return JSON.parse(cached);
    } catch { /* ignore parse errors */ }
    return { stats: EMPTY_STATS, feed: [], cycles: [] };
  };

  const [dashboardData, setDashboardData] = useState<{stats: any, feed: any[], cycles: any[]}>(getInitialDashboardData);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Filter feed and recompute stats based on selected cycle half
  const { cycleStats, cycleFeed, cycleMonthLabel, cycleDaysInMonth } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const monthName = now.toLocaleString('en-US', { month: 'short' });
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Filter feed items that belong to the selected cycle
    const filtered = dashboardData.feed.filter((item: any) => {
      if (!item.date) return false;
      try {
        const d = new Date(item.date);
        if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) return false;
        const day = d.getDate();
        return cycle === 'H1' ? day <= 15 : day > 15;
      } catch {
        return false;
      }
    });

    // Recompute stats from filtered feed
    let totalPayout = 0, totalMilk = 0, rateSum = 0, rateCount = 0;
    let amShifts = 0, pmShifts = 0, fatSum = 0, fatCount = 0;

    for (const item of filtered) {
      totalPayout += item.amount || 0;
      totalMilk += item.liters || 0;
      if (item.fat) { fatSum += item.fat; fatCount++; }
      // Estimate rate from amount/liters if not provided
      if (item.liters > 0) { rateSum += (item.amount || 0) / item.liters; rateCount++; }
      if (item.shift === 'AM' || item.shift === 'Morning Shift') amShifts++;
      else pmShifts++;
    }

    const stats = {
      totalPayout,
      totalMilk,
      averageRate: rateCount > 0 ? rateSum / rateCount : 0,
      amShifts,
      pmShifts,
      avgFat: fatCount > 0 ? fatSum / fatCount : 0,
      avgWater: 0,
    };

    return { cycleStats: stats, cycleFeed: filtered, cycleMonthLabel: monthName, cycleDaysInMonth: daysInMonth };
  }, [dashboardData.feed, cycle]);

  const filteredCycles = dashboardData.cycles.filter(c => cycleFilter === 'all' || c.status === cycleFilter);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginName, setLoginName] = useState('');
  const [loginMobile, setLoginMobile] = useState('');

  const [language, setLanguage] = useState<'EN' | 'TE'>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { t } = useTranslation(language);

  const showToast = (msg: string) => setToastMessage(msg);

  // Fetch dashboard data from API and cache the result
  const fetchDashboardData = useCallback(async (userId: string) => {
    setIsDashboardLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/api/receipts/dashboard?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        // Cache fresh data so next app open is instant
        try {
          localStorage.setItem('dairybill_dashboard_cache', JSON.stringify(data));
        } catch { /* storage full – ignore */ }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('dairybill_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id) {
        setUser(parsedUser);
        fetchDashboardData(parsedUser.id);
      } else {
        localStorage.removeItem('dairybill_user');
      }
    }
    const storedLang = localStorage.getItem('dairybill_lang');
    if (storedLang === 'TE' || storedLang === 'EN') {
      setLanguage(storedLang);
    }
    setIsCheckingAuth(false);
  }, []);

  const changeLanguage = (lang: 'EN' | 'TE') => {
    setLanguage(lang);
    localStorage.setItem('dairybill_lang', lang);
    setIsLangMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'EN' ? 'TE' : 'EN';
    setLanguage(newLang);
    localStorage.setItem('dairybill_lang', newLang);
  };

  const handleAuth = async (e: React.FormEvent, isSignup: boolean) => {
    e.preventDefault();
    if (loginName.trim() && loginMobile.trim().length >= 10) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
        const res = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: loginName, mobile_number: loginMobile })
        });
        
        if (res.ok) {
          const newUser = await res.json();
          setUser(newUser);
          localStorage.setItem('dairybill_user', JSON.stringify(newUser));
          fetchDashboardData(newUser.id);
        } else {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 401) {
            showToast('Invalid name or mobile number.');
          } else if (res.status === 400) {
            showToast(errorData.detail || 'User already exists.');
          } else {
            showToast(isSignup ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
          }
        }
      } catch (err) {
        showToast('Network error. Is the backend running?');
      }
    } else {
      showToast(t('auth.invalid_input'));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dairybill_user');
    localStorage.removeItem('dairybill_dashboard_cache');
    setDashboardData({ stats: EMPTY_STATS, feed: [], cycles: [] });
    setCurrentTab('home');
  };

  const handleSaveReceipt = async (data: any) => {
    if (!user) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/api/receipts/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, user_id: user.id })
      });
      if (res.ok) {
        // Refresh dashboard data
        await fetchDashboardData(user.id);
        
        if (!user.center_name && data.center_name) {
          const updatedUser = { ...user, center_name: data.center_name };
          setUser(updatedUser);
          localStorage.setItem('dairybill_user', JSON.stringify(updatedUser));
          showToast(`${t('receipts.society_saved').replace('{0}', data.center_name)}`);
        } else {
          showToast(t('receipts.saved'));
        }
      } else {
        showToast('Failed to save receipt.');
      }
    } catch (err) {
      showToast('Network error. Failed to save receipt.');
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
         <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <LoginScreen 
        language={language}
        loginName={loginName}
        setLoginName={setLoginName}
        loginMobile={loginMobile}
        setLoginMobile={setLoginMobile}
        handleAuth={handleAuth}
        toggleLanguage={toggleLanguage}
      />
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-surface flex flex-col min-h-screen pb-28 relative">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* TOP APP BAR */}
      <Header 
        user={user} 
        language={language} 
        setCurrentTab={setCurrentTab} 
        isLangMenuOpen={isLangMenuOpen}
        setIsLangMenuOpen={setIsLangMenuOpen}
        changeLanguage={changeLanguage}
      />

      {/* MAIN DASHBOARD CONTENT */}
      <main className="px-space-md pt-space-md space-y-space-md flex-1 w-full">
        
        {currentTab === 'home' && (
          <HomeTab 
            language={language}
            cycle={cycle}
            setCycle={setCycle}
            onClickBill={() => { setCurrentTab('records'); setSelectedCycleId(1); }}
            stats={cycleStats}
            feed={cycleFeed}
            allFeed={dashboardData.feed}
            isLoading={isDashboardLoading}
            monthLabel={cycleMonthLabel}
            daysInMonth={cycleDaysInMonth}
          />
        )}

        {currentTab === 'records' && (
          <RecordsTab 
            language={language}
            cycleFilter={cycleFilter}
            setCycleFilter={setCycleFilter}
            selectedCycleId={selectedCycleId}
            setSelectedCycleId={setSelectedCycleId}
            filteredCycles={filteredCycles}
            cycles={dashboardData.cycles}
            feed={dashboardData.feed}
            isLoading={isDashboardLoading}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab 
            user={user}
            language={language}
            handleLogout={handleLogout}
          />
        )}

      </main>

      {/* DOCKED BOTTOM NAVIGATION WITH ELEVATED OCR SCAN BUTTON */}
      <BottomNav 
        language={language}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        handleSaveReceipt={handleSaveReceipt}
      />
    </div>
  );
}
