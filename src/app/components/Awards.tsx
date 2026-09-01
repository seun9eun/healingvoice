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
// 영문 모바일 전용 아이콘(2026-09-01 확인) — 데스크탑용과 별도 SVG(색상 #17bab5/#6ad6ea)
const iconReleaseEnMobile = "/images/awards/icon_release_en.svg";
const iconConcertEnMobile = "/images/awards/icon_concert_en.svg";
const iconBroadcastEnMobile = "/images/awards/icon_broadcast_en.svg";

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
      className="relative flex-1 min-w-[260px] overflow-hidden rounded-[8.2051vw] md:rounded-[2.5vw] md:aspect-[325.33/338] p-[6.1538vw] md:p-[1.6667vw] flex flex-col items-start justify-between border-[3px] border-transparent"
      style={{
        backgroundImage: `linear-gradient(90deg, #A3CDFF 0%, #E8F3FF 100%), ${cardBorderGradient}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="flex w-full flex-col items-start gap-[0.5128vw] md:gap-[0.4167vw] text-left">
        <p
          className="text-[5.1282vw] md:text-[1.4583vw] leading-[1.2] font-extrabold uppercase text-[#062259]"
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
        <p className="text-[3.5897vw] md:text-[1.0417vw] leading-[1.2] tracking-normal font-normal text-[#062259] md:whitespace-nowrap">
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

// 국문 모바일 부상 3종 카드 — 기존 데스크탑용 통합 SVG는 카드 종횡비(325.33:289)가
// 모바일 스펙 비율(358:260)과 달라 그대로 늘리면 세로로 17%가량 더 길어지고, 그만큼
// 텍스트/아이콘 위치·비율이 스펙과 어긋남(2026-09-01 확인). 모바일 전용으로 실제
// 텍스트+아이콘을 따로 배치하는 HTML 카드를 구성(아이콘은 EN용으로 이미 추출된 것 재사용)
function PrizeCardKoMobile({
  title,
  desc,
  icon,
  iconStyle,
  dimDesc,
  titleSize,
  titleNowrap,
}: {
  title: string;
  desc: string;
  icon: string;
  // bottom 앵커는 카드 높이가 스펙(HUG로 늘어난 카드)과 실제 렌더(min-h로 고정) 사이에 차이가 있으면
  // 텍스트와 겹치므로, 텍스트 길이가 긴 카드는 top으로 앵커(카드 상단 기준 절대 위치)해서 이 문제를 피함
  iconStyle: { w: string; h: string; right: string; bottom?: string; top?: string };
  dimDesc?: boolean; // 영문 스펙: 본문 opacity 0.8(2026-09-01 확인) — 국문은 명시 없어 미적용
  titleSize?: string; // 제목이 길어 기본 크기로는 한 줄에 안 들어가는 카드 전용 축소값(사용자 확인, 2026-09-01)
  titleNowrap?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[12.3077vw] border-2 border-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] pt-[10.2564vw] pr-[8.2051vw] pb-[8.2051vw] pl-[8.2051vw] min-h-[66.6667vw] flex flex-col items-start gap-[2.0513vw]"
      style={{ backgroundImage: "linear-gradient(90deg, #A3CDFF 0%, #E8F3FF 100%)" }}
    >
      <p
        className={`${titleSize ?? "text-[8.2051vw]"} leading-[1.2] font-extrabold text-[#101828] ${titleNowrap ? "whitespace-nowrap" : ""}`}
        style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
      >
        {title}
      </p>
      <p className={`text-[4.6154vw] leading-[7.5vw] font-medium text-[#062259] ${dimDesc ? "opacity-80" : ""}`}>{desc}</p>
      <img
        src={icon}
        alt=""
        className="absolute object-contain"
        style={{
          width: iconStyle.w,
          height: iconStyle.h,
          right: iconStyle.right,
          bottom: iconStyle.bottom,
          top: iconStyle.top,
        }}
      />
    </div>
  );
}

export function Awards() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="awards"
      className="w-full flex flex-col items-center gap-[12.3077vw] md:gap-[3.3333vw] pt-[24.6154vw] pb-[12.3077vw] md:py-[6.25vw] px-[4.1026vw]"
    >
      {/* 고정 px 폭 + vw 비례 텍스트 조합은 초광폭 화면에서 줄바꿈이 깨지므로 md 이상은 전부 vw로 스케일(2026-08-31 확인) */}
      {/* 국문 모바일 스펙 확인(2026-09-01): eyebrow 16px #44a9ff, 제목 40px, 부제 #7d7d7d */}
      {/* 390px 기준 vw 변환(2026-09-01): 840px 미만에서 구조 유지한 채 유동적으로 스케일 */}
      <div className="flex flex-col items-center gap-[4.1026vw] md:gap-[0.8333vw] w-full max-w-[1200px] md:max-w-[62.5vw] text-center">
        <span className="text-[#44A9FF] md:text-[#4D94FF] font-bold uppercase tracking-[1.6px] text-[4.1026vw] md:text-[0.8333vw]">
          {t("awardsSection.eyebrow")}
        </span>
        {lang === "en" ? (
          // 영문 모바일: "Awards" / "& Benefits" 2줄, 행간110%(44px, 2026-09-01 확인)
          <h2
            className="text-[10.2564vw] leading-[11.2821vw] md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text"
            style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            <span className="md:hidden block">Awards</span>
            <span className="md:hidden block">&amp; Benefits</span>
            <span className="hidden md:inline">{t("awardsSection.title")}</span>
          </h2>
        ) : (
          <h2
            className="text-[10.2564vw] leading-[8.9744vw] md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text"
            style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("awardsSection.title")}
          </h2>
        )}
        <p className="max-w-[672px] md:max-w-[35vw] text-[#D4EBFF] text-[4.1026vw] md:text-[1.1094vw] font-normal leading-[1.5]">
          {t("awardsSection.desc")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-[6.1538vw] md:gap-[1.25vw] w-full max-w-[1024px] md:max-w-[53.333vw]">
        {/* 대상(그랜드 프라이즈) — EN은 흰색 그라데이션 테두리(2026-08-31), 국문 모바일은 솔리드 #d3ebff 2px 테두리(2026-09-01 확인) */}
        <div
          className={`relative w-full overflow-hidden rounded-[8.2051vw] md:rounded-[2.5vw] px-[6.1538vw] py-[10.2564vw] md:px-[4.1667vw] md:py-[2.9167vw] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${lang === "en" ? "border-[3px] border-transparent" : "border-2 border-[#D3EBFF]"}`}
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
          <div className="flex flex-col md:flex-row items-center gap-[6.1538vw] md:gap-[1.5625vw]">
            <div className="flex flex-1 flex-col items-center md:items-start gap-[3.0769vw] md:gap-[0.625vw]">
              <span className="w-fit rounded-[2.0513vw] md:rounded-[0.4167vw] bg-white px-[3.0769vw] py-[1.0256vw] md:px-[0.625vw] md:py-[0.2083vw] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] text-[5.1282vw] md:text-[1.25vw] tracking-[-0.1692vw] md:tracking-normal leading-[1.4] md:leading-none font-semibold text-[#0084D1]">
                {t("awardsSection.grandPrizeBadge")}
              </span>
              <p
                className="text-[9.2308vw] leading-[12.3077vw] md:text-[2.5vw] md:leading-[1.2] font-extrabold text-white whitespace-nowrap"
                style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {t("awardsSection.grandPrizeAmount")}
              </p>
            </div>
            <img src={iconTrophy} alt="" className="w-[35.8974vw] h-[35.8974vw] md:w-[10.4167vw] md:h-[10.4167vw] object-contain shrink-0" />
          </div>
        </div>

        {/* 부상 3종 */}
        {lang === "ko" ? (
          <>
            {/* 모바일: 실제 텍스트+아이콘 카드(2026-09-01 스펙) */}
            <div className="flex flex-col md:hidden w-full gap-[6.1538vw]">
              <PrizeCardKoMobile
                title={t("awardsSection.item1Title")}
                desc={t("awardsSection.item1Desc")}
                icon={iconRelease}
                iconStyle={{ w: "16.9231vw", h: "12.8205vw", right: "12.3077vw", bottom: "16.4103vw" }}
              />
              <PrizeCardKoMobile
                title={t("awardsSection.item2Title")}
                desc={t("awardsSection.item2Desc")}
                icon={iconConcert}
                iconStyle={{ w: "15.1282vw", h: "20vw", right: "12.3077vw", bottom: "13.8462vw" }}
              />
              <PrizeCardKoMobile
                title={t("awardsSection.item3Title")}
                desc={t("awardsSection.item3Desc")}
                icon={iconBroadcast}
                iconStyle={{ w: "14.359vw", h: "13.3333vw", right: "13.3333vw", bottom: "15.3846vw" }}
              />
            </div>
            {/* 데스크탑: 기존 확정된 통합 SVG 그대로 사용 */}
            <div className="hidden md:flex w-full gap-[1.25vw]">
              <img src={cardRelease} alt={t("awardsSection.item1Title")} className="flex-1 w-full h-auto rounded-[2.5vw]" />
              <img src={cardConcert} alt={t("awardsSection.item2Title")} className="flex-1 w-full h-auto rounded-[2.5vw]" />
              <img src={cardBroadcast} alt={t("awardsSection.item3Title")} className="flex-1 w-full h-auto rounded-[2.5vw]" />
            </div>
          </>
        ) : (
          <>
            {/* 모바일: 국문과 동일한 HTML 카드 패턴 재사용, 영문 전용 아이콘·자연 줄바꿈 텍스트(2026-09-01 스펙) */}
            <div className="flex flex-col md:hidden w-full gap-[6.1538vw]">
              <PrizeCardKoMobile
                title={t("awardsSection.item1Title")}
                desc={t("awardsSection.item1Desc").replace(/\n/g, " ")}
                icon={iconReleaseEnMobile}
                iconStyle={{ w: "18.4615vw", h: "14vw", right: "12.3077vw", bottom: "9.2487vw" }}
                dimDesc
              />
              <PrizeCardKoMobile
                title={t("awardsSection.item2Title")}
                desc={t("awardsSection.item2Desc").replace(/\n/g, " ")}
                icon={iconConcertEnMobile}
                // 2026-09-01 재확인: 아이콘은 100x100 박스 중앙 정렬, 박스 자체가 카드 우측에서 32px 안쪽
                iconStyle={{ w: "16.1872vw", h: "21.3667vw", right: "12.9321vw", top: "39.6372vw" }}
                dimDesc
                titleSize="text-[7.6923vw]"
                titleNowrap
              />
              <PrizeCardKoMobile
                title={t("awardsSection.item3Title").replace(/\n/g, " ")}
                desc={t("awardsSection.item3Desc").replace(/\n/g, " ")}
                icon={iconBroadcastEnMobile}
                // 2026-09-01 재확인: 카드2와 동일한 박스 위치 기준(디자이너 권장)으로 정렬
                iconStyle={{ w: "16.5385vw", h: "15.4562vw", right: "12.7564vw", top: "42.5282vw" }}
                dimDesc
                titleSize="text-[7.6923vw]"
                titleNowrap
              />
            </div>
            {/* 데스크탑: 기존 확정된 레이아웃 그대로 사용 */}
            <div className="hidden md:flex w-full gap-[1.25vw]">
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
          </>
        )}
      </div>
    </section>
  );
}
