import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 01_Hero 에셋 (Figma 답변, 2026-08-27)
const heroBg = "/images/hero/hero_bg.jpg";
// 모바일은 데스크탑 가로 사진을 그대로 세로로 잘라 쓰고 있어 인물이 과도하게 잘렸음 — 모바일 전용으로 별도 크롭된 사진으로 교체(2026-09-01 확인)
const heroBgMobile = "/images/hero/hero_bg_mobile.jpg";
const logoSrc = "/images/header/healingvoice_logo.png";
const kccmBadge = "/images/hero/hero_badge_kccm_ko.png"; // "K-CCM 글로벌 오디션" — 국문 전용 이미지. 영문판은 이 배지 자체가 없음(Big Text에 텍스트로만 존재, 2026-08-31 확인)
const premiereBadgeKo = "/images/hero/hero_badge_premiere_ko.png"; // "9월 20일 첫 방송" — 국문 전용 이미지. 영문판은 이미지가 아니라 단색 배경(#03133b)+텍스트(2026-08-31 확인)
const heroLogoEn = "/images/hero/hero_logo_en.png"; // 영문판 전용 Hero 워드마크(국문은 기존 헤더 로고 재사용)
// 퐁당 아이콘: Figma에서 받은 벡터 export가 깨진 상태였어서(빈 클리핑 박스), 기존 프로젝트에 있던
// 확정 브랜드 아이콘(퐁당 5주년 특별 기획.png)에서 아이콘 부분만 잘라 재사용
const fondantMark = "/images/hero/hero_fondant_mark.png";
// 영문판 상단 뱃지: 아이콘+텍스트가 아니라 퐁당 가로형 워드마크 이미지로 대체됨(2026-08-31 확인)
// 이전에 Figma에서 받은 에셋은 아이콘만 잘려 있어서 잘못 적용됐던 것 — 푸터에 이미 있던 정확한 워드마크로 교체(2026-08-31)
const fondantWordmarkEn = "https://i.imgur.com/yZuLvLq.png";
// 영문판 전용: 프로젝트에 없는 폰트(Sandoll Nemony2, KoreanHDRIB, SB Aggro)로 지정된 텍스트 3건은 이미지로 대체(2026-08-31 확인)
const heroAnniversaryTagEn = "/images/hero/hero_anniversary_tag_en.png";
// 국문 모바일 "5주년 특별 기획" — 지정 폰트(Sandoll Nemony2) 없어서 이미지로 대체(2026-09-01 확인)
const heroAnniversaryTagKo = "/images/hero/hero_anniversary_tag_ko.png";
const heroTaglineEn = "/images/hero/hero_tagline_en.png";
const heroPremiereTextEn = "/images/hero/hero_premiere_text_en.png";
const FONDANT_URL = "https://www.fondant.kr";

const broadcastGradient =
  "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";

