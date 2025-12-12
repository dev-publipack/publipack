import { createContext, useContext, ReactNode } from 'react';
import { translations, type Language } from '../shared/lib/translations';

interface LanguageContextType {
  language: Language;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Set Spanish as default language
  const language: Language = 'es';

  const t = (key: string, replacements?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }
    
    // Get language-specific text
    let text = typeof value === 'object' && value !== null && (language in value)
      ? value[language]
      : key;
    
    // Replace placeholders
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, val]) => {
        text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), val);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}



