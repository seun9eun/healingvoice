import { memo, useCallback, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { VOICES_DATA } from "../data/voicesData";
import { Reveal } from "./Reveal";
import { titleGradient } from "../theme";
import { VoiceModal } from "./VoiceModal";

// 보이스(Voices) 섹션 — 참가자 32인을 8행 x 4열 카드 그리드로 보여준다.
// 반응형 단위(vw) 규칙과 모바일/PC 분기 방식은 Cast.tsx 맨 위 주석 참고.
//
// [카드 구조] Figma 레이어 순서를 그대로 옮긴 것이다(2026-09-09 스펙).
//   마스크(팔각형) 안에 [카드배경 → 인물사진 → 하단 그라디언트]를 깔고,
//   그 위에 테두리 2겹(안쪽 5px, 바깥 4px)을 얹고, 맨 위에 이름을 올린다.
//   카드 모서리는 border-radius가 아니라 벡터 마스크 모양이라 mask-image로 처리해야 한다.
//   카드 배경과 테두리는 32장이 전부 같은 그림이라 <img> 대신 CSS 배경으로 깐다
//   (<img>로 두면 카드당 3개씩, 그리드 전체로 96개가 늘어난다).
//
// [카드 배경] card_bg.webp는 Figma 원본 에셋(846x912 = 3배수)을 2배수로 줄인 것이다.
//   32장 카드가 전부 같은 이미지를 쓴다(fill imageHash 32개가 하나로 일치, 2026-09-09 확인).
const cardMask = "/images/voices/card_mask.svg";
const cardStroke = "/images/voices/card_stroke.svg";
const cardStrokeInner = "/images/voices/card_stroke_inner.svg";
const cardBg = "/images/voices/card_bg.webp";
const iconArrow = "/images/voices/icon_arrow.svg";

// 카드 원본 치수(Figma). 아래 비율은 전부 여기서 파생되므로 카드 크기가 바뀌면 같이 따라간다.
const CARD_W = 282;
const CARD_H = 304;
const GRADIENT_H = 150; // 하단 그라디언트 높이
const NAME_CENTER_Y = 264; // 이름 텍스트 중심의 카드 상단 기준 y

// 카드 하단 그라디언트 (Figma: 282x150)
const cardBottomGradient = "linear-gradient(180deg, rgba(13,24,171,0) 15.574%, #00097E 98.333%)";

// mask-image는 브라우저 접두사가 갈려서 두 벌을 다 넣는다. 카드마다 같은 값이라 모듈 스코프에 둔다.
const MASK_STYLE = {
  maskImage: `url(${cardMask})`,
  WebkitMaskImage: `url(${cardMask})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  backgroundImage: `url(${cardBg})`,
  backgroundSize: "100% 100%",
} as const;

// 테두리 2겹을 한 요소의 배경 레이어로 겹친다(먼저 적은 쪽이 위). Figma 레이어 순서와 같다.
const STROKE_STYLE = {
  backgroundImage: `url(${cardStroke}), url(${cardStrokeInner})`,
  backgroundSize: "100% 100%, 100% 100%",
  backgroundRepeat: "no-repeat, no-repeat",
} as const;

function VoiceCard({
  index,
  name,
  photo,
  isEn,
  onOpen,
  cardRef,
}: {
  index: number;
  name: string;
  photo: string;
  isEn: boolean;
  onOpen: (index: number) => void;
  cardRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    // 클릭하면 인물 모달이 열린다. 호버 표현은 "카드가 확대되는 것"만 남겼다(2026-09-09 결정).
    // 접힌 모서리 삼각형, 테두리 글로우, 사진 확대를 얹어봤지만 과하다고 판단해 걷어냈다.
    // transform만 쓴다 — 32장 그리드에서 box-shadow나 filter를 호버마다 새로 계산하면 버벅인다.
    <button
      ref={cardRef}
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`${name} 프로필 보기`}
      className="relative block w-full aspect-[282/304] cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8890FC] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div className="absolute inset-0" style={MASK_STYLE}>
        {/* 이 섹션은 페이지 맨 아래라 초기 화면에 안 보인다 — 32장(약 1MB)을 미리 받지 않도록 지연 로딩 */}
        <img
          src={photo}
          alt={name}
          width={CARD_W}
          height={CARD_H}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: `${(GRADIENT_H / CARD_H) * 100}%`, background: cardBottomGradient }}
        />
      </div>

      {/* 테두리는 인물사진 위에 올라간다(Figma 레이어 순서) */}
      <div className="absolute inset-0 pointer-events-none" style={STROKE_STYLE} />

      {/* [임시] 영문은 Figma 프레임이 아직 없다. 국문 3글자 기준 32px을 그대로 쓰면 "Kim Sung Gyeul"
          같은 긴 이름이 카드 폭(282)을 넘겨서, 넘치지 않을 정도로만 줄여 둔 값이다.
          영문 디자인이 나오면 실측값으로 교체할 것. */}
      <p
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-[4%] text-center leading-[1.5] text-transparent bg-clip-text font-redSpirit font-black ${
          isEn ? "text-[3.6923vw] md:text-[1.25vw]" : "text-[4.9231vw] md:text-[1.6667vw]"
        }`}
        style={{
          top: `${(NAME_CENTER_Y / CARD_H) * 100}%`,
          backgroundImage: titleGradient, // 타이틀 "보이스"와 동일한 그라디언트 (2026-09-09 Figma 답변)
        }}
      >
        {name}
      </p>
    </button>
  );
}

// 카드 32장은 모달을 열고 닫는 것과 무관하다. 그리드를 memo로 끊어두지 않으면 모달에서 좌우로
// 넘길 때마다 카드 32장과 그 안의 이미지가 전부 다시 조정된다(화살표를 열 번 누르면 헛일이 12회 쌓인다).
const VoiceGrid = memo(function VoiceGrid({
  lang,
  onOpen,
  cardRefs,
}: {
  lang: "ko" | "en";
  onOpen: (index: number) => void;
  cardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}) {
  return (
    // PC는 Figma대로 4열(카드 282, 간격 24).
    // [임시] 모바일은 Figma 기획이 아직 없어 2열로 잡아 둔 것이다. 기획이 나오면 열 수·간격을 교체할 것.
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3.0769vw] md:gap-[1.25vw] w-full max-w-[1200px] md:max-w-[62.5vw]">
      {VOICES_DATA.map((v, i) => (
        <Reveal key={v.id} delay={(i % 4) * 0.05}>
          <VoiceCard
            index={i}
            name={lang === "ko" ? v.nameKo : v.nameEn}
            photo={v.photo}
            isEn={lang === "en"}
            onOpen={onOpen}
            cardRef={(el) => (cardRefs.current[i] = el)}
          />
        </Reveal>
      ))}
    </div>
  );
});

export function Voices() {
  const { t, lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 모달이 자라날 출발점은 언제나 "그 인덱스의 카드 위치"라 상태로 들고 있을 필요가 없다.
  // 필요할 때 측정해서 넘긴다(좌우로 넘긴 뒤 닫으면 현재 인물의 카드로 돌아가는 것도 이걸로 해결된다).
  const getOrigin = useCallback((i: number) => cardRefs.current[i]?.getBoundingClientRect() ?? null, []);
  const close = useCallback(() => setOpenIndex(null), []);

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

      <VoiceGrid lang={lang} onOpen={setOpenIndex} cardRefs={cardRefs} />

      <VoiceModal index={openIndex} lang={lang} onClose={close} onSelect={setOpenIndex} getOrigin={getOrigin} />
    </section>
  );
}
