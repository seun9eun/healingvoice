import { Hero } from "../components/Hero";
import { InfoSection } from "../components/InfoSection";
import { StepsSection } from "../components/StepsSection";
import { ChecklistSection } from "../components/ChecklistSection";
import { SongListSection } from "../components/SongListSection";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { useLanguage } from "../context/LanguageContext";

export function LandingPage() {
  // ✅ 1. 프로젝트에서 사용 중인 다국어(언어) 상태를 가져옵니다. 
  const { lang } = useLanguage();
  return (
    <>
      <Hero />
{/* 3. 가져온 lang 값을 YouTubeEmbed의 prop으로 넘겨줍니다. */}
      <YouTubeEmbed lang={lang} />
      <InfoSection />
      <StepsSection />
      <SongListSection />
      <ChecklistSection />
    </>
  );
}
