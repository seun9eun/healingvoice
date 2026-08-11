import { Link } from "react-router";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getDeadlineDate } from "../constants/deadline";
import { useEffect } from "react";

// 힐링보이스 로고 - 헤더 전용 국문 파일 / 영문은 Hero 섹션과 동일 파일 사용
const logoImageKo = "/images/hero/healing%20voice%20logo_final_ko_header.png";
const logoImageEn = "/images/hero/healing%20voice%20logo_final_en_trimmed.png";

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className={`flex items-center gap-1 font-bold text-[#101828] hover:text-[#44a9ff] transition-colors border-2 border-[#e8e8e8] hover:border-[#44a9ff] rounded-full px-3 py-1.5 md:py-2 text-xs md:text-sm whitespace-nowrap ${className}`}
    >
      <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
      <span>{lang === "ko" ? "EN" : "KO"}</span>
    </button>
  );
}

export function Header() {
  const { t, lang } = useLanguage();
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const checkDeadline = () => {
      const deadline = new Date(getDeadlineDate()).getTime();
      setIsClosed(Date.now() >= deadline);
    };
    checkDeadline();
    const timer = setInterval(checkDeadline, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#d2e8fb]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          <img
            src={lang === "en" ? logoImageEn : logoImageKo}
            alt="Healing Voice"
            // 영문 로고는 모바일 GNB에서만 25% 축소(w-[100.5px] h-[30px]), md 이상에서는 원래 크기로 복귀
            className={`object-contain ${lang === "en" ? "w-[100.5px] h-[30px] md:w-[134px] md:h-[40px]" : "w-[134px] h-[40px]"}`}
            // 국문 로고 PNG는 상단에만 투명 여백이 있어(하단은 0) 그대로 두면 아래로 치우쳐 보임 - 시각적 중앙 정렬 보정
            style={lang === "en" ? undefined : { transform: "translateY(-5.7px)" }}
          />
        </Link>

        {/* 우측 영역: 언어 토글 + 퐁당 바로가기 (데스크탑/모바일 공통) */}
        <div className="flex items-center gap-3 md:gap-8">
          {/* 언어 토글 버튼 */}
          <LanguageSwitcher />

          {/* 지원하기 / 퐁당 바로가기 버튼 */}
          <button
            onClick={() => {
              if (isClosed) {
                window.open("https://www.fondant.kr", "_blank");
              } else {
                scrollToSection("#steps");
              }
            }}
            className={`${isClosed ? "bg-[#6a71f0] hover:bg-[#5b63eb]" : "bg-[#44a9ff] hover:bg-[#2f94f0]"} text-white font-bold px-4 py-2 md:px-7 md:py-3 rounded-full transition-colors whitespace-nowrap shadow-sm text-[14px] md:text-[16px]`}
          >
            {isClosed ? (lang === 'ko' ? "퐁당 바로가기" : "Go to Fondant") : t("apply")}
          </button>
        </div>
      </div>
    </header>
  );
}
