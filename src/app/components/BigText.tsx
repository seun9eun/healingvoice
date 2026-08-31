import { useLanguage } from "../context/LanguageContext";

// 02_Big Text (Figma 답변, 2026-08-27) — 배경/텍스트 전부 CSS로 구현, 이미지 에셋 없음
const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
const brandGradient = "linear-gradient(180deg, #FFFFFF 0%, #A9A9FF 100%)";
const glow = "radial-gradient(circle, #722FF6 0%, rgba(26,0,255,0) 83.27%)";

export function BigText() {
  const { t, lang } = useLanguage();
  const bodyLines = t("bigText.bodyPart2").split("\n");

  return (
    <section
      id="about"
      className="relative w-full flex flex-col items-center gap-2 md:gap-[0.5208vw] pt-16 pb-20 md:pt-[8.3333vw] md:pb-[10.4167vw] bg-[linear-gradient(180deg,#061E49_0%,rgba(6,30,73,0)_100%)]"
    >
      <div className="flex items-center justify-center rounded-2xl md:rounded-[0.8333vw] px-4 md:px-[0.8333vw] w-full">
        <p
          className="max-w-full md:max-w-[63.542vw] text-2xl md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("bigText.heading")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-[0.5208vw] px-4">
        <p
          className="text-2xl md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("bigText.line2")}
        </p>
        <p
          className="text-2xl md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
          style={{ backgroundImage: brandGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {lang === "ko" ? "<힐링보이스>" : "Healing Voice"}
        </p>
      </div>

      {/* 영문판에만 있는 추가 줄(subLine) — 국문은 빈 문자열이라 렌더링 안 됨 */}
      {t("bigText.subLine") && (
        <p
          // 컨테이너 930px(텍스트 898px + 좌우 padding 16px씩) 기준 — 폭이 좁아질수록 폰트 렌더링 반올림 오차 영향이 커져 1024px 부근에서도 줄바꿈되는 것 확인, 여유를 더 둠(2026-08-31 확인)
          className="max-w-full md:max-w-[52vw] text-2xl md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text px-4"
          style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("bigText.subLine")}
        </p>
      )}

      <div className="flex items-center justify-center pt-10 md:pt-[6.25vw] px-4">
        {/* 컨테이너 760px(1920 기준, 2026-08-31 EN 스펙 확인) — 이전 688px는 너무 좁아 마지막 단어가 3번째 줄로 밀림 */}
        <p className="w-full max-w-[688px] md:max-w-[39.583vw] text-lg md:text-[1.6667vw] leading-[1.4] text-center font-bold text-[#BDD8FF]">
          {t("bigText.bodyPart1")}
          <span className="text-[#7992FB]">{t("bigText.bodyHighlight")}</span>
          {bodyLines[0]}
          <br />
          {bodyLines[1]}
        </p>
      </div>

      {/* 장식 글로우 (Figma glow 레이어, CSS radial-gradient로 재현) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[77.5vw] top-[-2.5vw] size-[36.6146vw] rounded-full opacity-40 mix-blend-screen"
        style={{ backgroundImage: glow }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[92.5521vw] top-[12.5vw] size-[6.5625vw] rounded-full opacity-40 mix-blend-screen"
        style={{ backgroundImage: glow }}
      />
    </section>
  );
}
