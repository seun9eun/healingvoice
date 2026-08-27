import { useLanguage } from "../context/LanguageContext";

// 시상내역(Awards) 섹션 아이콘 (Figma 답변, 2026-08-27)
const iconTrophy = "/images/awards/icon_trophy.svg";
const iconRelease = "/images/awards/icon_release.svg";
const iconConcert = "/images/awards/icon_concert.svg";
const iconBroadcast = "/images/awards/icon_broadcast.svg";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
const bigBoxGradient = "linear-gradient(180deg, #4E80F1 0%, #83A1FA 100%)";
const smallBoxGradient = "linear-gradient(180deg, #A3CDFF 0%, #E8F3FF 100%)";

function PrizeCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div
      className="relative flex-1 min-w-[260px] overflow-hidden rounded-[32px] md:rounded-[2.5vw] p-6 md:p-0 md:pt-[2.0833vw] md:px-[1.6667vw] flex flex-col items-center gap-8 md:gap-[2.5vw]"
      style={{ backgroundImage: smallBoxGradient }}
    >
      <div className="flex w-full flex-col items-center gap-2 md:gap-[0.4167vw] text-center">
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
      <div className="flex items-center justify-center w-20 h-20 md:w-[6.25vw] md:h-[6.25vw] rounded-full p-4 md:p-[1.25vw] self-end">
        <img src={icon} alt="" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export function Awards() {
  const { t } = useLanguage();

  return (
    <section
      id="awards"
      className="w-full flex flex-col items-center gap-16 md:gap-[3.3333vw] py-16 md:py-[6.25vw] px-4"
    >
      <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#4D94FF] font-bold tracking-[1.6px] text-sm md:text-[0.8333vw]">
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
                className="text-3xl md:text-[2.5vw] leading-[1.2] font-extrabold text-[#101828]"
                style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("awardsSection.grandPrizeAmount")}
              </p>
            </div>
            <img src={iconTrophy} alt="" className="w-28 h-28 md:w-[10.4167vw] md:h-[10.4167vw] object-contain shrink-0" />
          </div>
        </div>

        {/* 부상 3종 */}
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-[1.25vw]">
          <PrizeCard title={t("awardsSection.item1Title")} desc={t("awardsSection.item1Desc")} icon={iconRelease} />
          <PrizeCard title={t("awardsSection.item2Title")} desc={t("awardsSection.item2Desc")} icon={iconConcert} />
          <PrizeCard title={t("awardsSection.item3Title")} desc={t("awardsSection.item3Desc")} icon={iconBroadcast} />
        </div>
      </div>
    </section>
  );
}
