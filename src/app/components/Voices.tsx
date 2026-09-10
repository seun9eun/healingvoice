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
const iconChevron = "/images/voices/icon_chevron.svg"; // 모바일 카드 이름 옆 ">"

// "콘텐츠 보기" 이동 대상 — 퐁당 앱 내 힐링보이스 이벤트 페이지
const FONDANT_CONTENT_URL = "https://www.fondant.kr/event/000a0b29-9542-7312-d5fa-4c442f000249";

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

      {/* [임시 — 영문 이름 크기] 영문 프레임(1847:6239/7247)은 나왔지만 그 안의 이름 스펙은 디자인
          작업 전에 뽑힌 값이라 확정이 아니다(2026-09-10 사용자 확인). 확정되면 아래 값을 교체할 것.
          받아둔 참고값: PC 28px·행간120%, 모바일 12px·자간-5%·행간110%, 화살표 gap 2, 하단 padding 14.
          영문 이름은 자동 줄바꿈이 아니라 인물마다 수동 개행이며(모바일 2줄 13장/1줄 19장) 그 목록도
          아직 없다. 지금 값은 국문 대비 같은 비율로 줄여 넘침만 피해 둔 것이다. */}
      {/* 영문 모바일은 이름을 카드 왼쪽에, 화살표를 카드 오른쪽 끝에 고정한다(2026-09-10 사용자 결정).
          이름 길이와 상관없이 화살표가 같은 자리에 서서 32장이 균일해 보인다. Figma는 이름+화살표
          묶음을 카드 가운데에 두는 구조라 이름이 짧으면 화살표가 안쪽으로 들어오는데, 그 부분은
          디자인 확정 전이라 사용자 판단을 따랐다. 국문과 PC는 지금까지대로 가운데 정렬이다. */}
      <div
        className={`absolute inset-x-0 px-[4%] flex items-center gap-[0.7692vw] md:gap-0 bottom-[10.17%] md:bottom-[5.26%] md:justify-center ${
          isEn ? "justify-between" : "justify-center"
        }`}
      >
        <p
          // GFC Red Spirit은 소문자 자리에 "작은 대문자" 글리프가 들어 있는 폰트다. 그래서 데이터가
          // Title Case("Kim Sung Gyeul")면 첫 글자만 크고 나머지가 작게 렌더된다. Figma는 텍스트 노드에
          // textCase=UPPER가 걸려 있어 전부 같은 크기의 대문자로 보이므로, 여기서도 uppercase가 필요하다
          // (2026-09-10 Figma 스크린샷 픽셀 대조로 확인). 한글에는 영향이 없다.
          //
          // 정렬이 언어별로 다르다: 국문은 가운데, 영문은 왼쪽이다(Figma textAlign LEFT). 이름이 두 줄이
          // 되면 두 줄 모두 왼쪽에 맞고, 화살표는 그 두 줄 묶음의 세로 가운데에 선다(바깥 flex의
          // items-center가 처리). 영문 이름 디자인은 아직 확정 전이라 크기 값은 임시다.
          className={`leading-[1.5] uppercase text-transparent bg-clip-text font-redSpirit font-black ${
            isEn ? "text-left text-[2.8846vw] md:text-[1.25vw]" : "text-center text-[3.8462vw] md:text-[1.6667vw]"
          }`}
          style={{ backgroundImage: titleGradient }} // 타이틀 "보이스"와 동일한 그라디언트
        >
          {name}
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
