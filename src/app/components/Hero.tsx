import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 01_Hero 에셋 (Figma 답변, 2026-08-27)
const heroBg = "/images/hero/hero_bg.jpg";
const logoSrc = "/images/header/healingvoice_logo.png";
const kccmBadge = "/images/hero/hero_badge_kccm_ko.png"; // "K-CCM 글로벌 오디션" — 국문 전용 이미지. 영문판은 이 배지 자체가 없음(Big Text에 텍스트로만 존재, 2026-08-31 확인)
const premiereBadgeKo = "/images/hero/hero_badge_premiere_ko.png"; // "9월 20일 첫 방송" — 국문 전용 이미지. 영문판은 이미지가 아니라 단색 배경(#03133b)+텍스트(2026-08-31 확인)
const heroLogoEn = "/images/hero/hero_logo_en.png"; // 영문판 전용 Hero 워드마크(국문은 기존 헤더 로고 재사용)
// 퐁당 아이콘: Figma에서 받은 벡터 export가 깨진 상태였어서(빈 클리핑 박스), 기존 프로젝트에 있던
// 확정 브랜드 아이콘(퐁당 5주년 특별 기획.png)에서 아이콘 부분만 잘라 재사용
const fondantMark = "/images/hero/hero_fondant_mark.png";
const FONDANT_URL = "https://www.fondant.kr";

const broadcastGradient =
  "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";

export function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="hero"
      className="relative w-full aspect-[1920/1080] min-h-[560px] md:min-h-0 flex items-end justify-center overflow-hidden"
    >
      {/* 배경 사진 + 하단 그라디언트 */}
      <div className="absolute inset-0" aria-hidden>
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,30,73,0)_0%,rgba(6,30,73,0)_42%,#061E49_85%)]" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-[1.6667vw] w-full max-w-[420px] md:max-w-[30.469vw] px-4 pb-8 md:pb-[1.25vw]">
        {/* 태그 + 로고 그룹 */}
        <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw]">
          <div className="flex items-center gap-1.5 md:gap-[0.3813vw]">
            <img src={fondantMark} alt="" className="h-4 w-auto md:h-[2.0255vw]" />
            <p className="text-sm md:text-[1.2703vw] leading-tight md:leading-[1.3339vw] tracking-[-0.05em] text-center text-white font-bold">
              {t("hero.anniversaryTag")}
            </p>
          </div>

          <p className="text-sm md:text-[1.1979vw] leading-tight text-center text-white font-medium">
            {t("hero.taglineLine1")}
          </p>

          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            {lang === "ko" && (
              <img
                src={kccmBadge}
                alt="K-CCM 글로벌 오디션"
                className="w-auto h-6 md:h-[1.7885vw] object-contain"
              />
            )}
            <img
              src={lang === "ko" ? logoSrc : heroLogoEn}
              alt="Healing Voice"
              className={lang === "ko" ? "w-auto h-14 md:h-[8.3167vw] object-contain" : "w-auto h-10 md:h-[5.8vw] object-contain"}
            />
          </div>
        </div>

        {/* 방송 정보 */}
        <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw] w-full">
          {lang === "ko" ? (
            <img
              src={premiereBadgeKo}
              alt={t("hero.premiereFallback")}
              className="w-auto h-9 md:h-[3.6458vw] object-contain"
            />
          ) : (
            <div className="flex items-center justify-center rounded-full bg-[#03133b] px-5 py-2 md:px-[1.5625vw] md:py-[0.625vw]">
              <p className="text-sm md:text-[1.0417vw] leading-tight text-center text-white font-bold whitespace-nowrap">
                {t("hero.premiereFallback")}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 md:gap-[0.625vw]">
            <p
              className="text-base md:text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
              style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
            >
              {t("hero.broadcastInfo1")}
            </p>
            <span className="h-4 w-px md:h-[1.6667vw] md:w-[0.1042vw] bg-[#D4EBFF]" />
            <p
              className="text-base md:text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
              style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
            >
              {t("hero.broadcastInfo2")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={FONDANT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 md:gap-[0.4167vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] px-6 py-3 md:px-[2.5vw] md:py-[1.25vw] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors whitespace-nowrap"
        >
          <span className="text-base md:text-[1.25vw] leading-none text-center font-bold text-white">
            {t("header.cta")}
          </span>
          <ArrowUpRight className="w-4 h-4 md:w-[1.25vw] md:h-[1.25vw] text-white" strokeWidth={3} />
        </a>
      </div>
    </section>
  );
}
