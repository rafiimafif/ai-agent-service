'use client';

import React, { useState } from 'react';

export default function LanguageToggle() {
  // For MVP, we'll just toggle state locally without full route reload
  const [locale, setLocale] = useState('en');

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'id' : 'en';
    setLocale(newLocale);
    // In a full next-intl setup, this would use router.replace(pathname, { locale: newLocale })
    // document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
    // window.location.reload();
  };

  return (
    <button 
      onClick={toggleLocale}
      className="btn btn-ghost btn-sm"
      style={{ fontWeight: 600 }}
    >
      {locale === 'en' ? 'EN / id' : 'ID / en'}
    </button>
  );
}
