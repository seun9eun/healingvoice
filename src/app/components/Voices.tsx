import { useLanguage } from "../context/LanguageContext";
import { VOICES_DATA } from "../data/voicesData";
import { Reveal } from "./Reveal";
import { titleGradient } from "../theme";

// 보이스(Voices) 섹션 — 참가자 32인을 8행 x 4열 카드 그리드로 보여준다.
// 반응형 단위(vw) 규칙과 모바일/PC 분기 방식은 Cast.tsx 맨 위 주석 참고.
//
// [카드 구조] Figma 레이어 순서를 그대로 옮긴 것이다(2026-09-09 스펙).
//   마스크(팔각형) 안에 [카드배경 → 인물사진 → 하단 그라디언트]를 깔고,
//   그 위에 테두리 2겹(안쪽 5px, 바깥 4px)을 얹고, 맨 위에 이름을 올린다.
//   카드 모서리는 border-radius가 아니라 벡터 마스크 모양이라 mask-image로 처리해야 한다.
//
// [카드 배경] card_bg.webp는 Figma 원본 에셋(846x912 = 3배수)을 2배수로 줄인 것이다.
//   32장 카드가 전부 같은 이미지를 쓴다(fill imageHash 32개가 하나로 일치, 2026-09-09 확인).
const cardMask = "/images/voices/card_mask.svg";
const cardStroke = "/images/voices/card_stroke.svg";
const cardStrokeInner = "/images/voices/card_stroke_inner.svg";
const cardBg = "/images/voices/card_bg.webp";
const iconArrow = "/images/voices/icon_arrow.svg";

// 카드 하단 그라디언트 (Figma: 282x150, 카드 높이의 49.34%)
const cardBottomGradient = "linear-gradient(180deg, rgba(13,24,171,0) 15.574%, #00097E 98.333%)";

// 이름 텍스트의 세로 위치 — 카드 상단에서 264px 지점이 텍스트 중심(카드 높이 304 대비 86.84%)
const NAME_CENTER = "86.84%";

function VoiceCard({ name, photo, isEn }: { name: string; photo: string; isEn: boolean }) {
  // mask-image는 브라우저 접두사가 갈려서 두 벌을 다 넣는다.
  const maskStyle = {
    maskImage: `url(${cardMask})`,
    WebkitMaskImage: `url(${cardMask})`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  } as const;

  return (
    <div className="relative w-full aspect-[282/304]">
      <div className="absolute inset-0" style={maskStyle}>
        <img src={cardBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
        <img src={photo} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-[49.34%]" style={{ background: cardBottomGradient }} />
      </div>

      {/* 테두리는 인물사진 위에 올라간다(Figma 레이어 순서) */}
      <img src={cardStrokeInner} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />
      <img src={cardStroke} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* [임시] 영문은 Figma 프레임이 아직 없다. 국문 3글자 기준 32px을 그대로 쓰면 "Kim Sung Gyeul"
          같은 긴 이름이 카드 폭(282)을 넘겨서, 넘치지 않을 정도로만 줄여 둔 값이다.
          영문 디자인이 나오면 실측값으로 교체할 것. */}
      <p
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-[4%] text-center leading-[1.5] text-transparent bg-clip-text ${
          isEn ? "text-[3.6923vw] md:text-[1.25vw]" : "text-[4.9231vw] md:text-[1.6667vw]"
        }`}
        style={{
          top: NAME_CENTER,
          backgroundImage: titleGradient, // 타이틀 "보이스"와 동일한 그라디언트 (2026-09-09 Figma 답변)
          fontFamily: "GFC Red Spirit, Pretendard Variable, sans-serif",
          fontWeight: 900,
        }}
      >
        {name}
      </p>
    </div>
  );
}

export function Voices() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="voices"
      className="w-full flex flex-col items-center gap-[12.3077vw] md:gap-[3.3333vw] py-[24.6154vw] md:py-[6.25vw] px-[4.1026vw] md:px-0"
    >
      {/* 타이틀 블록 — 구조/수치는 Awards 섹션과 동일한 관례를 따른다 */}
      <div className="flex flex-col items-center gap-[4.1026vw] md:gap-[0.8333vw] w-full max-w-[1200px] md:max-w-[62.5vw] text-center">
        <span className="text-[#44A9FF] md:text-[#4D94FF] font-bold uppercase tracking-[1.6px] text-[4.1026vw] md:text-[0.8333vw]">
          {t("voicesSection.eyebrow")}
        </span>
        <h2
          className="text-[10.2564vw] leading-[8.9744vw] md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("voicesSection.title")}
        </h2>
        <p className="max-w-[672px] md:max-w-[35vw] text-[#D4EBFF] text-[4.1026vw] md:text-[1.1094vw] font-normal leading-[1.5]">
          {t("voicesSection.desc")}
        </p>

        {/* 콘텐츠 보기 버튼 — 이동 대상 URL이 아직 정해지지 않아 링크를 걸지 않았다(2026-09-09) */}
        <button
          type="button"
          className="mt-[2.0513vw] md:mt-[0.8333vw] inline-flex items-center justify-center gap-[2.0513vw] md:gap-[0.4167vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] transition-colors shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] px-[8.2051vw] py-[4.1026vw] md:px-[2.5vw] md:py-[1.25vw]"
        >
          <span className="font-bold text-white text-[4.1026vw] md:text-[1.25vw] leading-none whitespace-nowrap">
            {t("voicesSection.cta")}
          </span>
          <img src={iconArrow} alt="" aria-hidden className="-rotate-90 w-[4.1026vw] h-[4.1026vw] md:w-[1.25vw] md:h-[1.25vw]" />
        </button>
      </div>

      {/* 카드 그리드 — PC는 Figma대로 4열(카드 282, 간격 24).
          [임시] 모바일은 Figma 기획이 아직 없어 2열로 잡아 둔 것이다. 기획이 나오면 열 수·간격을 교체할 것. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[3.0769vw] md:gap-[1.25vw] w-full max-w-[1200px] md:max-w-[62.5vw]">
        {VOICES_DATA.map((v, i) => (
          <Reveal key={v.id} delay={(i % 4) * 0.05}>
            <VoiceCard name={lang === "ko" ? v.nameKo : v.nameEn} photo={v.photo} isEn={lang === "en"} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
