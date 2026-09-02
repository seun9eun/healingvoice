import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { Awards } from "../components/Awards";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { BigText } from "../components/BigText";
import { Cast } from "../components/Cast";
import { DeadlineModal } from "../components/DeadlineModal";

// 랜딩 페이지 = 실제로 사용자가 보게 되는 메인 화면 하나를 이 순서대로 위에서 아래로 쌓은 것.
// 각 섹션 컴포넌트(Hero, BigText 등)는 전부 내부에서 useLanguage()로 직접 언어(ko/en)를 가져가므로
// 이 페이지에서 lang을 별도로 관리하거나 prop으로 넘겨줄 필요가 없다(2026-09-02: YouTubeEmbed도 통일).
export function LandingPage() {
  // 참가자 모집 종료 모달 자동 노출 비활성화 (국/영문 공통)
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);

  useEffect(() => {
    // 콘솔에서 openModal() 호출 시에만 반응하는 리스너 (수동 테스트용)
    const handleManualOpen = () => setShowDeadlineModal(true);
    window.addEventListener("open-deadline-modal", handleManualOpen);

    return () => {
      window.removeEventListener("open-deadline-modal", handleManualOpen);
    };
  }, []);

  return (
    <>
      <DeadlineModal
        isOpen={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
      />
      <Hero />
      <BigText />
      <YouTubeEmbed />
      <Cast />
      <Awards />
    </>
  );
}
