import React from 'react';
import { User } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import QRCode from 'react-qr-code';

interface ProfileTabProps {
  user: User;
  language: 'EN' | 'TE';
  handleLogout: () => void;
}

export default function ProfileTab({ user, language, handleLogout }: ProfileTabProps) {
  const { t } = useTranslation(language);
  const shareUrl = "https://dairytrack.netlify.app/";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DairyTrack',
          text: t('profile.share_text'),
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      // Fallback if web share is not supported
      navigator.clipboard.writeText(`${t('profile.share_text')} ${shareUrl}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">{t('profile.title')}</h2>
      <div className="bg-surface-container-lowest border-2 border-outline rounded-xl p-4 tactile-shadow">
        <div className="flex items-center gap-4 border-b-2 border-outline pb-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary flex items-center justify-center border-2 border-outline flex-shrink-0 font-headline-xl text-headline-xl">
            <span className="material-symbols-outlined text-[36px]">person</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md">{user.name}</h3>
            <p className="font-body-md text-on-surface-variant">{t('profile.mobile')}: {user.mobile_number}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-surface-bright p-3 border-2 border-outline rounded-lg">
            <span className="font-label-md">{t('profile.society_name')}</span>
            <span className="font-headline-sm">{user.center_name ? user.center_name : t('profile.no_society_set')}</span>
          </div>
          
          <div className="pt-4 pb-4 border-t-2 border-b-2 border-outline flex flex-col items-center gap-4">
            <div className="bg-white p-2 rounded-xl border-2 border-outline">
              <QRCode value={shareUrl} size={150} />
            </div>
            <button 
              onClick={handleShare}
              className="w-full py-3 bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm rounded-xl border-2 border-outline tactile-shadow flex justify-center items-center gap-2 active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
              {t('profile.share_app')}
            </button>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleLogout} 
              className="w-full py-3 border-2 border-error text-error font-headline-sm text-headline-sm rounded-xl hover:bg-error-container tactile-shadow active:translate-y-1 active:shadow-none transition-all"
            >
              {t('profile.sign_out')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
