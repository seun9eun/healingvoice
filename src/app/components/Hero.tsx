import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import { getDeadlineDate } from "../constants/deadline";

const imgBg = "/images/hero/healing%20voice%20logo_bg_ko_v1.jpg"; //배경(국/영문 공통, PC)
const imgBgMobile = "/images/hero/healing%20voice%20logo_bg_mo_ko_v1.jpg"; //배경(국/영문 공통, 모바일)
const img_tag = "/images/hero/%ED%90%81%EB%8B%B9%205%EC%A3%BC%EB%85%84%20%ED%8A%B9%EB%B3%84%20%EA%B8%B0%ED%9A%8D.png"; //퐁당 5주년 특별기획 (다크 배경용 라이트 버전)
const img_tag_en = "/images/hero/fondant%205th%20Aniversary_en_v1.png"; //fondant 5th Anniversary (다크 배경용 라이트 버전, 영문)
const imgSubtitleEn = "/images/hero/en/healingvoice_subTle_en.png"; //K-CCM 글로벌 오디션 자리의 서브타이틀(영문)
const imgBroadcastBtnEn = "/images/hero/en/healingvoice_btn_en.png"; //첫 방송 안내 버튼(영문)
const imgBadge = "/images/hero/K-ccm%20%EA%B8%80%EB%A1%9C%EB%B2%8C%20%EC%98%A4%EB%94%94%EC%85%98.png"; //K-CCM 글로벌 오디션 뱃지
const imgBroadcastBtn = "/images/hero/%ED%9E%90%EB%A7%81%EB%B3%B4%EC%9D%B4%EC%8A%A4_%EB%B2%84%ED%8A%BC.png"; //26년 9월 첫 방송 버튼(국문 전용)
const imgLogoKo = "/images/hero/healing%20voice%20logo_final_ko.png"; //힐링보이스 통합 로고(국문)
const imgLogoEn = "/images/hero/healing%20voice%20logo_final_en_trimmed.png"; //힐링보이스 통합 로고(영문, 여백 트림)

export function Hero() {
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

  return (
    <section
      id="intro"
      // 모바일도 PC와 동일하게 뷰포트 "높이"가 아닌 배경 이미지 비율(aspect-ratio)로 섹션 높이를 고정.
      // vh/dvh/svh는 전부 브라우저 툴바 표시 상태에 영향을 받아 카카오 웹뷰 등에서 흔들리지만,
      // aspect-ratio는 화면 폭에만 비례하므로 툴바 유무·스크롤과 무관하게 항상 안정적임.
      className="relative aspect-[780/1552] mt-16 md:aspect-[1920/1200] flex items-end justify-center md:items-center overflow-hidden"
    >
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-[#FEFBEB]" />

      {/* 하늘/풀밭 일러스트 배경 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={imgBgMobile}
          alt=""
          className="md:hidden absolute inset-0 w-full h-full object-cover object-top"
        />
        <img
          src={imgBg}
          alt=""
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-[10.2564vw] text-center pt-[28.7179vw] pb-[36.9231vw] md:absolute md:w-[45vw] md:max-w-none md:mx-0 md:px-[2.0833vw] md:pt-0 md:pb-0 md:left-1/2 md:-translate-x-1/2 md:top-[14.5833vw]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-[10.2564vw] md:gap-10"
        >
          {/* 로고 및 방송 예정 그룹 */}
          <div className="flex flex-col items-center gap-[6.1538vw] md:gap-8">
            {/* 퐁당 5주년 특별 기획 태그 */}
            <div className="flex justify-center">
              {lang === "en" ? (
                <img
                  src={img_tag_en}
                  alt={t("hero.tagline")}
                  className="w-auto h-[6.4103vw] md:h-[1.7099vw] object-contain"
                />
              ) : (
                <img
                  src={img_tag}
                  alt={t("hero.tagline")}
                  className="w-auto h-[12.5641vw] md:h-[3.2292vw] object-contain md:-translate-x-[10px]"
                />
              )}
            </div>

            {/* K-CCM 글로벌 오디션 뱃지 + 힐링보이스 로고 (둘 다 투명 배경이라 살짝 겹치게 배치) */}
            <div className="flex flex-col items-center">
              {lang === "ko" ? (
                <img
                  src={imgBadge}
                  alt="K-CCM 글로벌 오디션"
                  className="w-auto h-[7.1795vw] md:h-[1.9773vw] object-contain relative z-10"
                />
              ) : (
                <img
                  src={imgSubtitleEn}
                  alt="K-CCM Global Audition"
                  className="w-auto h-[4.3077vw] md:h-[1.1864vw] object-contain relative z-10"
                />
              )}

              {/* 힐링보이스 로고 (태그라인 + 메인 로고 통합 이미지) - 원본 비율 그대로, 크롭 없이 표시 (언어별 원본 비율이 달라 높이 기준으로 계산) */}
              {/* 국문 배지는 투명 배경이라 로고와 살짝 겹치게(-mt) 배치하지만, 영문 배지는 불투명 배경이라 겹치면 로고를 가리므로 여백을 둠 */}
              <img
                src={lang === "en" ? imgLogoEn : imgLogoKo}
                alt="Healing Voice"
                className={`w-auto object-contain mx-auto ${lang === "en" ? "mt-[2.0513vw] md:mt-3 h-[22.3077vw] md:h-[6.6135vw]" : "-mt-[2.0513vw] md:-mt-3 h-[31.7949vw] md:h-[9.5568vw]"}`}
              />
            </div>

            {/* 첫 방송 안내 버튼 */}
            {lang === "ko" ? (
              <img
                src={imgBroadcastBtn}
                alt="9월 20일 첫 방송"
                className="w-auto h-[13.3333vw] md:h-[3.6458vw] object-contain"
              />
            ) : (
              <img
                src={imgBroadcastBtnEn}
                alt="First Broadcast: Sep 20, 2026"
                className="w-auto h-[13.3333vw] md:h-[3.6458vw] object-contain"
              />
            )}
          </div>

          {/* CTA 버튼 */}
          {!isClosed && (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full px-4 md:px-0">
              <button
                onClick={() =>
                  document
                    .getElementById("steps")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto min-w-[180px] md:min-w-[200px] bg-[#00a6f4] hover:bg-[#0095e0] text-white font-bold text-[15px] md:text-lg px-6 py-3.5 md:py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.4)] whitespace-nowrap"
              >
                {t("hero.downloadBtn")}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}