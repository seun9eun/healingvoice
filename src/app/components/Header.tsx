import { Link } from "react-router";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

// 힐링보이스 컬러(파랑) 로고 - 흰 배경에 사용
const logoImage = "https://i.imgur.com/NdVOBXQ.png";
// 힐링보이스 흰색 로고 - 모바일 메뉴(다크) 배경에 사용
const logoImage_w = "https://i.imgur.com/CXq2kw9.png";
const logoImageEn = "https://i.imgur.com/czHtSNl.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, lang, toggleLang } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { key: "intro", href: "#intro" },
    { key: "info.eligibility.title", href: "#info" },
    { key: "awards", href: "#awards" },
    { key: "steps.title", href: "#steps" },
  ];

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
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
          <img src={lang === "en" ? logoImageEn : logoImage} alt="힐링보이스" className="h-[51px] w-auto object-contain" />
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className="font-bold text-[#101828] hover:text-[#44a9ff] transition-colors text-[18px] whitespace-nowrap"
            >
              {t(item.key as any)}
            </button>
          ))}

          {/* 언어 토글 버튼 */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 font-bold text-[#101828] hover:text-[#44a9ff] transition-colors border-2 border-[#e8e8e8] hover:border-[#44a9ff] rounded-full px-3 py-2 text-sm"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === "ko" ? "EN" : "KO"}</span>
          </button>

          {/* 지원하기 버튼 */}
          <button
            onClick={() => scrollToSection("#steps")}
            className="bg-[#44a9ff] hover:bg-[#2f94f0] text-white font-bold px-7 py-3 rounded-full transition-colors whitespace-nowrap shadow-sm text-[16px]"
          >
            {t("apply")}
          </button>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#101828] hover:text-[#44a9ff] transition-colors"
          aria-label="메뉴 열기"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#d2e8fb] overflow-hidden shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-[#101828] hover:text-[#44a9ff] font-bold py-2 text-base transition-colors"
                >
                  {t(item.key as any)}
                </button>
              ))}

              <button
                onClick={toggleLang}
                className="text-left text-[#101828] hover:text-[#44a9ff] font-bold py-2 flex items-center gap-2 text-base transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>{lang === "ko" ? "English" : "한국어"}</span>
              </button>

              <button
                onClick={() => scrollToSection("#steps")}
                className="bg-[#44a9ff] hover:bg-[#2f94f0] text-white font-bold py-3 rounded-full text-center w-full transition-colors text-lg"
              >
                {t("apply")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
