import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Globe, Menu, X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 맨 위에 항상 떠있는(position: fixed) 상단 내비게이션. 반응형 단위/모바일-PC 분기 방식은
// Cast.tsx 맨 위 주석 참고. 모바일에서는 햄버거 버튼을 누르면 전체화면 메뉴 패널이 뜬다
// (menuOpen 상태로 제어, 아래 lockBodyScroll/unlockBodyScroll이 그때 배경 스크롤을 막는 역할).
// 힐링보이스 통합 로고 (Figma Header 스펙, 2026-08-27 슬랙 답변 기준)
const logoSrc = "/images/header/healingvoice_logo.png";
const logoSrcEn = "/images/header/healingvoice_logo_en.png"; // 2026-08-31 Figma EN 페이지 답변 — 국문과 다른 파일(182x40)
const FONDANT_URL = "https://www.fondant.kr";

// variant="light": 모바일 메뉴 패널(흰 배경) 안에서 쓰는 어두운 색 버전. 기본은 데스크탑 헤더용 흰 글자.
function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { lang, toggleLang } = useLanguage();
  const isLight = variant === "light";
  return (
    <button
      onClick={toggleLang}
      className={`flex items-center gap-[1.0256vw] md:gap-[0.2083vw] px-[3.0769vw] py-[1.5385vw] md:px-[0.625vw] md:py-[0.4167vw] rounded-full border-2 font-bold text-[3.0769vw] md:text-[0.7292vw] leading-none md:leading-[1.0417vw] transition-colors whitespace-nowrap ${
        isLight
          ? "border-[#E8E8E8] text-[#062259]"
          : "border-[#E8E8E8] text-white hover:border-white"
      }`}
    >
      <Globe className="w-[3.5897vw] h-[3.5897vw] md:w-[0.8333vw] md:h-[0.8333vw]" strokeWidth={1.5} />
      <span>{lang === "ko" ? "EN" : "KO"}</span>
    </button>
  );
}

export function Header() {
  const { t, lang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // 모바일 메뉴를 열 때 body를 position:fixed로 고정해서 배경 스크롤을 막는다.
  // (overflow:hidden만으로는 모바일 사파리 등에서 러버밴드 스크롤로 배경이 살짝 움직일 수 있음, 2026-09-01 확인)
  // 잠그기 직전의 스크롤 위치(scrollY)를 top 값의 음수로 저장해두고, 풀 때(unlockBodyScroll) 그 값으로 되돌린다.
  const lockBodyScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
  };

  // lockBodyScroll의 반대 동작. 아래 useEffect(메뉴 상태가 바뀔 때 자동 실행)와
  // scrollToSection/scrollToTop(메뉴를 닫으면서 곧바로 스크롤 이동하는 함수) 양쪽에서 공통으로 사용한다.
  // 원래는 두 곳에 완전히 같은 코드가 복붙되어 있었는데, 이 함수 하나로 합쳤다(2026-09-02 리팩토링).
  const unlockBodyScroll = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    if (scrollY) {
      // top이 "-123px" 형태로 저장되어 있으므로 숫자만 뽑아 부호를 반대로 뒤집어 원래 위치로 스크롤 복원
      window.scrollTo(0, -parseInt(scrollY, 10));
    }
  };

  // menuOpen 상태가 true/false로 바뀔 때마다 자동으로 실행된다(React useEffect의 기본 동작).
  // 메뉴를 열면 잠그고, 닫으면 푼다.
  useEffect(() => {
    if (menuOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [menuOpen]);

  // 데스크탑 GNB 앵커 대상. "소개(about)" 앵커 대상 섹션은 기획 확인 중 — 우선 Big Text 섹션(id="about")로 가정.
  const navItems = [
    { label: t("header.nav.about"), id: "#about" },
    { label: t("header.nav.cast"), id: "#cast" },
    { label: t("header.nav.awards"), id: "#awards" },
  ];

  // setMenuOpen(false)의 useEffect 클린업은 다음 렌더 이후에야 실행되므로, body가 잠긴 상태로
  // scrollIntoView가 먼저 호출되면 스크롤이 씹힌다 — 여기서 동기적으로 먼저 풀어준다.
  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    unlockBodyScroll();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    setMenuOpen(false);
    unlockBodyScroll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentLogo = lang === "ko" ? logoSrc : logoSrcEn;

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-[48px] md:py-[0.8333vw] ${
        menuOpen ? "bg-white" : "bg-[rgba(18,24,45,0.1)]"
      }`}
    >
      <div className="flex items-center justify-between h-[16.4103vw] px-[4.1026vw] md:h-[3.3333vw] md:max-w-[80vw] md:mx-auto md:px-[0.8333vw]">
        {/* 로고 */}
        <Link to="/" onClick={scrollToTop} className="flex items-center shrink-0">
          <img src={currentLogo} alt="Healing Voice" className="h-[8.2051vw] md:h-[2.1875vw] w-auto object-contain" />
        </Link>

        {/* 데스크탑 내비게이션 (md 이상, 768px~) */}
        <nav className="hidden md:flex items-center gap-[1.6667vw]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white font-bold text-[0.9375vw] leading-[1.4063vw] uppercase hover:text-[#8890FC] transition-colors whitespace-nowrap"
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

        {/* 모바일(840px 미만) — 닫힌 상태에도 언어 전환 버튼이 햄버거 옆에 항상 같이 보임(2026-09-01 확인, 이전 스펙과 다름) */}
        <div className="flex md:hidden items-center gap-[1.5385vw]">
          {menuOpen ? (
            <>
              <LanguageSwitcher variant="light" />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="메뉴 닫기"
                className="flex items-center justify-center w-[9.2308vw] h-[9.2308vw] rounded-full"
              >
                <X className="w-[6.1538vw] h-[6.1538vw] text-[#062259]" strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="메뉴 열기"
                className="flex items-center justify-center w-[10.2564vw] h-[9.2308vw] rounded-full"
              >
                <Menu className="w-[6.1538vw] h-[6.1538vw] text-white" strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>

    {/* 모바일 메뉴 오버레이 — header 바깥의 형제 요소로 렌더링(header의 backdrop-blur가 새 containing block을
        만들어서 안에 있으면 position:fixed가 뷰포트가 아니라 header 박스 기준으로 계산되는 문제가 있었음).
        헤더(64px) 바로 아래부터 화면 끝까지, 위쪽은 흰 패널(Nav+CTA), 나머지는 dim으로 덮어 모달처럼 배경 스크롤/조작을 막음(2026-08-31 스펙) */}
    {menuOpen && (
      <div className="md:hidden fixed inset-x-0 top-[16.4103vw] bottom-0 z-40 flex flex-col">
        <div className="bg-white flex flex-col gap-[8.2051vw] px-[5.1282vw] pt-[4.1026vw] pb-[8.2051vw]">
          <nav className="flex flex-col gap-[8.2051vw]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-[#062259] font-semibold text-[5.1282vw] leading-[1.2] uppercase"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <a
            href={FONDANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-[2.0513vw] px-[8.2051vw] py-[4.1026vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-white font-bold text-[4.6154vw] transition-colors"
          >
            {t("header.cta")}
            <ArrowUpRight className="w-[5.1282vw] h-[5.1282vw]" strokeWidth={3} />
          </a>
        </div>
        <div className="flex-1 bg-[#061E49]/80" onClick={() => setMenuOpen(false)} aria-hidden />
      </div>
    )}
    </>
  );
}
