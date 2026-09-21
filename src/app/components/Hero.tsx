import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { titleGradient } from "../theme";

// 첫 화면(맨 위) Hero 섹션. vw 반응형 단위, 모바일/PC 분기, 국문/영문 분기 방식은
// Cast.tsx 맨 위 주석에 공통 설명이 있으니 처음 보는 사람은 그쪽을 먼저 참고할 것.
// 01_Hero 에셋 (Figma 답변, 2026-08-27)
const heroBg = "/images/hero/hero_bg.jpg";
// 모바일은 데스크탑 가로 사진을 그대로 세로로 잘라 쓰고 있어 인물이 과도하게 잘렸음 — 모바일 전용으로 별도 크롭된 사진으로 교체(2026-09-01 확인)
const heroBgMobile = "/images/hero/hero_bg_mobile.jpg";
const logoSrc = "/images/header/healingvoice_logo.png";
const kccmBadge = "/images/hero/hero_badge_kccm_ko.png"; // "K-CCM 글로벌 오디션" — 국문 전용 이미지. 영문판은 이 배지 자체가 없음(Big Text에 텍스트로만 존재, 2026-08-31 확인)
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
const FONDANT_URL = "https://www.fondant.kr";
// 방청 신청 구글폼(2026-09-18 수급)
const AUDIENCE_URL = "https://forms.gle/9WqAaBtEkzAyiTpF6";
// 방청 신청 버튼이 나타나는 시각 — 그 전까지는 버튼 자체를 그리지 않는다.
// videoData.ts의 openTime과 같은 형식으로 +09:00을 명시해 두었기 때문에, 보는 사람 기기의
// 시간대가 무엇이든(해외 시청자 포함) 전 세계에서 동시에 열린다.
const AUDIENCE_OPEN_TIME = "2026-09-20T17:00:00+09:00";

// CTA 버튼 2개가 크기·폰트·그림자를 공유해서 한 곳에 모아둔다(슬랙 스펙 2026-09-18).
// PC: 259x72, padding 세로 24, gap 8, 폰트 24px, 아이콘 24px / 모바일: 143x39, padding 세로 12, gap 6, 폰트 13.5px, 아이콘 15px
// 폭을 고정값으로 주기 때문에 좌우 padding(스펙 PC 48 / 모바일 24)은 따로 두지 않는다.
const CTA_BUTTON_CLASS =
  "flex items-center justify-center gap-[1.5385vw] md:gap-[0.4167vw] rounded-full w-[36.6667vw] md:w-[13.4896vw] py-[3.0769vw] md:py-[1.25vw] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors whitespace-nowrap";
const CTA_LABEL_CLASS = "text-[3.4615vw] md:text-[1.25vw] leading-none text-center font-bold";
const CTA_ICON_CLASS = "w-[3.8462vw] h-[3.8462vw] md:w-[1.25vw] md:h-[1.25vw]";

// 방송 정보("3 PM Pre-release..." 등) 텍스트 색 — theme.ts의 titleGradient와 값이 같아서(2026-09-02 확인)
// 그쪽 값을 그대로 가져와 이 파일 안에서 쓰던 이름을 유지함
const broadcastGradient = titleGradient;

