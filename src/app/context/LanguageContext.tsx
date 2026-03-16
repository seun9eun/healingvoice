import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { translations } from "../translations";

type Language = "ko" | "en";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { lang: paramLang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const routeLang = (paramLang === "en" || paramLang === "ko") ? paramLang : undefined;

  const [lang, setLang] = useState<Language>(routeLang || "ko");

  useEffect(() => {
    // URL에 언어 코드가 없거나 (예: /, /notice 등) 잘못된 경우
    if (!routeLang) {
      const browserLang = navigator.language.startsWith("ko") ? "ko" : "en";
      
      const currentPath = location.pathname;
      const newPath = `/${browserLang}${currentPath === "/" ? "" : currentPath}`;
      
      navigate(newPath + location.search + location.hash, { replace: true });
      setLang(browserLang);
    } else {
      setLang(routeLang as Language);
    }
  }, [routeLang, navigate, location.pathname, location.search, location.hash]);

  const toggleLang = () => {
    const newLang = lang === "ko" ? "en" : "ko";
    
    // 현재 경로를 '/' 로 나눈 후, 첫 번째 세그먼트가 'ko'나 'en' 이면 새 언어로 교체합니다.
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'ko' || pathSegments[0] === 'en') {
      pathSegments[0] = newLang;
    } else {
      pathSegments.unshift(newLang);
    }
    
    const newPath = `/${pathSegments.join('/')}${location.search}${location.hash}`;
    navigate(newPath, { replace: true });
    setLang(newLang);
  };

  const t = (path: string) => {
    const result = path.split('.').reduce((obj, key) => {
      return obj !== undefined && obj !== null ? obj[key] : undefined;
    }, translations[lang] as any);

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