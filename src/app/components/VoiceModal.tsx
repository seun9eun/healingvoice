import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { VOICES_DATA } from "../data/voicesData";
import { titleGradient } from "../theme";

// [임시] 보이스 인물 모달 — 디자인이 아직 안 나와서 동작 확인용 껍데기다(2026-09-09).
// 박스 안쪽은 자리표시자다. 다만 확정된 구조는 반영해 뒀다 — 배경 이미지 위에 텍스트가 왼쪽,
// 큰 인물 이미지가 오른쪽. 인물 이미지는 카드용과 별도 에셋을 쓸 예정이라 voicesData의
// photoModal을 먼저 보고 없으면 카드용(photo)으로 대체한다.
//
// 확정해 둔 "동작":
//   열기   — 클릭한 카드 위치에서 모달 크기로 한 번에 확대된다.
//            처음엔 카드 뒤집기(rotateY 180ms) 다음에 확대(220ms)를 이어붙였는데 이음매가 뚝 끊겨
//            보였다. 끊기지 않게 하려면 전체를 600ms 이상으로 늘려야 해서, 뒤집기를 빼고 한 동작으로
//            합쳤다. 260ms는 너무 빨라 안 보인다는 피드백을 받아 380ms로 늘렸다.
//   넘기기 — 단순 좌우 슬라이드. 32명을 반복해서 넘기는 기능이라 화려한 전환은 금방 방해가 된다.
//            넘길 때 열림 애니메이션을 다시 재생하지 않는다.
//   닫기   — 배경 클릭, Esc, 닫기 버튼.
//
// [함정 1] 배경 스크롤 잠금은 html에 걸어야 한다. 이 페이지는 body가 아니라 html이 스크롤 컨테이너라
//          body에만 걸면 잠기지 않는다. (같은 저장소의 DeadlineModal은 body에 걸고 있어 서로 어긋난다 —
//          공용 훅으로 합치는 게 맞지만 그건 이 파일 밖 작업이라 남겨 둠)
// [함정 2] AnimatePresence로 만들었을 때 퇴장 애니메이션이 끝나도 노드가 남아, 투명한 전체화면
//          오버레이가 페이지 클릭을 전부 막는 문제가 있었다. 마운트를 직접 관리해서 피했다.
//          실제 모달을 만들 때 AnimatePresence로 되돌린다면 이 증상을 반드시 다시 확인할 것.
// [함정 3] 좌우 이동을 AnimatePresence mode="wait"로 만들면 퇴장에서 멈춰 다음 내용이 들어오지 않는다.
//          들어오는 쪽만 애니메이션하면 문제도 없고 연속으로 빠르게 눌러도 밀리지 않는다.

const OPEN_SEC = 0.38; // 열기 — 카드당 한 번뿐이라 동작이 보일 만큼 길게
const CLOSE_SEC = 0.28; // 닫기 — 되돌아가는 동작은 짧아야 답답하지 않다
const SLIDE_SEC = 0.18; // 좌우 이동 — 반복되는 동작이라 짧게
const UNMOUNT_MS = CLOSE_SEC * 1000 + 40; // 퇴장이 끝난 뒤 노드를 내린다(닫기 속도를 바꿔도 따라감)

const PANEL_MAX = 700; // 박스 최대 폭
const NAV_W = 56; // 좌우 버튼 지름
const NAV_GAP = 16; // 박스와 버튼 사이 간격

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
  // 애니메이션 대상이 [버튼 + 박스 + 버튼] 묶음이라 축소 비율도 묶음 폭 기준으로 잡는다.
  const origin = getOrigin(shown!);
  const collapsed = origin
    ? {
        opacity: 0,
        x: origin.left + origin.width / 2 - window.innerWidth / 2,
        y: origin.top + origin.height / 2 - window.innerHeight / 2,
        scale: origin.width / Math.min(PANEL_MAX + (NAV_W + NAV_GAP) * 2, window.innerWidth * 0.92),
      }
    : { opacity: 0, x: 0, y: 0, scale: 0.4 };

  const name = lang === "ko" ? v.nameKo : v.nameEn;

  // 폭이 좁으면 박스와 겹치므로 md 미만에서는 숨긴다(모바일은 스와이프로 대체 예정).
  const NavButton = ({ d, label }: { d: 1 | -1; label: string }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        step(d);
      }}
      aria-label={label}
      className="hidden md:flex shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-[24px] leading-none transition-colors"
      style={{ width: NAV_W, height: NAV_W }}
    >
      {d === 1 ? "›" : "‹"}
    </button>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020A1F]/70 backdrop-blur-[6px] px-[4vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: open ? 0.22 : 0.18 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} 프로필`}
    >
      {/* 좌우 버튼을 박스 바깥에 바로 붙인다. 셋을 한 묶음으로 두고 같이 확대되게 해야
          열릴 때 버튼만 제자리에 떠 있지 않는다. */}
      <motion.div
        className="flex w-full items-center justify-center"
        style={{ maxWidth: PANEL_MAX + (NAV_W + NAV_GAP) * 2, gap: NAV_GAP }}
        initial={reduced ? { opacity: 0 } : collapsed}
        animate={
          reduced
            ? { opacity: open ? 1 : 0 }
            : open
              ? { x: 0, y: 0, scale: 1, opacity: 1 }
              : collapsed
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
      >
        <NavButton d={-1} label="이전 인물" />

        <div
          className="relative min-w-0 flex-1 rounded-[24px] border-2 border-[#8890FC]/60 bg-[#0B1740] shadow-[0_24px_80px_rgba(0,0,0,0.55)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={v.id}
            initial={reduced ? false : { x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0 : SLIDE_SEC, ease: "easeOut" }}
            className="flex items-center gap-6 p-8"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <p
                className="text-[36px] leading-[1.4] text-transparent bg-clip-text font-redSpirit font-black"
                style={{ backgroundImage: titleGradient }}
              >
                {name}
              </p>
              <p className="text-[#D4EBFF] text-[16px] leading-[1.6]">{lang === "ko" ? v.descKo : v.descEn}</p>
              <p className="text-[#8890FC] text-[12px]">
                임시 박스 · {shown! + 1} / {VOICES_DATA.length}
              </p>
            </div>
            <img
              src={v.photoModal ?? v.photo}
              alt=""
              aria-hidden
              decoding="async"
              className="w-[240px] h-[259px] shrink-0 object-cover"
            />
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-[16px] leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <NavButton d={1} label="다음 인물" />
      </motion.div>
    </motion.div>
  );
}
