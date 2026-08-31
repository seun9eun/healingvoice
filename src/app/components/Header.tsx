import { Link } from "react-router";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 힐링보이스 통합 로고 (Figma Header 스펙, 2026-08-27 슬랙 답변 기준)
const logoSrc = "/images/header/healingvoice_logo.png";
const logoSrcEn = "/images/header/healingvoice_logo_en.png"; // 2026-08-31 Figma EN 페이지 답변 — 국문과 다른 파일(182x40)
const FONDANT_URL = "https://www.fondant.kr";

function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 md:gap-[0.2083vw] px-3 py-1.5 md:px-[0.625vw] md:py-[0.4167vw] rounded-full border-2 border-[#E8E8E8] text-white font-bold text-xs md:text-[0.7292vw] leading-none md:leading-[1.0417vw] hover:border-white transition-colors whitespace-nowrap"
    >
      <Globe className="w-3.5 h-3.5 md:w-[0.8333vw] md:h-[0.8333vw]" strokeWidth={1.5} />
      <span>{lang === "ko" ? "EN" : "KO"}</span>
    </button>
  );
}

export function Header() {
  const { t, lang } = useLanguage();

  // 데스크탑 GNB 앵커 대상. "소개(about)" 앵커 대상 섹션은 기획 확인 중 — 우선 Big Text 섹션(id="about")로 가정.
  const navItems = [
    { label: t("header.nav.about"), id: "#about" },
    { label: t("header.nav.cast"), id: "#cast" },
    { label: t("awards"), id: "#awards" },
  ];

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(18,24,45,0.1)] backdrop-blur-[24px] md:py-[0.8333vw]">
      <div className="flex items-center justify-between h-16 px-4 md:h-[3.3333vw] md:max-w-[80vw] md:mx-auto md:px-[0.8333vw]">
        {/* 로고 */}
        <Link to="/" onClick={scrollToTop} className="flex items-center shrink-0">
          <img
            src={lang === "ko" ? logoSrc : logoSrcEn}
            alt="Healing Voice"
            className="h-8 md:h-[2.1875vw] w-auto object-contain"
          />
        </Link>

        {/* 데스크탑 내비게이션 (md 이상, 768px~) */}
        <nav className="hidden md:flex items-center gap-[1.6667vw]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white font-bold text-[0.9375vw] leading-[1.4063vw] hover:text-[#8890FC] transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}

          <LanguageSwitcher />

          <a
            href={FONDANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-[1.4583vw] py-[0.625vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-white font-bold text-[0.8333vw] leading-[1.25vw] whitespace-nowrap transition-colors"
          >
            {t("header.cta")}
          </a>
        </nav>

        {/* 모바일(768px 미만) — 별도 모바일 기획 전까지 텍스트 내비 없이 언어토글+CTA만 노출 */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <a
            href={FONDANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 rounded-full bg-[#6276FB] text-white font-bold text-sm whitespace-nowrap"
          >
            {t("header.cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
