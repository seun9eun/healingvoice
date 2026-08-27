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
      className="relative w-full flex flex-col items-center gap-2 md:gap-[0.5208vw] overflow-hidden pt-16 pb-20 md:pt-[8.3333vw] md:pb-[10.4167vw] bg-[linear-gradient(180deg,#141F45_0%,rgba(20,31,69,0)_100%)]"
    >
      <div className="flex items-center justify-center rounded-2xl md:rounded-[0.8333vw] px-4 md:px-[0.8333vw]">
        <p
          className="text-2xl md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
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
          &lt;{lang === "ko" ? "힐링보이스" : "Healing Voice"}&gt;
        </p>
      </div>

      <div className="flex items-center justify-center pt-10 md:pt-[6.25vw] px-4">
        <p className="w-full max-w-[688px] md:w-[35.8333vw] text-lg md:text-[1.6667vw] leading-[1.4] text-center font-bold text-[#BDD8FF]">
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
