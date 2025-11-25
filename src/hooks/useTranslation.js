import { useState, useEffect, useCallback } from 'react';

export default function useTranslation() {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const res = await fetch(`/locales/${language}.json`);
      const data = await res.json();
      setTranslations(data);
    };
    fetchTranslations();
  }, [language]);

  const t = useCallback((key, params = {}) => {
    let translation = translations[key] || key;
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    return translation;
  }, [translations]);

  return { language, setLanguage, t };
}
