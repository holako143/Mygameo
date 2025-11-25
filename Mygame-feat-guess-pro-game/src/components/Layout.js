import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function Layout({ children }) {
  const { language } = useContext(LanguageContext);
  return <div className="min-h-screen bg-gray-900 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>{children}</div>;
}