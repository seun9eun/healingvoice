import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { translations } from "../translations";

// 이 파일은 사이트 전체의 "지금 어떤 언어(국문/영문)로 보고 있는가"를 관리하는 곳이다.
// 언어는 URL 맨 앞 경로(예: /ko, /en)로 결정되며, 아래 LanguageProvider가 그 값을 읽어서
// React Context로 사이트 전체 컴포넌트에 뿌려준다. 컴포넌트에서는 이 파일 맨 아래의
// useLanguage() 훅 하나만 불러서 { t, lang } 두 가지를 꺼내 쓰면 된다.
//   - lang: 지금 언어("ko" | "en") — 국문/영문 갈림 처리(예: {lang === "ko" ? ... : ...})에 사용
//   - t(path): 실제 화면 문구를 가져오는 함수 — translations.ts 참고

type Language = "ko" | "en";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  // 예: t("hero.broadcastInfo1") 처럼 "."으로 구분된 경로 문자열을 받아서
  // translations.ts 안에서 그 경로에 있는 실제 문구를 찾아 반환한다.
  // translations.ts의 모든 leaf 값은 문자열이므로 반환 타입도 string으로 고정한다
  // (예전엔 any였는데, 그러면 t()가 반환한 값에 .replace()나 .split() 같은 문자열
  // 메서드를 잘못 써도 컴파일 타임에 안 걸러졌음, 2026-09-02 리팩토링).
  t: (path: string) => string;
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

  // "hero.broadcastInfo1" 같은 경로 문자열을 "."으로 쪼개서(["hero", "broadcastInfo1"])
  // translations[lang] 객체 안을 한 단계씩 따라 들어간다(reduce로 반복).
  // 중간에 존재하지 않는 키를 만나면 undefined가 되고, 최종적으로 못 찾으면
  // 화면이 완전히 비는 것보다는 경로 문자열 자체를 보여주는 게 디버깅에 낫기 때문에 path를 그대로 반환한다.
  // (번역 키를 오타냈을 때 "hero.brodcastInfo1" 같은 이상한 문자열이 화면에 그대로 보이면 바로 알아챌 수 있음.)
  const t = (path: string): string => {
    const result = path.split(".").reduce((obj: any, key) => {
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