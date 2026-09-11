import { memo, useCallback, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { VOICES_DATA } from "../data/voicesData";
import { Reveal } from "./Reveal";
import { titleGradient } from "../theme";
import { VoiceModal } from "./VoiceModal";
import { FONDANT_CONTENT_URL } from "../constants/links";

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
const iconChevron = "/images/voices/icon_chevron.svg"; // 모바일 카드 이름 옆 ">"

// 카드 원본 치수(Figma). 아래 비율은 전부 여기서 파생되므로 카드 크기가 바뀌면 같이 따라간다.
// PC 1746:438은 4열·카드 282x304, 모바일 1821:571은 3열·카드 110x118로 서로 다르다(2026-09-10 답변).
const CARD_W = 282;
const CARD_H = 304;
const M_CARD_H = 118;
// 하단 그라디언트 높이 — PC와 모바일이 다르다(2026-09-10 답변). 카드 높이 대비 비율로 환산해 쓴다.
const GRADIENT_H = 150; // PC: 카드 304 중 하단 150 (y154~304)
const M_GRADIENT_H = 64; // 모바일: 카드 118 중 하단 64

// 이름 상자는 카드 "하단" 기준으로 붙는다(2026-09-10 답변). 줄 수가 늘면 위로 자라는 구조라,
// 중심 기준으로 두면 2줄일 때 위아래로 벌어져 인물 사진을 덮는다. 아래 bottom-[...] 값의 출처:
//   PC     이름 상자 하단 여백 16 / 304 = 5.26%
//   모바일  이름 상자 padding-bottom 12 / 118 = 10.17%

// 영문 이름 중 두 줄로 끊기는 12명(2026-09-11 확정, PC·모바일 동일).
// 규칙이 아니라 목록이다 — 같은 3어절이어도 "Kim Ye Eun"은 한 줄, "Kim Sung Shin"은 두 줄이다.
// 끊는 자리는 전원 성과 이름 사이(첫 공백)라 목록만 있으면 된다.
const EN_NAME_TWO_LINE = new Set([
  "Kim Sung Gyeul", "Kim Sung Shin", "Moon Eun Soo", "Park Yeon Hong",
  "Park Ye Eum", "Suk Sang Eun", "Lee Cheol Kyu", "Lim Sung Kyu",
  "Jang Geun Hee", "Jeon Deok Ho", "Jeong Ji Hoon", "Choi Seo Hee",
]);

// 카드 하단 그라디언트. 이 스크림이 이름 가독성을 잡아주는 장치라 빼면 안 된다(기획자 확인).
// PC와 모바일이 끝 색과 정지점까지 다르다 — 모바일은 82% 지점에서 이미 불투명해진다.
const cardBottomGradient = "linear-gradient(180deg, rgba(13,24,171,0) 0%, #00097E 100%)";
const cardBottomGradientMobile = "linear-gradient(180deg, rgba(13,24,171,0) 0%, #02055C 82%)";

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
  photoMobile,
  isEn,
  onOpen,
  cardRef,
}: {
  index: number;
  name: string;
  photo: string;
  photoMobile?: string;
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
      className="relative block w-full aspect-[110/118] md:aspect-[282/304] cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8890FC] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div className="absolute inset-0" style={MASK_STYLE}>
        {/* 모바일은 얼굴 위주로 더 크게 잡힌 별도 크롭을 쓴다. <picture>라 브라우저가 한 장만 받는다.
            이 섹션은 페이지 맨 아래라 초기 화면에 안 보인다 — 미리 받지 않도록 지연 로딩 */}
        <picture>
          <source media="(min-width: 768px)" srcSet={photo} />
          <img
            src={photoMobile ?? photo}
            alt={name}
            width={CARD_W}
            height={CARD_H}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        <div
          className="absolute bottom-0 left-0 w-full md:hidden"
          style={{ height: `${(M_GRADIENT_H / M_CARD_H) * 100}%`, background: cardBottomGradientMobile }}
        />
        <div
          className="absolute bottom-0 left-0 w-full hidden md:block"
          style={{ height: `${(GRADIENT_H / CARD_H) * 100}%`, background: cardBottomGradient }}
        />
      </div>

      {/* 테두리는 인물사진 위에 올라간다(Figma 레이어 순서).
          같은 SVG를 카드 크기에 맞춰 늘려 쓰므로 선 두께도 함께 줄어든다. Figma 모바일 실측은
          내측 3px·외측 2px인데 이 방식으로는 각각 약 2.0px·1.6px이 된다 — 1px 안쪽 차이라 그대로 둔다. */}
      <div className="absolute inset-0 pointer-events-none" style={STROKE_STYLE} />

      {/* 영문 이름 스펙 확정본(2026-09-11):
            모바일  11px / 자간 -5% / 행간 110% / 왼쪽 정렬 / 대문자, 상자 시작 x=13, 최대 2줄
            PC     28px / 자간 0 / 행간 120% / 가운데 정렬 / 대문자
          화살표는 이름 길이와 무관하게 카드 x=90에 고정된다. 오른쪽 여백 10 / 110 = 9.0909%이고
          화살표 폭도 10이라, 오른쪽에 붙이면 정확히 x=90~100에 선다. */}
      <div
        // 영문은 이름 영역 높이를 "2줄 기준"으로 고정하고 그 안에서 세로 가운데에 둔다. 그래야 이름이
        // 한 줄인 카드와 두 줄인 카드의 이름 중심이 같은 높이에 선다(2026-09-10 사용자 결정).
        // 고정하지 않으면 하단 기준으로 쌓여서, 한 줄 이름이 두 줄 이름의 아랫줄과 같은 자리에 놓인다.
        // 모바일 세로 위치는 Figma의 2줄 상자 y=78.37을 그대로 쓴다(78.37 / 118 = 66.4153%).
        // 높이 = 11px x 행간 1.1 x 2줄 = 24.2px = 6.2051vw.
        className={`absolute flex items-center bottom-[10.17%] md:left-0 md:right-0 md:top-auto md:bottom-[5.26%] md:h-auto md:justify-center ${
          isEn
            ? "left-[11.8182%] right-[9.0909%] top-[66.4153%] h-[6.2051vw] justify-between"
            : "inset-x-0 px-[4%] gap-[0.7692vw] md:gap-0 justify-center"
        }`}
      >
        <p
          // GFC Red Spirit은 소문자 자리에 "작은 대문자" 글리프가 들어 있는 폰트다. 그래서 데이터가
          // Title Case("Kim Sung Gyeul")면 첫 글자만 크고 나머지가 작게 렌더된다. Figma는 텍스트 노드에
          // textCase=UPPER가 걸려 있어 전부 같은 크기의 대문자로 보이므로, 여기서도 uppercase가 필요하다
          // (2026-09-10 Figma 스크린샷 픽셀 대조로 확인). 한글에는 영향이 없다.
          //
          // 정렬이 언어별로 다르다: 국문은 가운데, 영문은 모바일 왼쪽 / PC 가운데다(Figma textAlign).
          className={`uppercase font-redSpirit font-black ${
            isEn
              ? "whitespace-nowrap text-left md:text-center text-[2.8205vw] md:text-[1.4583vw] tracking-[-0.05em] md:tracking-normal leading-[1.1] md:leading-[1.2]"
              : "text-center text-[3.8462vw] md:text-[1.6667vw] leading-[1.5]"
          }`}
        >
          {/* 그라디언트는 줄마다 따로 걸어야 한다. bg-clip-text를 바깥 <p>에 걸면 배경 상자가
              두 줄 전체라 윗줄은 흰색, 아랫줄은 파란색으로 갈린다(2026-09-11 QA 지적).
              줄 단위 <span>에 걸면 각 줄이 밝은색에서 어두운색까지 온전한 그라디언트를 갖는다. */}
          {(isEn && EN_NAME_TWO_LINE.has(name) ? name.split(/ (.+)/).slice(0, 2) : [name]).map((line) => (
            <span
              key={line}
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: titleGradient }} // 타이틀 "보이스"와 동일한 그라디언트
            >
              {line}
            </span>
          ))}
        </p>
        {/* 모바일 전용 UI — PC 카드에는 이 화살표가 없다(2026-09-10 기획자 확인) */}
        <img
          src={iconChevron}
          alt=""
          aria-hidden
          className="md:hidden shrink-0 w-[2.5641vw] h-[3.0769vw]"
        />
      </div>
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
  // 32명을 3열로 깔면 마지막 행에 2장만 남는데, Figma는 이 2장을 가운데에 둔다
  // (x=62=(358-234)/2로 정확히 대칭). grid는 마지막 행을 왼쪽부터 채우므로 두 장을 나란히
  // 반 칸(= (카드폭+열간격)/2 = 62px = 카드폭의 56.36%)만큼 오른쪽으로 민다.
  const lastRowStart = VOICES_DATA.length - 2;

  return (
    // PC는 Figma대로 4열(카드 282, 간격 24), 모바일은 3열(카드 110, 열간격 14, 행간격 20).
    // 그리드 자체의 상단 패딩 24px은 섹션 gap(48)에 더해진다.
    <div className="grid grid-cols-3 md:grid-cols-4 gap-x-[3.5897vw] gap-y-[5.1282vw] md:gap-[1.25vw] pt-[6.1538vw] md:pt-0 w-full max-w-[1200px] md:max-w-[62.5vw]">
      {VOICES_DATA.map((v, i) => (
        <div key={v.id} className={i >= lastRowStart ? "translate-x-[56.36%] md:translate-x-0" : undefined}>
          <Reveal delay={(i % 4) * 0.05}>
            <VoiceCard
              index={i}
              name={lang === "ko" ? v.nameKo : v.nameEn}
              photo={v.photo}
              photoMobile={v.photoMobile}
              isEn={lang === "en"}
              onOpen={onOpen}
              cardRef={(el) => (cardRefs.current[i] = el)}
            />
          </Reveal>
        </div>
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
      // 모바일 하단 여백은 64px이다(Figma 1821:571 padding 0/0/64/0, 2026-09-10 확인).
      // 위쪽 96px은 Figma에서는 출연진 섹션의 하단 padding으로 잡혀 있는데, 여기서 주든 저기서 주든
      // 사이 간격은 96px로 같아서 현재 배치를 유지한다.
      className="w-full flex flex-col items-center gap-[12.3077vw] md:gap-[3.3333vw] pt-[24.6154vw] pb-[16.4103vw] md:py-[6.25vw] px-[4.1026vw] md:px-0"
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

        {/* 콘텐츠 보기 — 퐁당 앱 안의 힐링보이스 이벤트 페이지로 나간다(2026-09-10 사용자 전달) */}
        <a
          href={FONDANT_CONTENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[2.0513vw] md:mt-[0.8333vw] inline-flex items-center justify-center gap-[2.0513vw] md:gap-[0.4167vw] rounded-full bg-[#6276FB] hover:bg-[#4f5fe0] transition-colors shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] px-[8.2051vw] py-[4.1026vw] md:px-[2.5vw] md:py-[1.25vw]"
        >
          <span className="font-bold text-white text-[4.1026vw] md:text-[1.25vw] leading-none whitespace-nowrap">
            {t("voicesSection.cta")}
          </span>
          <img src={iconArrow} alt="" aria-hidden className="-rotate-90 w-[4.1026vw] h-[4.1026vw] md:w-[1.25vw] md:h-[1.25vw]" />
        </a>
      </div>

      <VoiceGrid lang={lang} onOpen={setOpenIndex} cardRefs={cardRefs} />

      <VoiceModal index={openIndex} lang={lang} onClose={close} onSelect={setOpenIndex} getOrigin={getOrigin} />
    </section>
  );
}