export function Hero() {
  const { t, lang } = useLanguage();

  // 방청 신청 버튼 노출 여부. 공개 시각 전에 페이지를 열어둔 사람도 새로고침 없이 버튼이 나타나도록
  // 공개 시각에 딱 한 번 깨운다(YouTubeEmbed처럼 1초마다 갱신할 필요는 없는 단발성 전환이라).
  // 주의: setTimeout의 지연 상한이 약 24.8일이라, 공개 시각을 그보다 먼 미래로 옮기게 되면
  // 타이머가 즉시 발동해버린다 — 그때는 주기적 갱신 방식으로 바꿔야 한다.
  // ?rqbtn=on 을 붙이면 공개 시각과 무관하게 바로 보인다(deadline.ts의 ?testDeadline=true와 같은 용도).
  const [audienceOpen, setAudienceOpen] = useState(
    () =>
      new URLSearchParams(window.location.search).get("rqbtn") === "on" ||
      Date.now() >= new Date(AUDIENCE_OPEN_TIME).getTime()
  );
  useEffect(() => {
    if (audienceOpen) return;
    const timer = setTimeout(
      () => setAudienceOpen(true),
      new Date(AUDIENCE_OPEN_TIME).getTime() - Date.now()
    );
    return () => clearTimeout(timer);
  }, [audienceOpen]);

  return (
    <section
      id="hero"
      // QA 피드백(2026-09-02): 모바일 첫 화면에서 CTA("퐁당 바로가기") 버튼까지 스크롤 없이 다 보여야 하는데
      // 기존 h-[192.8205vw](390px 기준 752px)에서는 CTA가 728px 지점에 있어 주소창이 보이는 초기 상태의
      // 실제 가시영역(작은 기기 기준 650~700px대)보다 아래에 걸쳐 있었음. 콘텐츠 자체 간격은 그대로 두고
      // 섹션 높이만 줄여서(바닥에 붙어있는 콘텐츠 전체를 위로 당김) 해결 — 사진 하단은 원래도 의도적으로
      // 여유 있게 넘치는 구조라(주석 참고) 더 잘리는 것은 문제없음
      className="relative w-full h-[172.3vw] md:h-auto md:aspect-[1920/1080] flex items-end justify-center overflow-hidden"
    >
      {/* 배경 사진 + 하단 그라디언트 — 모바일은 섹션(752px)보다 사진이 커서(844px) 아래로 92px 넘치는 구조(2026-08-31 모바일 스펙) */}
      {/* QA 피드백(2026-09-03): 인물이 GNB(상단 헤더)와 너무 떨어져 보임 — 사진 원본(780x1688) 상단 약 16.9%(285px)가
          빈 배경(조명)뿐이라 그만큼을 위로 밀어올려(top을 음수로) 시야에서 잘라내고, 인물이 곧바로 GNB 아래에
          붙어 보이도록 함. 컨테이너 높이/이미지 비율은 원본 그대로 유지 — 위치만 이동 */}
      <div className="absolute inset-x-0 top-[-15vw] h-[216.4103vw] md:inset-0 md:top-0 md:h-full" aria-hidden>
        <img src={heroBgMobile} alt="" className="absolute inset-0 w-full h-full object-cover md:hidden" />
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover hidden md:block" />
        {/* QA 재재확인(2026-09-02): 28%→35%로 확 앞당긴 수정은 텍스트 가독성은 해결했지만, 캔버스 픽셀
            샘플링 실측 결과 실제 사진(hero_bg_mobile.jpg)은 원래 32~38% 부근이 흰 재킷 때문에 가장 밝고
            (밝기 130대), 이후 자연스럽게 어두워져 54~56% 지점부터는 이미 사진 자체가 순수 배경색(#061E49,
            밝기 37)과 동일해짐 — 그런데 28→35%처럼 7%p 안에 확 어둡게 만들면 사진이 자연스럽게 어두워지는
            느낌이 아니라 그 지점에서 뚝 잘려 배경이 통째로 지워진 것처럼 보임(QA 피드백: "배경을 완전히 지운게
            문제"). 페이드 구간을 22%(손 하트 아래)~54%(사진이 어차피 자연스럽게 배경색과 같아지는 지점)로
            넓혀 실제 사진의 자연스러운 명암 흐름과 겹치는 그라데이션처럼 보이게 하고, 텍스트가 시작되는
            36~39% 구간에서는 여전히 85%+ 불투명도라 가독성은 그대로 유지 */}
        {/* QA 피드백(2026-09-03 2차): 26% 시작도 여전히 일찍 어두워진다는 지적 — 최상위 텍스트("5주년 특별
            기획" 태그, 컨테이너 기준 약 44~46% 지점)의 시작점에만 살짝 걸치도록 페이드 시작을 40%까지 밀되,
            첫 시도(40→48→54, 완만한 램프)는 태그가 램프 중간에 걸려 그라데이션 텍스트 대비가 너무 약해짐
            — 40%까지는 완전 투명 유지하고 44%까지 짧고 가파르게 어두워지도록 압축해 텍스트 구간(44~63%)은
            90%+ 불투명도로 가독성 확보, 그 위 상반신은 그대로 선명하게 드러남 */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,30,73,0)_0%,rgba(6,30,73,0)_40%,rgba(6,30,73,0.9)_44%,#061E49_50%)] md:hidden" />
        {/* PC 오버레이 — Figma fill[1] 실측값(2026-09-09). gradientTransform t=1.6388y-0.6388을 풀면 아래 정지점이 된다.
            모바일은 v6.1에 전용 프레임이 없어 기존 값을 유지한다. */}
        <div className="hidden md:block absolute inset-0 bg-[linear-gradient(180deg,rgba(6,30,73,0)_38.98%,rgba(6,30,73,0.119)_45.08%,#061E49_100%)]" />
      </div>

      {/* 콘텐츠 */}
      {/* 영문 PC 슬랙 정밀 스펙 확인(2026-09-01, node 1374:3969): 텍스트/로고 그룹 - 방송정보 - 버튼 사이 gap 모두 32px(1.6667vw)로 동일 — 기존값이 이미 정확했음 */}
      {/* 영문 PC 컨테이너 폭은 스펙상 827px(=43.0729vw) — 기존 30.469vw는 국문 전용 값이 잘못 공유되고 있었음(2026-09-01 확인, 로고가 스펙보다 오른쪽으로 치우쳐 보이던 원인) */}
      <div className={`relative z-10 flex flex-col items-center gap-[6.1538vw] md:gap-[1.6667vw] w-full max-w-[107.6923vw] ${lang === "en" ? "md:max-w-[43.0729vw]" : "md:max-w-[30.469vw]"} px-[4.1026vw] md:px-4 pb-[6.1538vw] md:pb-[1.25vw]`}>
        {/* 태그 + 로고 그룹 — 영문은 모바일/데스크탑 배치 순서가 달라(모바일: 뱃지→로고→태그라인) 분리 렌더링(2026-08-31 모바일 스펙) */}
        {/* 국문 모바일 실측 스펙 반영(2026-09-01 확인): 뱃지-로고그룹 gap16, 아이콘 24.89px, 로고 115.43px 등 */}
        {/* 영문 모바일 스펙 확인(2026-09-01, node 1374:4707): 뱃지row-로고그룹 gap18.82px(=4.8256vw) — 국문(4.1026vw)과 다름 */}
        <Reveal className={`md:hidden flex flex-col items-center ${lang === "en" ? "gap-[4.8256vw]" : "gap-[4.1026vw]"}`}>
          <div className="flex items-center gap-[1.5385vw]">
            {lang === "en" ? (
              <img src={fondantWordmarkEn} alt="fondant" className="h-[4vw] w-auto object-contain mt-[0.8vw]" />
            ) : (
              <img src={fondantMark} alt="" className="h-[6.3821vw] w-auto" />
            )}
            {lang === "ko" ? (
              <img src={heroAnniversaryTagKo} alt={t("hero.anniversaryTag")} className="h-[4.359vw] w-auto object-contain" />
            ) : (
              // "5th Anniversary Special Project" — Sandoll Nemony2 폰트 없어 이미지 대체(PC용 에셋 재사용, 2026-09-01 확인)
              <img src={heroAnniversaryTagEn} alt={t("hero.anniversaryTag")} className="h-[4vw] w-auto object-contain" />
            )}
          </div>

          {lang === "ko" ? (
            // 로고그룹 전체 높이 117px(스펙) — kccm(19.12)+logo(115.43) 그대로 쌓으면 181px가 되어
            // 음수 마진으로 겹치게 압축(로고 파일 자체의 위쪽 여백 때문으로 추정, 2026-09-01 확인)
            <div className="flex flex-col items-center">
              <img src={kccmBadge} alt="K-CCM 글로벌 오디션" className="w-auto h-[4.9026vw] object-contain" />
              <img src={logoSrc} alt="Healing Voice" className="w-[73.9974vw] h-[29.5974vw] object-contain -mt-[2.8205vw]" />
            </div>
          ) : (
            // "a voice that heals the world" — KoreanHDRIB 폰트 없어 이미지 대체(PC용 에셋 재사용).
            // 스펙상 로고 위쪽과 겹치는 절대배치 구조라 음수 마진으로 근사(2026-09-01 확인)
            <div className="flex flex-col items-center w-full">
              <img src={heroTaglineEn} alt={t("hero.taglineLine1")} className="h-[4vw] w-auto object-contain" />
              {/* 사용자 확인(2026-09-01): 로고가 좌우로 거의 가득 차야 함 — 폭 기준으로 확대. 2·3번째 줄 간격도 확대 요청 반영 */}
              <img src={heroLogoEn} alt="Healing Voice" className="w-full h-auto object-contain mt-[1vw]" />
            </div>
          )}
        </Reveal>

        {/* Figma "Frame 1261159025" 기준: 뱃지row-로고그룹 사이 gap32(2026-08-31 전체 스펙 확인, 2026-09-01 재확인) */}
        {/* 국문은 사용자 확인(2026-09-01)으로 간격 축소 유지 */}
        <Reveal className={`hidden md:flex flex-col items-center ${lang === "en" ? "gap-[1.6667vw]" : "gap-[0.9vw]"}`}>
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

          {/* Figma "logo" 프레임: 태그라인(y612)과 로고 이미지(y646.55)가 겹쳐 배치된 절대배치라 실측 gap은 약 8.55px(2026-08-31 확인, 2026-09-01 재확인) */}
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
            {/* 영문 로고: 슬랙 정밀 스펙 확인(2026-09-01, node 1374:3969) — 실제 높이 148.89px(=7.755vw)가 정확한 크기(오늘 확대 시도는 스펙보다 컸음) */}
            <img
              src={lang === "ko" ? logoSrc : heroLogoEn}
              alt="Healing Voice"
              className={lang === "ko" ? "w-auto h-[8.3167vw] object-contain" : "w-auto h-[7.755vw] object-contain"}
            />
          </div>
        </Reveal>

        {/* 방송 정보 + CTA — 한 그룹으로 묶어 함께 등장(2026-09-01 확인) */}
        <Reveal className="flex flex-col items-center gap-[6.1538vw] md:gap-[1.6667vw] w-full" delay={0.15}>
          {/* 방송 정보 — "9월 20일 첫 방송" 배지는 첫 방송이 끝나 제거함(2026-09-21 사용자 요청).
              배지가 차지하던 자리는 요소를 지우면 그대로 닫히므로 별도 간격 조정은 하지 않았다.
              국문/영문이 같은 구조가 되어(모바일 세로 나열 + 구분선 없음, PC 가로 한 줄 + 구분선)
              언어별로 갈라져 있던 분기를 하나로 합쳤다.
              broadcastInfo1 안의 개행은 모바일(whitespace-pre-line)에서만 줄바꿈으로 살아나고,
              PC(whitespace-nowrap)에서는 공백으로 합쳐진다 — 영문이 모바일에서만 2줄로 쪼개지는 처리다.
              PC의 세로 구분선은 텍스트 "|"가 아니라 Figma의 Rectangle 34(2x32, #d4ebff)를 옮긴 것이다. */}
          <div className="flex flex-col items-center w-full">
            {/* 모바일 — 구분선 없이 세로로 나열.
                한 줄 = 한 <p>여야 한다. 개행이 든 문구를 <p> 하나에 넣고 whitespace-pre-line이나
                <br/>(lib/text.tsx의 renderLines)로 끊으면, 그라데이션 박스가 여러 줄에 걸쳐 한 번만
                칠해져서 첫 줄은 흰색 두번째 줄은 파란색으로 나뉘어 버린다(2026-09-21 지적).
                그래서 개행을 미리 쪼개 줄마다 독립된 <p>로 만들어 각자 그라데이션을 받게 한다. */}
            <div className="md:hidden flex flex-col items-center gap-[1.0256vw]">
              {[...t("hero.broadcastInfo1").split("\n"), t("hero.broadcastInfo2")].map((line, i) => (
                <p
                  key={i}
                  className="text-[5.1282vw] leading-[1.4] text-center font-extrabold text-transparent bg-clip-text whitespace-nowrap"
                  style={{ backgroundImage: broadcastGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* PC — 구분선을 사이에 두고 가로 한 줄 */}
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
          </div>

          {/* CTA — 국문은 버튼 2개(퐁당 바로가기 / 방청 신청), 영문은 방청 신청을 넣지 않기로 확정(2026-09-18) */}
          {/* 슬랙 스펙 확인(2026-09-18, node 1885:845 PC / 1885:1732 모바일):
              두 버튼 크기가 동일(PC 259x72, 모바일 143x39)하게 지정돼 있어 폭을 고정값으로 준다
              — 퐁당 쪽은 HUG인데 결과가 259라 사실상 같은 값이고, 방청 쪽은 FIXED 259다.
              버튼 사이 gap은 PC 32 / 모바일 24 */}
          <div className="flex items-center gap-[6.1538vw] md:gap-[1.6667vw]">
            <a
              href={FONDANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CTA_BUTTON_CLASS} bg-[#6276FB] hover:bg-[#4f5fe0]`}
            >
              <span className={`${CTA_LABEL_CLASS} text-white`}>{t("header.cta")}</span>
              <ArrowUpRight className={`${CTA_ICON_CLASS} text-white`} strokeWidth={3} />
            </a>

            {lang === "ko" && audienceOpen && (
              <a
                href={AUDIENCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CTA_BUTTON_CLASS} bg-white hover:bg-[#e5e7eb]`}
              >
                <span className={`${CTA_LABEL_CLASS} text-[#374151]`}>{t("hero.audienceCta")}</span>
                <ArrowUpRight className={`${CTA_ICON_CLASS} text-black`} strokeWidth={3} />
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
