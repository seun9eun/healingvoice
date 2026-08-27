import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { Awards } from "../components/Awards";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { BigText } from "../components/BigText";
import { Cast } from "../components/Cast";
import { DeadlineModal } from "../components/DeadlineModal";
import { useLanguage } from "../context/LanguageContext";

export function LandingPage() {
  const { lang } = useLanguage();

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
      <YouTubeEmbed lang={lang} />
      <Cast />
      <Awards />
    </>
  );
}
