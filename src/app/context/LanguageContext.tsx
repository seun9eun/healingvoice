// LanguageContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "../translations";

type Language = "ko" | "en";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ko");

  const toggleLang = () => {
    setLang((prev) => (prev === "ko" ? "en" : "ko"));
  };

  const t = (path: string) => {
    // 1. reduce로 객체 탐색
    const result = path.split('.').reduce((obj, key) => {
      return obj !== undefined && obj !== null ? obj[key] : undefined;
    }, translations[lang] as any);

    // 2. || 대신 ?? 를 사용하여 빈 문자열("")도 정상적인 값으로 인식하게 처리
    return result ?? path;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}