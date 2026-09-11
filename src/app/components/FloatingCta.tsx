import { useLanguage } from "../context/LanguageContext";
import { FONDANT_CONTENT_URL } from "../constants/links";

// 화면 오른쪽 아래에 떠 있는 "콘텐츠 보기" 버튼 (Figma 1885:3162).
// 보이스 섹션의 "콘텐츠 보기" CTA와 같은 곳으로 간다(2026-09-11 사용자 확인).
//
// PC 전용이다 — 모바일 레이아웃에는 이 버튼이 없다(2026-09-11 사용자 확인).
// 다른 섹션과 달리 vw가 아니라 px를 쓴다. 화면이 넓어져도 버튼 크기와 벽/바닥까지의 거리가
// 그대로여야 한다는 요구라서, 여기서만 반응형 환산을 하지 않는다.
const SIZE = 112;
const INSET = 40; // 오른쪽 벽 / 바닥에서의 거리
// 아이콘+문구 묶음은 정가운데가 아니라 약간 위에 있다.
// Figma 에셋(3배수 PNG)을 실측하면 아이콘 잉크(그려진 부분) 상단이 원 위에서 24.7(국문)·26.7(영문)인데,
// 그냥 가운데 정렬하면 6px가량 내려간다. 아래 12px를 빼면 둘 다 1px 안으로 들어맞는다.

const iconNote = "/images/fab/icon_note.svg";

export function FloatingCta() {
  const { lang, t } = useLanguage();

  return (
    <a
      href={FONDANT_CONTENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      // z-50인 헤더보다는 위, z-[100]인 인물 모달보다는 아래에 둔다.
      // 모달이 열리면 딤(rgba(6,30,73,0.8))이 이 버튼까지 덮어야 한다.
      className="fixed z-[90] hidden md:flex flex-col items-center justify-center pb-[12px] rounded-full bg-[#6276FB] transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4D3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061E49]"
      style={{
        width: SIZE,
        height: SIZE,
        right: INSET,
        bottom: INSET,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        // 2px 그라디언트 테두리. border-image는 border-radius와 같이 못 쓰기 때문에,
        // 배경 두 겹(안쪽은 단색, 바깥은 그라디언트)을 각각 padding-box/border-box에 깔아
        // 테두리 자리에만 그라디언트가 보이게 한다.
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(#6276FB, #6276FB), linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <img src={iconNote} alt="" aria-hidden width={25} height={32} />
      <span
        className="mt-[4px] font-sans font-bold leading-none text-white whitespace-nowrap"
        style={{ fontSize: lang === "ko" ? 18 : 15 }}
      >
        {t("voicesSection.cta")}
      </span>
    </a>
  );
}
