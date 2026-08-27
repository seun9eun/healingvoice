import { useLanguage } from "../context/LanguageContext";

// 시상내역(Awards) 섹션 에셋 (Figma 답변, 2026-08-27)
const iconTrophy = "/images/awards/icon_trophy.svg";
// 부상 3종 카드는 Figma가 내려준 완성 렌더(배경+텍스트+아이콘 통합 SVG)를 국문에서 그대로 사용 — 텍스트가 벡터라 영문 전환이 안 되므로 영문은 별도 레이아웃 사용
const cardRelease = "/images/awards/card_release.svg";
const cardConcert = "/images/awards/card_concert.svg";
const cardBroadcast = "/images/awards/card_broadcast.svg";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
const bigBoxGradient = "linear-gradient(180deg, #4E80F1 0%, #83A1FA 100%)";
const smallBoxGradient = "linear-gradient(180deg, #A3CDFF 0%, #E8F3FF 100%)";

function PrizeCardEn({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="relative flex-1 min-w-[260px] overflow-hidden rounded-[32px] md:rounded-[2.5vw] p-6 md:p-[1.6667vw] flex flex-col items-start gap-8 md:gap-[2.5vw]"
      style={{ backgroundImage: smallBoxGradient }}
    >
      <div className="flex w-full flex-col items-start gap-2 md:gap-[0.4167vw] text-left">
        <p
          className="text-xl md:text-[1.4583vw] leading-[1.2] font-extrabold text-[#062259]"
          style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {title}
        </p>
        <p className="text-sm md:text-[1.1094vw] leading-[1.5] tracking-tight font-medium text-[#062259]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function Awards() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="awards"
      className="w-full flex flex-col items-center gap-16 md:gap-[3.3333vw] py-16 md:py-[6.25vw] px-4"
    >
      <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#4D94FF] font-bold uppercase tracking-[1.6px] text-sm md:text-[0.8333vw]">
          {t("awardsSection.eyebrow")}
        </span>
        <h2
          className="text-3xl md:text-[2.9167vw] leading-tight font-black text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("awards")}
        </h2>
        <p className="max-w-[672px] text-[#D4EBFF] text-base md:text-[1.1094vw] font-semibold leading-[1.5]">
          {t("awardsSection.desc")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 md:gap-[1.25vw] w-full max-w-[1024px]">
        {/* 대상(그랜드 프라이즈) */}
        <div
          className="relative w-full overflow-hidden rounded-[32px] md:rounded-[2.5vw] px-6 py-10 md:px-[4.1667vw] md:py-[2.9167vw] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          style={{ backgroundImage: bigBoxGradient }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-[1.5625vw]">
            <div className="flex flex-1 flex-col items-center md:items-start gap-3 md:gap-[0.625vw]">
              <span className="w-fit rounded-lg md:rounded-[0.4167vw] bg-white px-3 py-1 md:px-[0.625vw] md:py-[0.2083vw] text-lg md:text-[1.25vw] font-semibold text-[#0084D1]">
                {t("awardsSection.grandPrizeBadge")}
              </span>
              <p
                className="text-3xl md:text-[2.5vw] leading-[1.2] font-extrabold text-white"
                style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("awardsSection.grandPrizeAmount")}
              </p>
            </div>
            <img src={iconTrophy} alt="" className="w-28 h-28 md:w-[10.4167vw] md:h-[10.4167vw] object-contain shrink-0" />
          </div>
        </div>

        {/* 부상 3종 */}
        {lang === "ko" ? (
          <div className="flex flex-col md:flex-row w-full gap-6 md:gap-[1.25vw]">
            <img src={cardRelease} alt={t("awardsSection.item1Title")} className="flex-1 w-full h-auto rounded-[32px] md:rounded-[2.5vw]" />
            <img src={cardConcert} alt={t("awardsSection.item2Title")} className="flex-1 w-full h-auto rounded-[32px] md:rounded-[2.5vw]" />
            <img src={cardBroadcast} alt={t("awardsSection.item3Title")} className="flex-1 w-full h-auto rounded-[32px] md:rounded-[2.5vw]" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full gap-6 md:gap-[1.25vw]">
            <PrizeCardEn title={t("awardsSection.item1Title")} desc={t("awardsSection.item1Desc")} />
            <PrizeCardEn title={t("awardsSection.item2Title")} desc={t("awardsSection.item2Desc")} />
            <PrizeCardEn title={t("awardsSection.item3Title")} desc={t("awardsSection.item3Desc")} />
          </div>
        )}
      </div>
    </section>
  );
}
