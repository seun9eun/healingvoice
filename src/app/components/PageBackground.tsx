// 공용 배경 레이어 (Figma 1178:492 "bg", 2026-08-28 답변)
// Hero 하단부터 Footer까지 여러 섹션 뒤를 한 장으로 관통하는 배경.
// Hero 자체 배경이 완전히 불투명해서 Hero 구간에서는 가려지고,
// Big Text의 위→아래 투명 그라디언트가 옅어지면서부터 드러나는 구조.
const starField = "/images/bg/star_field.jpg"; // 원본 하단 약 23%(y1180~1542)에 별이 전혀 없어 반복 시 빈 띠가 생기던 것을 크롭해서 수정(2026-08-31)
// QA 피드백(2026-09-03, capture/피드백1.png + 2차 지적): 배경 원형 글로우 테두리에 선이 보이는 문제 —
// 그라데이션 기본 사이즈(farthest-corner)가 rounded-full 박스의 실제 반지름(closest-side)보다 커서
// 83% 지점에서 완전히 투명해지기 전에 원형 박스 경계에서 잘려 테두리처럼 보였음. closest-side로
// 그라데이션 크기를 박스 반지름에 맞추고, 중간 정지점을 둬 바깥으로 갈수록 완만하게(블러처럼) 옅어지다
// 경계(100%)에서 정확히 알파 0이 되게 해 선이 남지 않도록 함. BigText.tsx의 장식 글로우도 같은 공식 사용
const glowFalloff = (r: number, g: number, b: number) =>
  `radial-gradient(circle closest-side, rgba(${r},${g},${b},1) 0%, rgba(${r},${g},${b},0.6) 40%, rgba(${r},${g},${b},0.25) 65%, rgba(${r},${g},${b},0.07) 85%, rgba(${r},${g},${b},0) 100%)`;

const blueGlow = glowFalloff(56, 111, 183); // #386FB7
const purpleGlow = glowFalloff(114, 47, 246); // #722FF6

export function PageBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${starField})`, backgroundRepeat: "repeat", backgroundSize: "1600px auto" }}
      />
      {/* glow A (Figma 1178:496) — 페이지 기준 x-908 y1058, 1715x1715, 중심이 화면 왼쪽 바깥에 걸쳐 있음 */}
      <div
        className="absolute left-[-47.292vw] top-[16.578%] w-[89.323vw] h-[89.323vw] rounded-full opacity-40 mix-blend-screen"
        style={{ backgroundImage: purpleGlow }}
      />
      {/* glow B (Figma 1178:495) — 페이지 기준 x157 y3184, 1607x1607, 가로는 화면 중앙 근처 */}
      <div
        className="absolute left-[8.177vw] top-[49.89%] w-[83.698vw] h-[83.698vw] rounded-full opacity-50 mix-blend-screen"
        style={{ backgroundImage: blueGlow }}
      />
    </div>
  );
}
