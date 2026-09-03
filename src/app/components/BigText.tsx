import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { titleGradient, brandGradient } from "../theme";
import { renderLines } from "../lib/text";

// Hero 다음에 나오는 큰 타이틀 문구 섹션. 반응형 단위/모바일-PC 분기 방식은 Cast.tsx 맨 위 주석 참고.
// 02_Big Text (Figma 답변, 2026-08-27) — 배경/텍스트 전부 CSS로 구현, 이미지 에셋 없음
// (titleGradient/brandGradient는 여러 섹션이 공유하는 값이라 theme.ts로 옮겨졌다. 이 파일에만 있는 glow는 그대로 둠.)
// QA 피드백(2026-09-03 2차): 이 섹션의 장식 글로우에도 원형 테두리 선이 보인다는 지적 —
// PageBackground.tsx와 같은 원인/같은 공식으로 수정(closest-side + 경계에서 알파 0으로 떨어지는 완만한 falloff)
const glow =
  "radial-gradient(circle closest-side, rgba(114,47,246,1) 0%, rgba(114,47,246,0.6) 40%, rgba(114,47,246,0.25) 65%, rgba(114,47,246,0.07) 85%, rgba(114,47,246,0) 100%)";

export function BigText() {
  const { t, lang } = useLanguage();
  const bodyLines = t("bigText.bodyPart2").split("\n");
  const headingPart2 = t("bigText.headingPart2");

  return (
    // 장식용 글로우가 모바일 폭(390px)에서 77.5vw+36.6vw=114vw로 화면 밖까지 튀어나가 페이지 전체에
    // 가로 스크롤을 만들던 문제 — overflow-hidden으로 섹션 안에서만 잘리게 함(2026-09-01 확인)
    <section
      id="about"
      className="relative w-full overflow-hidden flex flex-col items-center gap-[2.0513vw] md:gap-[0.5208vw] pt-[24.6154vw] pb-[24.6154vw] md:pt-[8.3333vw] md:pb-[10.4167vw] bg-[linear-gradient(180deg,#061E49_0%,rgba(6,30,73,0)_100%)]"
    >
      {/* 국문 모바일: 4줄 각각 분리 표시, gap4, 마지막 줄만 다른 그라데이션(2026-09-01 확인) */}
      {lang === "ko" && (
        <Reveal className="flex md:hidden flex-col items-center gap-[1.0256vw] px-[4.1026vw]">
          <p className="text-[7.1795vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {t("bigText.heading")}
          </p>
          <p className="text-[7.1795vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {headingPart2}
          </p>
          <p className="text-[7.1795vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {t("bigText.line2")}
          </p>
          <p className="text-[7.1795vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: brandGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            &lt;힐링보이스&gt;
          </p>
        </Reveal>
      )}

      {/* 영문 모바일: 제목 6줄 각각 분리 표시, gap4, "Healing Voice"만 크기·그라데이션 다름(2026-09-01 확인) */}
      {lang === "en" && (
        <Reveal className="flex md:hidden flex-col items-center gap-[1.0256vw] px-[4.1026vw]">
          <p className="text-[6.1538vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {t("bigText.heading").replace("Special Project:", "").trim()}
          </p>
          <p className="text-[6.1538vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            Special Project:
          </p>
          <p className="text-[6.1538vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {t("bigText.line2")}
          </p>
          <p className="text-[7.1795vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: brandGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            &lt;Healing Voice&gt;
          </p>
          <p className="text-[6.1538vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            {t("bigText.subLine").replace("the world", "").trim()}
          </p>
          <p className="text-[6.1538vw] leading-[1.4] text-center font-black text-transparent bg-clip-text" style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}>
            the world
          </p>
        </Reveal>
      )}

      {/* 데스크탑 타이틀 — 여러 줄이지만 시각적으로 한 덩어리라 하나의 Reveal로 묶어 동시에 등장시킴(2026-09-01 확인) */}
      <Reveal className="hidden md:flex flex-col items-center gap-[0.5208vw] w-full">
        <div className="flex items-center justify-center rounded-[4.1026vw] md:rounded-[0.8333vw] px-[4.1026vw] md:px-[0.8333vw] w-full">
          <p
            className="max-w-full md:max-w-[63.542vw] text-[6.1538vw] md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
            style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("bigText.heading")}{lang === "ko" ? ` ${headingPart2}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-[2.0513vw] md:gap-[0.5208vw] px-[4.1026vw]">
          <p
            className="text-[6.1538vw] md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
            style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("bigText.line2")}
          </p>
          <p
            className="text-[6.1538vw] md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text"
            style={{ backgroundImage: brandGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {lang === "ko" ? "<힐링보이스>" : "<Healing Voice>"}
          </p>
        </div>

        {/* 영문판에만 있는 추가 줄(subLine) — 국문은 빈 문자열이라 렌더링 안 됨 */}
        {t("bigText.subLine") && (
          <p
            // 폭이 딱 텍스트 너비(998px)와 겹쳐 "world"만 다음 줄로 밀려나 4줄이 되는 문제가 있었음(2026-09-01 확인) — 여유 폭 확보
            className="max-w-full md:max-w-[56vw] text-[6.1538vw] md:text-[2.9167vw] leading-[1.4] text-center font-black text-transparent bg-clip-text px-[4.1026vw]"
            style={{ backgroundImage: titleGradient, fontFamily: "Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("bigText.subLine")}
          </p>
        )}
      </Reveal>

      <Reveal className="flex items-center justify-center pt-[20.5128vw] md:pt-[6.25vw] px-[4.1026vw]" delay={0.25}>
        {/* 컨테이너 760px(1920 기준, 2026-08-31 EN 스펙 확인) — 이전 688px는 너무 좁아 마지막 단어가 3번째 줄로 밀림. 모바일 폰트 20px(2026-09-01 확인) */}
        <p className="md:hidden w-full max-w-[176.4103vw] text-[5.1282vw] leading-[1.4] text-center font-bold text-[#BDD8FF]">
          {t("bigText.bodyPart1")}
          {/* 국문 모바일은 3줄(향해 / 전파할 / 전합니다.)로 나뉘어야 함(2026-09-01 확인) */}
          {lang === "ko" && <br />}
          <span className="text-[#7992FB]">{t("bigText.bodyHighlight")}</span>
          {renderLines(t("bigText.bodyPart2"))}
        </p>
        {/* 데스크탑: 국문은 2줄 유지, 영문은 VOICE 다음 줄바꿈 한 번만 두고 나머지는 한 줄로 합쳐 2줄로 표시(2026-09-01 확인) */}
        <p className="hidden md:block w-full max-w-[39.583vw] text-[1.6667vw] leading-[1.4] text-center font-bold text-[#BDD8FF]">
          {t("bigText.bodyPart1")}
          <span className="text-[#7992FB]">{t("bigText.bodyHighlight")}</span>
          {lang === "en" ? (
            // 모바일용 하드 개행(bodyLines)을 다시 한 줄로 합쳐서 PC에서는 자연스럽게 이어지도록 함(2026-09-01 확인)
            <>
              <br />
              {bodyLines.slice(1).join(" ").replace(/\s+/g, " ").trim()}
            </>
          ) : (
            renderLines(t("bigText.bodyPart2"))
          )}
        </p>
      </Reveal>

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
