// 공용 배경 레이어 (Figma 1178:492 "bg", 2026-08-28 답변)
// Hero 하단부터 Footer까지 여러 섹션 뒤를 한 장으로 관통하는 배경.
// Hero 자체 배경이 완전히 불투명해서 Hero 구간에서는 가려지고,
// Big Text의 위→아래 투명 그라디언트가 옅어지면서부터 드러나는 구조.
const starField = "/images/bg/star_field.jpg";
const blueGlow = "radial-gradient(circle, #386FB7 0%, rgba(0,111,255,0) 83%)";
const purpleGlow = "radial-gradient(circle, #722FF6 0%, rgba(26,0,255,0) 83%)";

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
