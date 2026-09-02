import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { titleGradient } from "../theme";
import { renderLines } from "../lib/text";

// 시상내역(Awards) 섹션. 반응형 단위/모바일-PC 분기 방식은 Cast.tsx 맨 위 주석 참고.
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

// 위→아래가 아니라 왼쪽→오른쪽 그라데이션(2026-08-31 확인). (titleGradient는 여러 섹션 공용 값이라 theme.ts로 이동)
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
          {renderLines(title)}
        </p>
        {/* 20px(1920 기준), 행간 120% — 이전 21.3px/150%는 스펙보다 큼(2026-08-31 확인). 줄바꿈은 지정된 위치에서만 일어나야 하므로 nowrap */}
        <p className="text-[3.5897vw] md:text-[1.0417vw] leading-[1.2] tracking-normal font-normal text-[#062259] md:whitespace-nowrap">
          {renderLines(desc)}
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

// 모바일 부상 3종 카드 — 국문/영문 공용(2026-09-02 컨테이너 쿼리 리팩토링). 기존 데스크탑용 통합 SVG는
// 카드 종횡비(325.33:289)가 모바일 스펙 비율(358:260)과 달라 그대로 늘리면 세로로 17%가량 더 길어지고,
// 텍스트/아이콘 위치·비율이 스펙과 어긋나서(2026-09-01 확인) 모바일 전용 HTML 카드로 별도 구성.
// 예전에는 텍스트·아이콘 크기를 뷰포트 vw로, 아이콘 위치를 absolute+right/bottom(or top)로 하드코딩해서
// 두 가지 문제가 있었음: (1) 태블릿처럼 넓은 폭에서 카드 내부가 한도 없이 커짐 (2) 국문(짧은 1줄)과
// 영문(긴 2줄) 텍스트 길이가 서로 달라 고정 좌표로는 카드마다 top/bottom 앵커를 수동으로 갈라 써야 했음.
// 컨테이너 쿼리(cqw = 이 카드 자신의 렌더 폭 기준 %)로 바꿔서 카드가 실제로 어떤 폭으로 그려지든
// 내부 요소가 항상 같은 비율로 스케일되게 하고, 아이콘은 absolute 좌표 대신 flex(justify-between+self-end)로
// 배치해 텍스트 줄 수와 무관하게 항상 카드 우측 하단에 자동으로 붙도록 함(QA 피드백, 2026-09-02)
function PrizeCardMobile({
  title,
  desc,
  icon,
  iconSize,
  dimDesc,
  titleSize,
  titleNowrap,
}: {
  title: string;
  desc: string;
  icon: string;
  iconSize: { w: string; h: string };
  dimDesc?: boolean; // 영문 스펙: 본문 opacity 0.8(2026-09-01 확인) — 국문은 명시 없어 미적용
  titleSize?: string; // 제목이 길어 기본 크기로는 한 줄에 안 들어가는 카드 전용 축소값(사용자 확인, 2026-09-01)
  titleNowrap?: boolean;
}) {
  return (
    <div
      // [container-type:inline-size] — 아래 cqw 값들이 뷰포트가 아니라 이 카드 자신의 렌더 폭을 기준으로
      // 계산되게 함. min-h는 기존 확정된 390px 기준 clamp 유지(카드 자체 크기는 이미 검증된 값, 2026-09-02)
      className="relative w-full overflow-hidden rounded-[12.3077vw] border-2 border-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] [container-type:inline-size] flex flex-col justify-between gap-[2.0513vw] pt-[10.2564vw] pr-[8.2051vw] pb-[8.2051vw] pl-[8.2051vw] min-h-[clamp(0px,66.6667vw,260px)]"
      style={{ backgroundImage: "linear-gradient(90deg, #A3CDFF 0%, #E8F3FF 100%)" }}
    >
      <div className="flex flex-col items-start gap-[2.0513vw]">
        <p
          className={`${titleSize ?? "text-[8.9385cqw]"} leading-[1.2] font-extrabold text-[#101828] ${titleNowrap ? "whitespace-nowrap" : ""}`}
          style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {title}
        </p>
        <p className={`text-[5.0279cqw] leading-[8.1704cqw] font-medium text-[#062259] ${dimDesc ? "opacity-80" : ""}`}>{desc}</p>
      </div>
      <img
        src={icon}
        alt=""
        className="self-end object-contain"
        style={{ width: iconSize.w, height: iconSize.h }}
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
        {/* 대상(그랜드 프라이즈) — EN은 흰색 그라데이션 테두리(2026-08-31), 국문 모바일은 솔리드 #d3ebff 2px 테두리(2026-09-01 확인) — 카드 전체가 하나의 단위로 떠오름 */}
        <Reveal
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
            {/* 아이콘 크기도 min-h와 같은 이유로 태블릿 폭에서 과도하게 커지던 문제 — 390px 기준값(140px)으로 상한 고정(2026-09-02) */}
            <img src={iconTrophy} alt="" className="w-[clamp(0px,35.8974vw,140px)] h-[clamp(0px,35.8974vw,140px)] md:w-[10.4167vw] md:h-[10.4167vw] object-contain shrink-0" />
          </div>
        </Reveal>

        {/* 부상 3종 */}
        {lang === "ko" ? (
          <>
            {/* 모바일: 실제 텍스트+아이콘 카드(2026-09-01 스펙) — 카드 각각 개별적으로 떠오름 */}
            <div className="flex flex-col md:hidden w-full gap-[6.1538vw]">
              <Reveal delay={0}>
                <PrizeCardMobile
                  title={t("awardsSection.item1Title")}
                  desc={t("awardsSection.item1Desc")}
                  icon={iconRelease}
                  iconSize={{ w: "18.4358cqw", h: "13.9665cqw" }}
                />
              </Reveal>
              <Reveal delay={0.12}>
                <PrizeCardMobile
                  title={t("awardsSection.item2Title")}
                  desc={t("awardsSection.item2Desc")}
                  icon={iconConcert}
                  iconSize={{ w: "16.4804cqw", h: "21.7877cqw" }}
                />
              </Reveal>
              <Reveal delay={0.24}>
                <PrizeCardMobile
                  title={t("awardsSection.item3Title")}
                  desc={t("awardsSection.item3Desc")}
                  icon={iconBroadcast}
                  iconSize={{ w: "15.6425cqw", h: "14.5251cqw" }}
                />
              </Reveal>
            </div>
            {/* 데스크탑: 기존 확정된 통합 SVG 그대로 사용 — SVG 파일 자체의 고정 intrinsic 크기(325.333px)가
                flex item의 기본 min-width:auto로 작용해 태블릿 가로처럼 컨테이너가 좁아지는 폭에서는
                줄어들지 못하고 그랜드프라이즈 카드 우측으로 넘쳐흘렀음 — min-w-0으로 정상적으로 축소되게 함(QA 피드백, 2026-09-02) */}
            <div className="hidden md:flex w-full gap-[1.25vw]">
              <Reveal className="flex-1 min-w-0" delay={0}>
                <img src={cardRelease} alt={t("awardsSection.item1Title")} className="w-full h-auto rounded-[2.5vw]" />
              </Reveal>
              <Reveal className="flex-1 min-w-0" delay={0.12}>
                <img src={cardConcert} alt={t("awardsSection.item2Title")} className="w-full h-auto rounded-[2.5vw]" />
              </Reveal>
              <Reveal className="flex-1 min-w-0" delay={0.24}>
                <img src={cardBroadcast} alt={t("awardsSection.item3Title")} className="w-full h-auto rounded-[2.5vw]" />
              </Reveal>
            </div>
          </>
        ) : (
          <>
            {/* 모바일: 국문과 동일한 HTML 카드 패턴 재사용, 영문 전용 아이콘·자연 줄바꿈 텍스트(2026-09-01 스펙) — 카드 각각 개별적으로 떠오름 */}
            <div className="flex flex-col md:hidden w-full gap-[6.1538vw]">
              <Reveal delay={0}>
                <PrizeCardMobile
                  title={t("awardsSection.item1Title")}
                  desc={t("awardsSection.item1Desc").replace(/\n/g, " ")}
                  icon={iconReleaseEnMobile}
                  iconSize={{ w: "20.1117cqw", h: "15.2514cqw" }}
                  dimDesc
                />
              </Reveal>
              <Reveal delay={0.12}>
                <PrizeCardMobile
                  title={t("awardsSection.item2Title")}
                  desc={t("awardsSection.item2Desc").replace(/\n/g, " ")}
                  icon={iconConcertEnMobile}
                  iconSize={{ w: "17.6331cqw", h: "23.2775cqw" }}
                  dimDesc
                  titleSize="text-[8.3799cqw]"
                  titleNowrap
                />
              </Reveal>
              <Reveal delay={0.24}>
                <PrizeCardMobile
                  title={t("awardsSection.item3Title").replace(/\n/g, " ")}
                  desc={t("awardsSection.item3Desc").replace(/\n/g, " ")}
                  icon={iconBroadcastEnMobile}
                  iconSize={{ w: "18.0168cqw", h: "16.8380cqw" }}
                  dimDesc
                  titleSize="text-[8.3799cqw]"
                  titleNowrap
                />
              </Reveal>
            </div>
            {/* 데스크탑: 기존 확정된 레이아웃 그대로 사용 */}
            <div className="hidden md:flex w-full gap-[1.25vw]">
              <Reveal className="flex-1" delay={0}>
                <PrizeCardEn
                  title={t("awardsSection.item1Title")}
                  desc={t("awardsSection.item1Desc")}
                  icon={iconRelease}
                  iconStyle={{ w: "4.945vw", h: "3.75vw", right: "2.475vw", bottom: "1.406vw" }}
                />
              </Reveal>
              <Reveal className="flex-1" delay={0.12}>
                <PrizeCardEn
                  title={t("awardsSection.item2Title")}
                  desc={t("awardsSection.item2Desc")}
                  icon={iconConcert}
                  iconStyle={{ w: "3.945vw", h: "5.208vw", right: "2.975vw", bottom: "0.677vw" }}
                />
              </Reveal>
              <Reveal className="flex-1" delay={0.24}>
                <PrizeCardEn
                  title={t("awardsSection.item3Title")}
                  desc={t("awardsSection.item3Desc")}
                  icon={iconBroadcast}
                  iconStyle={{ w: "4.031vw", h: "3.768vw", right: "2.932vw", bottom: "1.397vw" }}
                />
              </Reveal>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
