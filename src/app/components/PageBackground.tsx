// 공용 배경 레이어 (Figma `bg` 그룹 1746:239, 2026-09-09 답변 기준으로 전면 교체)
//
// [이전 구현과 무엇이 달라졌나]
// 예전엔 별 배경을 세로로 무한 반복(repeat)하는 타일 방식이었다. 그래서 타일 경계에 가로 이음새가
// 생기는 문제를 미러 타일로 덮는 등 계속 손을 봐야 했다. v6.1 실제 구조는 반복이 아니라
// "같은 별 이미지 3장을 서로 다른 위치·크기로 수동 배치"한 것이다(3장 모두 동일 imageHash).
// 그래서 repeat를 걷어내고 3장을 각각 절대배치한다. 이음새 보정도 더 이상 필요 없다.
//
// [좌표계] Figma 페이지 프레임 `힐링보이스_PC_KO_v6.1`(1746:238, 1920x8719) 좌상단이 원점.
// 답변의 수치는 bg 그룹 원점 기준이라 x는 -908, y는 +852를 더해 페이지 기준으로 옮겨 적었다.
// 가로는 1920 기준 vw로, 세로는 페이지 높이 8719 기준 %로 환산한다(실제 페이지 높이가 Figma와
// 정확히 같지는 않으므로, 세로는 비율로 따라가게 두는 것이 기존 관례).
//
// [주의] bg 그룹은 3435x8963으로 프레임(1920)보다 넓어 좌우로 넘친다. 페이지 프레임이
// clipsContent=true라 이 컨테이너의 overflow:hidden이 반드시 있어야 한다. 넘치는 폭을 잘라
// 1920에 맞추면 별 위치가 달라진다.
// 상단 0~852 구간에는 bg 요소가 없다. 그 구간은 01_Hero가 자기 프레임 배경으로 덮는다.
const bgStar = "/images/bg/bg_star.webp"; // 2880x2777 원본(JPEG)을 2048폭 webp로 변환

// glow는 ELLIPSE의 래디얼 그라디언트 채움이고 blur 효과는 없다. 부드럽게 보이는 건 SCREEN 블렌드 때문.
// Figma는 도형 반경의 83% 지점에서 알파 0이 되는데, 그 반경이 closest-side의 약 1.055배라
// closest-side 기준으로는 87.6% 지점이 알파 0이다. 도형 경계(100%)에 닿기 전에 완전히 투명해지므로
// 예전에 QA에서 지적됐던 "원형 테두리 선"은 생기지 않는다.
const glow = (from: string, to: string) =>
  `radial-gradient(circle closest-side at 49% 52%, ${from} 0%, ${to} 87.6%)`;

const purpleGlow = glow("rgba(114,47,246,1)", "rgba(26,0,255,0)"); // #722ff6 → #1a00ff alpha0
const blueGlow = glow("rgba(56,111,183,1)", "rgba(0,111,255,0)"); // #386fb7 → #006fff alpha0

// 별 배경 3장. z는 star1 → star3 → star2 순(레이어 이름 순서와 z-order가 다르다 — 2026-09-09 확인).
// star2·star3은 rotation 180이며, 아래 x/y/W/H는 회전이 반영된 바운딩 박스라 위치는 그대로 쓰고
// 이미지만 뒤집는다.
const STARS = [
  // bg_star 1 — bg(530, 0) 2734x2636 → page(-378, 852)
  { left: "-19.6875vw", top: "9.7718%", w: "142.3958vw", h: "137.2917vw", flip: false },
  // bg_star 3 — bg(359, 3676) 3076x2967 → page(-549, 4528)
  { left: "-28.5938vw", top: "51.9326%", w: "160.2083vw", h: "154.5313vw", flip: true },
  // bg_star 2 — bg(359, 5996) 3076x2967 → page(-549, 6848). 프레임 하단을 넘어가 잘린다.
  { left: "-28.5938vw", top: "78.5411%", w: "160.2083vw", h: "154.5313vw", flip: true },
];

export function PageBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgStar})`,
            left: s.left,
            top: s.top,
            width: s.w,
            height: s.h,
            transform: s.flip ? "rotate(180deg)" : undefined,
          }}
        />
      ))}

      {/* glow 보라 (1746:244) — page(-908, 1058), 1715x1715, paint opacity 0.4 / SCREEN */}
      <div
        className="absolute left-[-47.2917vw] top-[12.1344%] w-[89.3229vw] h-[89.3229vw] rounded-full opacity-40 mix-blend-screen"
        style={{ backgroundImage: purpleGlow }}
      />
      {/* glow 파랑 (1746:243) — page(157, 3184), 1607x1607, paint opacity 0.5 / SCREEN */}
      <div
        className="absolute left-[8.1771vw] top-[36.5179%] w-[83.6979vw] h-[83.6979vw] rounded-full opacity-50 mix-blend-screen"
        style={{ backgroundImage: blueGlow }}
      />
    </div>
  );
}