export function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="hero"
      className="relative w-full h-[752px] md:h-auto md:aspect-[1920/1080] flex items-end justify-center overflow-hidden"
    >
      {/* 배경 사진 + 하단 그라디언트 — 모바일은 섹션(752px)보다 사진이 커서(844px) 아래로 92px 넘치는 구조(2026-08-31 모바일 스펙) */}
      <div className="absolute inset-x-0 top-0 h-[844px] md:inset-0 md:h-full" aria-hidden>
        <img src={heroBgMobile} alt="" className="absolute inset-0 w-full h-full object-cover md:hidden" />
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover hidden md:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,30,73,0)_0%,rgba(6,30,73,0)_42%,#061E49_85%)]" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-[1.6667vw] w-full max-w-[420px] md:max-w-[30.469vw] px-4 pb-6 md:pb-[1.25vw]">
        {/* 태그 + 로고 그룹 — 영문은 모바일/데스크탑 배치 순서가 달라(모바일: 뱃지→로고→태그라인) 분리 렌더링(2026-08-31 모바일 스펙) */}
        {/* 국문 모바일 실측 스펙 반영(2026-09-01 확인): 뱃지-로고그룹 gap16, 아이콘 24.89px, 로고 115.43px 등 */}
        <div className="md:hidden flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5">
            {lang === "en" ? (
              <img src={fondantWordmarkEn} alt="fondant" className="h-4 w-auto object-contain" />
            ) : (
              <img src={fondantMark} alt="" className="h-[24.89px] w-auto" />
            )}
            {lang === "ko" ? (
              <img src={heroAnniversaryTagKo} alt={t("hero.anniversaryTag")} className="h-[17px] w-auto object-contain" />
            ) : (
              <p className="text-[15.61px] leading-[16.39px] tracking-[-0.05em] text-center text-white font-normal">
                {t("hero.anniversaryTag")}
              </p>
            )}
          </div>

          {lang === "ko" ? (
            // 로고그룹 전체 높이 117px(스펙) — kccm(19.12)+logo(115.43) 그대로 쌓으면 181px가 되어
            // 음수 마진으로 겹치게 압축(로고 파일 자체의 위쪽 여백 때문으로 추정, 2026-09-01 확인)
            <div className="flex flex-col items-center">
              <img src={kccmBadge} alt="K-CCM 글로벌 오디션" className="w-auto h-[19.12px] object-contain" />
              <img src={logoSrc} alt="Healing Voice" className="w-[288.59px] h-[115.43px] object-contain -mt-[11px]" />
            </div>
          ) : (
            <>
              <img src={heroLogoEn} alt="Healing Voice" className="w-auto h-10 object-contain" />
              <p className="text-sm leading-tight text-center text-white font-medium">{t("hero.taglineLine1")}</p>
            </>
          )}
        </div>

        {/* Figma "Frame 1261159025" 기준: 뱃지row-로고그룹 사이 gap32(2026-08-31 전체 스펙 확인) */}
        <div className="hidden md:flex flex-col items-center gap-[1.6667vw]">
          <div className="flex items-center gap-[0.3813vw]">
            {lang === "en" ? (
              <img src={fondantWordmarkEn} alt="fondant" className="h-[1.4583vw] w-auto object-contain" />
            ) : (
              <img src={fondantMark} alt="" className="h-[2.0255vw] w-auto" />
            )}
            {lang === "en" ? (
              <img src={heroAnniversaryTagEn} alt={t("hero.anniversaryTag")} className="h-[1.3542vw] w-auto object-contain" />
            ) : (
              <p className="text-[1.2703vw] leading-[1.3339vw] tracking-[-0.05em] text-center text-white font-normal">
                {t("hero.anniversaryTag")}
              </p>
            )}
          </div>

          {/* Figma "logo" 프레임: 태그라인(y612)과 로고 이미지(y646.55)가 겹쳐 배치된 절대배치라 실측 gap은 약 8.55px(2026-08-31 확인) */}
          <div className="flex flex-col items-center gap-[0.4453vw]">
            {/* '세상을 치유하는 목소리' 태그라인은 국문 PC 최신 기획에서 삭제됨(2026-08-31 확인). 영문은 유지, 이미지로 대체(KoreanHDRIB 폰트 없음, 2026-08-31) */}
            {lang === "en" && (
              <img src={heroTaglineEn} alt={t("hero.taglineLine1")} className="h-[1.319vw] w-auto object-contain" />
            )}

            {lang === "ko" && (
              <img
                src={kccmBadge}
                alt="K-CCM 글로벌 오디션"
                className="w-auto h-[1.7885vw] object-contain"
              />
            )}
            <img
              src={lang === "ko" ? logoSrc : heroLogoEn}
              alt="Healing Voice"
              className={lang === "ko" ? "w-auto h-[8.3167vw] object-contain" : "w-auto h-[7.755vw] object-contain"}
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
            // 배지 테두리: linear-gradient(#D2DFFF 1.16% → #89A3FF 100%, 135deg) 2px INSIDE — background-clip 이중 배경으로 구현(2026-08-31 확인)
            // 텍스트 지정 폰트(SB Aggro Bold)는 프로젝트에 없어 기본 서체로 대체
            <div
              className="flex items-center justify-center rounded-2xl md:rounded-[0.8333vw] px-5 py-3 md:px-[1.25vw] md:py-[0.8333vw] border-2 border-transparent"
              style={{
                backgroundImage: "linear-gradient(#03133b, #03133b), linear-gradient(135deg, #D2DFFF 1.16%, #89A3FF 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {/* SB Aggro 폰트가 없어 이미지로 대체(2026-08-31 확인) — 모바일은 기존 텍스트 유지 */}
              <img src={heroPremiereTextEn} alt={t("hero.premiereFallback")} className="hidden md:block md:h-[1.493vw] w-auto object-contain" />
              <p className="md:hidden text-base leading-none text-center text-white font-bold whitespace-nowrap">
                {t("hero.premiereFallback")}
              </p>
            </div>
          )}
          {lang === "en" ? (
            <>
              {/* 영문 모바일: 구분선 없이 2줄 세로 배치(2026-08-31 모바일 스펙) */}
              <div className="md:hidden flex flex-col items-center gap-1">
                <p
                  className="text-base leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                  style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
                >
                  {t("hero.broadcastInfo1")}
                </p>
                <p
                  className="text-base leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                  style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
                >
                  {t("hero.broadcastInfo2")}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-[0.625vw]">
                <p
                  className="text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                  style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
                >
                  {t("hero.broadcastInfo1")}
                </p>
                <span className="h-[1.6667vw] w-[0.1042vw] bg-[#D4EBFF]" />
                <p
                  className="text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                  style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
                >
                  {t("hero.broadcastInfo2")}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-[0.625vw]">
              <p
                className="text-xl md:text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("hero.broadcastInfo1")}
              </p>
              <span className="h-4 w-px md:h-[1.6667vw] md:w-[0.1042vw] bg-[#D4EBFF]" />
              <p
                className="text-xl md:text-[1.6667vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("hero.broadcastInfo2")}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={FONDANT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 md:gap-[0.4167vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] px-8 py-4 md:px-[2.5vw] md:py-[1.25vw] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors whitespace-nowrap"
        >
          <span className="text-lg md:text-[1.25vw] leading-none text-center font-bold text-white">
            {t("header.cta")}
          </span>
          <ArrowUpRight className="w-5 h-5 md:w-[1.25vw] md:h-[1.25vw] text-white" strokeWidth={3} />
        </a>
      </div>
    </section>
  );
}
