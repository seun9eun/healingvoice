import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { VOICES_DATA } from "../data/voicesData";
import { titleGradient } from "../theme";

// 보이스 인물 모달 — Figma 확정 스펙(2026-09-10 슬랙 답변).
//   모바일 1822:1386 (358x606, 390 프레임 기준) / PC 1822:1838 (800x596, 1920 기준)
// 색상·테두리·딤은 두 화면이 같고, 달라지는 건 텍스트 크기와 배치뿐이다.
//   모바일 — 이름/소개글이 사진 "위쪽"에 겹치고, 좌우 버튼은 사진 아래 한 줄에 모인다.
//   PC     — 이름/소개글이 사진 "왼쪽"에 겹치고, 좌우 버튼은 사진 양옆에 선다.
// 이 배치 차이 때문에 두 레이아웃을 따로 그린다. 겹쳐 쓰는 부분(사진 영역)만 함수로 묶었다.
//
// [모서리] radius 값이 없다. Figma 추출값도 0이고 스크린샷도 각져 있어 의도된 각진 모서리로 본다.
// [사진]   배경(bg.webp)과 인물(voice_NN.webp)이 Figma에서도 별도 레이어라 합성하지 않고 겹쳐 그린다.
//          인물은 293x440으로 표시된다 — 높이를 꽉 채우면 원본 비율(0.667)에서 폭이 293이 나온다.
//
// 확정해 둔 "동작"(2026-09-09 사용자와 결정, 디자인이 바뀌어도 유지):
//   열기   — 클릭한 카드 위치에서 모달 크기로 한 번에 확대(380ms). 뒤집기는 이음매가 끊겨 보여 뺐다.
//   넘기기 — 단순 좌우 슬라이드. 넘길 때 열림 애니메이션을 다시 재생하지 않는다.
//   닫기   — 배경 클릭, Esc, 닫기 버튼. 닫으면 현재 인물의 카드로 돌아간다.
//
// [함정 1] 배경 스크롤 잠금은 html에 걸어야 한다. 이 페이지는 body가 아니라 html이 스크롤 컨테이너라
//          body에만 걸면 잠기지 않는다. (DeadlineModal은 body에 걸고 있어 서로 어긋난다 —
//          공용 훅으로 합치는 게 맞지만 그건 이 파일 밖 작업이라 남겨 둠)
// [함정 2] AnimatePresence로 만들었을 때 퇴장 애니메이션이 끝나도 노드가 남아, 투명한 전체화면
//          오버레이가 페이지 클릭을 전부 막는 문제가 있었다. 마운트를 직접 관리해서 피했다.
// [함정 3] 좌우 이동을 AnimatePresence mode="wait"로 만들면 퇴장에서 멈춰 다음 내용이 들어오지 않는다.
//          들어오는 쪽만 애니메이션하면 문제도 없고 연속으로 빠르게 눌러도 밀리지 않는다.
// [함정 4] 반드시 body로 포탈해야 한다. Layout이 콘텐츠를 `relative z-10` 컨테이너로 감싸고 있어서,
//          그 안에서 z-[100]을 줘도 바깥에서는 모달 전체가 z-10으로 취급된다. 그러면 z-50인 헤더가
//          모달 위에 남아 딤이 헤더를 덮지 못하고 GNB가 계속 클릭된다(2026-09-10 확인).
//          z 값을 더 올려도 해결되지 않는다 — stacking context를 벗어나는 것이 유일한 방법이다.

const OPEN_SEC = 0.38; // 열기 — 카드당 한 번뿐이라 동작이 보일 만큼 길게
const CLOSE_SEC = 0.28; // 닫기 — 되돌아가는 동작은 짧아야 답답하지 않다
const SLIDE_SEC = 0.18; // 좌우 이동 — 반복되는 동작이라 짧게
const UNMOUNT_MS = CLOSE_SEC * 1000 + 40; // 퇴장이 끝난 뒤 노드를 내린다(닫기 속도를 바꿔도 따라감)

// 열기 애니메이션의 축소 비율을 잡을 때 쓰는 기준 폭(px). 모바일 358, PC는 좌우 버튼까지 포함해 800.
const MOBILE_BREAKPOINT = 768;

const BORDER = "#91a5ca";
const MODAL_BG = "#01102b";
const DIM = "rgba(6,30,73,0.8)"; // #061e49 @0.8
const TEXT = "#e5faff";

// 배경은 PC와 모바일이 다른 파일이다(표시 크기가 두 배 이상 차이나 한 장을 공유하지 않는다).
const bgImageMobile = "/images/voices/modal/bg_mo.webp";
const bgImagePc = "/images/voices/modal/bg_pc.webp";

