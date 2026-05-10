import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { InfoSection } from "../components/InfoSection";
import { StepsSection } from "../components/StepsSection";
import { ChecklistSection } from "../components/ChecklistSection";
import { SongListSection } from "../components/SongListSection";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { TaglineSection } from "../components/TaglineSection";
import { DeadlineModal } from "../components/DeadlineModal";
import { useLanguage } from "../context/LanguageContext";
import { getDeadlineDate } from "../constants/deadline";

export function LandingPage() {
  const { lang } = useLanguage();

  // 지원 마감 시간 설정 (중앙 상수 참조)
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [hasBeenShownForLang, setHasBeenShownForLang] = useState("");

  useEffect(() => {
    const checkDeadline = () => {
      const DEADLINE = new Date(getDeadlineDate()).getTime();
      const isClosed = Date.now() >= DEADLINE;
      
      // 마감되었고, 현재 언어에 대해 아직 팝업을 보여준 적이 없을 때만 띄움
      if (isClosed && hasBeenShownForLang !== lang) {
        setShowDeadlineModal(true);
        setHasBeenShownForLang(lang);
      }
    };

    checkDeadline();
    const timer = setInterval(checkDeadline, 1000); // 1초마다 체크

    // 콘솔에서 openModal() 호출 시 반응하는 리스너
    const handleManualOpen = () => setShowDeadlineModal(true);
    window.addEventListener("open-deadline-modal", handleManualOpen);

    return () => {
      clearInterval(timer);
      window.removeEventListener("open-deadline-modal", handleManualOpen);
    };
  }, [lang, hasBeenShownForLang]); 

  return (
    <>
      <DeadlineModal
        isOpen={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
      />
      <Hero />
      <TaglineSection />
      <YouTubeEmbed lang={lang} />
      <InfoSection />
      <StepsSection />
      <SongListSection />
      <ChecklistSection />
    </>
  );
}
