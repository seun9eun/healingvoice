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

export function LandingPage() {
  const { lang } = useLanguage();

  // 5월 1일 지원 마감 모달 로직
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);

  useEffect(() => {
    const DEADLINE = new Date("2026-05-01T00:00:00+09:00").getTime();
    const isClosed = Date.now() >= DEADLINE;
    if (isClosed) {
      setShowDeadlineModal(true);
    }
  }, []);

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