export function VoiceModal({
  index,
  lang,
  onClose,
  onSelect,
  getOrigin,
}: {
  index: number | null;
  lang: "ko" | "en";
  onClose: () => void;
  onSelect: (next: number) => void;
  getOrigin: (index: number) => DOMRect | null; // 그 인덱스 카드의 화면상 위치 — 여기서 모달이 자라난다
}) {
  const reduced = useReducedMotion();
  const open = index !== null;

  // 닫히는 동안에도 내용을 그려야 하므로 마지막으로 열려 있던 인물을 붙잡아 둔다.
  const [mounted, setMounted] = useState(false);
  const lastIndex = useRef<number | null>(null);
  if (index !== null) lastIndex.current = index;

  // 슬라이드 방향은 이 컴포넌트 안에서만 만들고 쓰는 값이라 부모로 올리지 않는다.
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setDir(1); // 새로 열 때는 항상 오른쪽에서 들어오게
      return;
    }
    const t = setTimeout(() => setMounted(false), reduced ? 0 : UNMOUNT_MS);
    return () => clearTimeout(t);
  }, [open, reduced]);

  // 배경 스크롤 잠금. 스크롤바가 사라지며 생기는 가로 밀림은 같은 폭의 패딩으로 상쇄한다.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPad = document.body.style.paddingRight;
    html.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open]);

  const shown = index ?? lastIndex.current;

  const step = useCallback(
    (d: 1 | -1) => {
      if (shown === null) return;
      setDir(d);
      onSelect((shown + d + VOICES_DATA.length) % VOICES_DATA.length);
    },
    [shown, onSelect]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  const v = shown === null ? null : VOICES_DATA[shown];
  if (!mounted || !v) return null;

  // 클릭한 카드 중심에서 화면 중앙까지의 차이만큼 밀어두고 시작하면 "그 카드에서 자라난" 것처럼 보인다.
  // layoutId 같은 장치 없이 숫자 계산만으로 되므로 비용이 거의 없다.
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const panelPx = isMobile ? window.innerWidth * 0.9179 : window.innerWidth * 0.4167;
  const origin = getOrigin(shown!);
  const collapsed = origin
    ? {
        opacity: 0,
        x: origin.left + origin.width / 2 - window.innerWidth / 2,
        y: origin.top + origin.height / 2 - window.innerHeight / 2,
        scale: origin.width / panelPx,
      }
    : { opacity: 0, x: 0, y: 0, scale: 0.4 };

  const name = lang === "ko" ? v.nameKo : v.nameEn;
  const desc = lang === "ko" ? v.descKo : v.descEn;
  const counter = `${shown! + 1} / ${VOICES_DATA.length}`;

  // 소개글 줄바꿈은 Figma에서 수동 개행이다(2026-09-10 확인). voicesData 문구의 "/" 자리에서 나눈다.
  //
  // 각 줄에 whitespace-nowrap을 걸어 자동 줄바꿈을 완전히 막는다 — 화면 폭이 바뀌어도 줄이 접히거나
  // 붙지 않고, 글자 크기만 vw를 따라 함께 줄고 늘어야 한다는 요구다. 따라서 줄이 길어 넘치는지는
  // 브라우저가 아니라 "/"를 찍는 사람이 책임진다.
  const descLines = desc.split("/").map((s) => s.trim()).filter(Boolean);
  const Desc = ({ className }: { className: string }) => (
    <p className={className} style={{ color: TEXT }}>
      {descLines.map((line, i) => (
        <span key={i} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </p>
  );

  // 이름 줄바꿈은 카드와 같은 자리다 — 성과 이름 사이(2026-09-11 사용자 Figma 확인).
  // 카드는 12명이 항상 두 줄인 고정 목록이지만, 모달은 상자에 안 들어갈 때만 접힌다.
  // 그래서 목록 대신 "끊길 수 있는 자리"를 성/이름 사이 한 곳으로 제한한다 — 양쪽 조각에
  // whitespace-nowrap을 걸어두면 브라우저가 그 한 자리에서만, 그것도 필요할 때만 접는다.
  // 국문 이름은 공백이 없어 조각이 하나뿐이라 그대로 한 줄이다.
  const space = name.indexOf(" ");
  const [surname, given] = space < 0 ? [name, ""] : [name.slice(0, space), name.slice(space + 1)];

  // 그라디언트는 줄마다 따로 걸려야 한다. bg-clip-text를 <p>에 걸면 배경 상자가 두 줄 전체가 되어
  // 윗줄은 흰색, 아랫줄은 파란색으로 갈린다(2026-09-11 QA 지적). 인라인 <span>에
  // box-decoration-break: clone을 주면 줄 조각마다 배경 상자가 따로 생긴다.
  const Name = ({ className }: { className: string }) => (
    <p className={`${className} uppercase font-redSpirit font-black`}>
      <span
        className="text-transparent bg-clip-text"
        style={{
          backgroundImage: titleGradient,
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
      >
        <span className="whitespace-nowrap">{surname}</span>
        {given && (
          <>
            {" "}
            <span className="whitespace-nowrap">{given}</span>
          </>
        )}
      </span>
    </p>
  );

  // 배경 + 인물.
  //
  // [배경] 디자인에서 사진 영역 크기의 3배수로 잘라 받은 파일이라 그대로 꽉 채우면 된다
  // (bg_mo 978x1320 = 326x440x3, bg_pc 1806x1320 = 602x440x3). Figma가 배경 위에 얹던
  // 검정 20% 톤다운도 이미 이미지에 반영돼 있어 따로 덮지 않는다 — 렌더와 픽셀 비교해 확인했다.
  // 이전에는 Figma가 준 크롭 좌표가 렌더와 맞지 않아 배치를 역산해 썼는데, 잘린 파일을 받으면서
  // 그 과정이 전부 필요 없어졌다.
  //
  // [인물] Figma가 준 절대 좌표를 사진 영역 크기로 나눈 비율이다(2026-09-10 답변). 인물 293x440은
  // 사진 영역보다 아래로 밀려 있어 아래쪽이 잘린다 — 그 덕에 위쪽이 비어 이름·소개글과 겹치지 않는다.
  // 잘림은 바깥 컨테이너의 overflow-hidden이 처리한다.
  const PERSON_LAYOUT = {
    mobile: { left: "5.21%", top: "22.27%", width: "89.88%" }, // 사진 영역 326x440 기준 x17 y98 293x440
    pc: { left: "48.34%", top: "2.5%", width: "48.67%" }, //      사진 영역 602x440 기준 x291 y11 293x440
  } as const;

  const Photo = ({ variant }: { variant: "mobile" | "pc" }) => (
    <>
      <img
        src={variant === "mobile" ? bgImageMobile : bgImagePc}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full"
      />
      <img
        src={v.photoModal ?? v.photo}
        alt={name}
        decoding="async"
        className="absolute max-w-none"
        style={{ ...PERSON_LAYOUT[variant], aspectRatio: "293 / 440" }}
      />
    </>
  );

  const NavButton = ({ d, label, sizeClass }: { d: 1 | -1; label: string; sizeClass: string }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        step(d);
      }}
      aria-label={label}
      className={`shrink-0 flex items-center justify-center rounded-full border transition-colors hover:bg-white/10 ${sizeClass}`}
      style={{ borderColor: BORDER }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2" aria-hidden>
        <path
          d={d === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
          stroke={TEXT}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const CloseButton = ({ sizeClass }: { sizeClass: string }) => (
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className={`absolute flex items-center justify-center ${sizeClass}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-[54.5%] h-[54.5%]" aria-hidden>
        <path d="M5 5l14 14M19 5L5 19" stroke={BORDER} strokeWidth={2} strokeLinecap="round" />
      </svg>
    </button>
  );

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: DIM }}
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: open ? 0.22 : 0.18 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} 프로필`}
    >
      <motion.div
        initial={reduced ? { opacity: 0 } : collapsed}
        animate={
          reduced ? { opacity: open ? 1 : 0 } : open ? { x: 0, y: 0, scale: 1, opacity: 1 } : collapsed
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                // x/y/scale을 한 곡선으로 같이 움직여야 끊겨 보이지 않는다
                duration: open ? OPEN_SEC : CLOSE_SEC,
                ease: [0.22, 0.7, 0.25, 1],
                opacity: { duration: open ? 0.18 : 0.16 },
              }
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 모바일 358x606 ─────────────────────────────────────────── */}
        <div
          className="md:hidden relative w-[91.7949vw] h-[155.3846vw] border pt-[16.4103vw] px-[4.1026vw] pb-[6.1538vw]"
          style={{ backgroundColor: MODAL_BG, borderColor: BORDER }}
        >
          <CloseButton sizeClass="right-[2.3077vw] top-[2.3077vw] w-[11.2821vw] h-[11.2821vw]" />

          <motion.div
            key={v.id}
            initial={reduced ? false : { x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0 : SLIDE_SEC, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            {/* 사진 326x440 — 이름/소개글이 위쪽(사진 상단에서 23px)에 겹친다 */}
            <div className="relative w-full h-[112.8205vw] overflow-hidden">
              <Photo variant="mobile" />
              {/* info 280x84 — 사진(326) 안에서 가운데, 상단에서 23px */}
              <div className="absolute left-[7.06%] w-[85.89%] top-[5.8974vw] flex flex-col items-center gap-[1.0256vw] text-center">
                {/* 영문만 27px로 줄인다(2026-09-11 QA). 국문 28px 그대로 쓰면 박연홍 한 명이
                    상자(273px)를 2px 넘겨 두 줄이 되는데, 27px면 32명 전원 한 줄에 들어간다. */}
                <Name className={`leading-[1.5] ${lang === "en" ? "text-[6.9231vw]" : "text-[7.1795vw]"}`} />
                <Desc className="text-[4.1026vw] leading-[1.2] tracking-[-0.66px] font-medium break-keep" />
              </div>
            </div>

            {/* nav — 사진 아래 10px, 행 자체에 상단 padding 16(Figma 324x66, padding 16/0/0/0).
                남은 공간에 중앙 정렬하면 버튼이 7px 가까이 위로 떠서 스펙과 어긋난다. */}
            <div className="mt-[2.5641vw] pt-[4.1026vw] flex items-start justify-between">
              <NavButton d={-1} label="이전 인물" sizeClass="w-[12.8205vw] h-[12.8205vw]" />
              <span className="text-[4.1026vw] font-medium" style={{ color: BORDER }}>
                {counter}
              </span>
              <NavButton d={1} label="다음 인물" sizeClass="w-[12.8205vw] h-[12.8205vw]" />
            </div>
          </motion.div>
        </div>

        {/* ── PC 800x596 ─────────────────────────────────────────────── */}
        <div
          className="hidden md:block relative w-[41.6667vw] h-[31.0417vw] border pt-[4.1667vw] px-[1.25vw] pb-[1.25vw]"
          style={{ backgroundColor: MODAL_BG, borderColor: BORDER }}
        >
          <CloseButton sizeClass="right-[0.8854vw] top-[0.8854vw] w-[2.2917vw] h-[2.2917vw]" />

          <motion.div
            key={v.id}
            initial={reduced ? false : { x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0 : SLIDE_SEC, ease: "easeOut" }}
          >
            {/* [이전] 사진 602x440 [다음] */}
            <div className="flex items-center gap-[1.25vw]">
              <NavButton d={-1} label="이전 인물" sizeClass="w-[2.6042vw] h-[2.6042vw]" />

              <div className="relative flex-1 h-[22.9167vw] overflow-hidden">
                <Photo variant="pc" />
                {/* 텍스트 열 — 사진 영역 좌측에서 16px(2.66%), 폭 280(46.51%). 오른쪽은 인물이 선다.
                    이 열을 다시 "이름 / 설명" 두 칸으로 나누고 각 칸 높이를 최대 줄 수로 고정한다
                    (2026-09-11 사용자 지정). 예전처럼 이름+설명을 한 덩어리로 가운데 정렬하면,
                    사람마다 줄 수가 달라 좌우로 넘길 때 글자가 위아래로 출렁인다.
                      이름  40px x 행간 1.5 — 영문 2줄 = 120px = 6.25vw / 국문 1줄 = 60px = 3.125vw
                      간격  12px = 0.625vw
                      설명  20px x 행간 1.2 x 3줄 = 72px = 3.75vw (최대 3줄 — 영문 16명, 국문 1명)
                    두 칸 모두 안에서 세로 가운데 정렬이라, 이름이 한 줄이면 두 줄 높이의 가운데에 선다.
                    이름 칸만 언어를 타는 이유는 국문 이름이 두 줄이 되는 경우가 없기 때문이다 —
                    영문과 같이 두 줄을 잡아두면 빈 공간만 늘어난다. */}
                <div className="absolute inset-y-0 left-[2.66%] w-[46.51%] flex flex-col justify-center text-center">
                  <div className={`flex items-center justify-center ${lang === "en" ? "h-[6.25vw]" : "h-[3.125vw]"}`}>
                    <Name className="text-[2.0833vw] leading-[1.5]" />
                  </div>
                  <div className="mt-[0.625vw] h-[3.75vw] flex items-center justify-center">
                    <Desc className="text-[1.0417vw] leading-[1.2] tracking-[-0.66px] font-medium break-keep" />
                  </div>
                </div>
              </div>

              <NavButton d={1} label="다음 인물" sizeClass="w-[2.6042vw] h-[2.6042vw]" />
            </div>

            {/* 페이지 표시 — 사진 아래 24px */}
            <p className="pt-[1.25vw] text-center text-[0.8333vw] font-medium" style={{ color: BORDER }}>
              {counter}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
