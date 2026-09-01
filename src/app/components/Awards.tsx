import { useLanguage } from "../context/LanguageContext";

// 시상내역(Awards) 섹션 에셋 (Figma 답변, 2026-08-27)
const iconTrophy = "/images/awards/icon_trophy.svg";
// 부상 3종 카드는 Figma가 내려준 완성 렌더(배경+텍스트+아이콘 통합 SVG)를 국문에서 그대로 사용 — 텍스트가 벡터라 영문 전환이 안 되므로 영문은 별도 레이아웃 사용
const cardRelease = "/images/awards/card_release.svg";
const cardConcert = "/images/awards/card_concert.svg";
const cardBroadcast = "/images/awards/card_broadcast.svg";
// EN 카드용 아이콘만 별도 추출(국문 통합 SVG에서 아이콘 그룹만 크롭, 2026-08-31) — EN 레이아웃에 누락되어 있던 것을 채움
const iconRelease = "/images/awards/icon_release.svg";
const iconConcert = "/images/awards/icon_concert.svg";
const iconBroadcast = "/images/awards/icon_broadcast.svg";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
// 위→아래가 아니라 왼쪽→오른쪽 그라데이션(2026-08-31 확인)
const bigBoxGradient = "linear-gradient(90deg, #4E80F1 0%, #83A1FA 100%)";

// 부상 3종/대상 카드 공통 테두리: 흰색 반투명 4스톱 선형 그라데이션, 3px (2026-08-31 EN 스펙 확인 — 국문은 기존 확정 상태 유지 위해 EN 전용으로 분리)
const cardBorderGradient =
  "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 35.3%, rgba(255,255,255,0) 64.7%, rgba(255,255,255,0.54) 100%)";

function PrizeCardEn({
  title,
  desc,
  icon,
  iconStyle,
}: {
  title: string;
  desc: string;
  icon: string;
  iconStyle: { w: string; h: string; right: string; bottom: string };
}) {
  return (
    <div
      // 카드 비율 325.33:338(거의 정사각형, 2026-08-31 확인) — aspect-ratio로 실제 렌더 폭에 비례해서 높이 계산
      className="relative flex-1 min-w-[260px] overflow-hidden rounded-[32px] md:rounded-[2.5vw] md:aspect-[325.33/338] p-6 md:p-[1.6667vw] flex flex-col items-start justify-between border-[3px] border-transparent"
      style={{
        backgroundImage: `linear-gradient(90deg, #A3CDFF 0%, #E8F3FF 100%), ${cardBorderGradient}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="flex w-full flex-col items-start gap-2 md:gap-[0.4167vw] text-left">
        <p
          className="text-xl md:text-[1.4583vw] leading-[1.2] font-extrabold uppercase text-[#062259]"
          style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {title.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        {/* 20px(1920 기준), 행간 120% — 이전 21.3px/150%는 스펙보다 큼(2026-08-31 확인). 줄바꿈은 지정된 위치에서만 일어나야 하므로 nowrap */}
        <p className="text-sm md:text-[1.0417vw] leading-[1.2] tracking-normal font-normal text-[#062259] md:whitespace-nowrap">
          {desc.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
      {/* 스펙의 120x120 슬롯값이 실제 아이콘 그래픽 크기와 안 맞아(국문 카드에서 확인) 국문 원본 SVG의 실제 아이콘 크기·여백을 그대로 역산해서 사용(2026-08-31) */}
      <img
        src={icon}
        alt=""
        className="absolute object-contain"
        style={{ width: iconStyle.w, height: iconStyle.h, right: iconStyle.right, bottom: iconStyle.bottom }}
      />
    </div>
  );
}

export function Awards() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="awards"
      className="w-full flex flex-col items-center gap-12 md:gap-[3.3333vw] pt-24 pb-12 md:py-[6.25vw] px-4"
    >
      {/* 고정 px 폭 + vw 비례 텍스트 조합은 초광폭 화면에서 줄바꿈이 깨지므로 md 이상은 전부 vw로 스케일(2026-08-31 확인) */}
      {/* 국문 모바일 스펙 확인(2026-09-01): eyebrow 16px #44a9ff, 제목 40px, 부제 #7d7d7d */}
      <div className="flex flex-col items-center gap-4 md:gap-[0.8333vw] w-full max-w-[1200px] md:max-w-[62.5vw] text-center">
        <span className="text-[#44A9FF] md:text-[#4D94FF] font-bold uppercase tracking-[1.6px] text-base md:text-[0.8333vw]">
          {t("awardsSection.eyebrow")}
        </span>
        <h2
          className="text-[40px] leading-[35px] md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("awardsSection.title")}
        </h2>
        <p className="max-w-[672px] md:max-w-[35vw] text-[#D4EBFF] text-base md:text-[1.1094vw] font-normal leading-[1.5]">
          {t("awardsSection.desc")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 md:gap-[1.25vw] w-full max-w-[1024px] md:max-w-[53.333vw]">
        {/* 대상(그랜드 프라이즈) — EN은 흰색 그라데이션 테두리(2026-08-31), 국문 모바일은 솔리드 #d3ebff 2px 테두리(2026-09-01 확인) */}
        <div
          className={`relative w-full overflow-hidden rounded-[32px] md:rounded-[2.5vw] px-6 py-10 md:px-[4.1667vw] md:py-[2.9167vw] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${lang === "en" ? "border-[3px] border-transparent" : "border-2 border-[#D3EBFF]"}`}
          style={
            lang === "en"
              ? {
                  backgroundImage: `linear-gradient(90deg, #4E80F1 0%, #83A1FA 100%), ${cardBorderGradient}`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }
              : { backgroundImage: bigBoxGradient }
          }
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-[1.5625vw]">
            <div className="flex flex-1 flex-col items-center md:items-start gap-3 md:gap-[0.625vw]">
              <span className="w-fit rounded-lg md:rounded-[0.4167vw] bg-white px-3 py-1 md:px-[0.625vw] md:py-[0.2083vw] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] text-xl md:text-[1.25vw] tracking-[-0.66px] md:tracking-normal leading-[1.4] md:leading-none font-semibold text-[#0084D1]">
                {t("awardsSection.grandPrizeBadge")}
              </span>
              <p
                className="text-[36px] leading-[48px] md:text-[2.5vw] md:leading-[1.2] font-extrabold text-white"
                style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("awardsSection.grandPrizeAmount")}
              </p>
            </div>
            <img src={iconTrophy} alt="" className="w-[140px] h-[140px] md:w-[10.4167vw] md:h-[10.4167vw] object-contain shrink-0" />
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
            <PrizeCardEn
              title={t("awardsSection.item1Title")}
              desc={t("awardsSection.item1Desc")}
              icon={iconRelease}
              iconStyle={{ w: "4.945vw", h: "3.75vw", right: "2.475vw", bottom: "1.406vw" }}
            />
            <PrizeCardEn
              title={t("awardsSection.item2Title")}
              desc={t("awardsSection.item2Desc")}
              icon={iconConcert}
              iconStyle={{ w: "3.945vw", h: "5.208vw", right: "2.975vw", bottom: "0.677vw" }}
            />
            <PrizeCardEn
              title={t("awardsSection.item3Title")}
              desc={t("awardsSection.item3Desc")}
              icon={iconBroadcast}
              iconStyle={{ w: "4.031vw", h: "3.768vw", right: "2.932vw", bottom: "1.397vw" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
