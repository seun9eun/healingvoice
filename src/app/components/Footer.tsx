import { Phone, ExternalLink, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 맨 아래 Footer 섹션. 반응형 단위/모바일-PC 분기 방식은 Cast.tsx 맨 위 주석 참고.
// (이 파일은 다른 섹션과 달리 스크롤 등장 모션(Reveal)을 적용하지 않음 — 2026-09-01 사용자 확인)
// Figma Footer 참고 스크린샷 확인 결과 로고는 Header와 동일한 그라디언트 로고였음(레이어명은 "HEALING VOICE"였지만 실제 이미지는 국문 로고)
const logoImage_w = "/images/header/healingvoice_logo.png";
const logoImageEn_w = "/images/footer/healingvoice_logo_en.png"; // 2026-08-31 Figma EN 페이지 답변으로 원본 에셋 확보
const CgnlogoImage = "https://i.imgur.com/N6ZvM5s.png";
const FondantLogoImage = "https://i.imgur.com/yZuLvLq.png";

export function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="w-full px-[4.1026vw] md:px-[10vw] py-[12.3077vw] md:py-[2.5vw]">
      {/* 국문 모바일 스펙 확인(2026-09-01): 좌우 분할이 아니라 좌측 정렬된 단일 세로 스택
          390px 기준 vw 변환(2026-09-01): 840px 미만에서 구조 유지한 채 유동적으로 스케일 */}
      <div className="w-full max-w-[1536px] mx-auto flex flex-col md:flex-row items-start gap-[8.2051vw] md:gap-[1.6667vw] px-0 md:px-[0.8333vw]">
        {/* 좌측: 로고 + 연락처 */}
        <div className="flex flex-col items-start gap-[3.9744vw] md:gap-[0.8333vw] w-full md:flex-1 min-w-0">
          <img
            src={lang === "en" ? logoImageEn_w : logoImage_w}
            alt="HEALING VOICE"
            className="h-[8.2051vw] md:h-[2.0833vw] w-auto object-contain"
          />

          <div className="flex flex-wrap items-center justify-start gap-[2.0513vw] md:gap-[0.4167vw]">
            <span className="flex items-center gap-[2.0513vw] md:gap-[0.4167vw]">
              <Phone className="w-[4.1026vw] h-[4.1026vw] md:w-[1.0417vw] md:h-[1.0417vw] text-sky-400" strokeWidth={1.667} />
              <span className="text-[3.5897vw] md:text-[0.7292vw] leading-[6.1538vw] md:leading-6 text-[#E2E2E2]">{t("footer.phone")}</span>
            </span>
            {/* 모바일/데스크탑 운영시간 시작 시각이 달라서(모바일 10:00, 데스크탑 09:00) 반응형으로 분리 표시 */}
            <span className="md:hidden text-[3.0769vw] leading-[5.1282vw] text-[#E2E2E2]">{t("footer.phoneHoursMobile")}</span>
            <span className="hidden md:inline md:text-[0.6771vw] leading-5 text-[#E2E2E2] opacity-80">
              {t("footer.phoneHours")}
            </span>
          </div>

          {lang === "ko" ? (
            <a
              href="https://pf.kakao.com/_wrKzX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[2.0513vw] md:gap-[0.4167vw] text-[#E2E2E2] hover:text-sky-400 transition-colors"
            >
              <ExternalLink className="w-[5.1282vw] h-[5.1282vw] md:w-[1.0417vw] md:h-[1.0417vw] text-sky-400" strokeWidth={1.667} />
              <span className="text-[4.1026vw] md:text-[0.8333vw] leading-[6.1538vw] md:leading-6">{t("footer.kakao")}</span>
            </a>
          ) : (
            // 영문판은 카카오톡 채널 대신 이메일 링크로 채널 자체가 바뀜(2026-08-31 확인)
            <a
              href={`mailto:${t("footer.email")}`}
              className="flex items-center gap-[2.0513vw] md:gap-[0.4167vw] text-[#E2E2E2] hover:text-sky-400 transition-colors"
            >
              <Mail className="w-[5.1282vw] h-[5.1282vw] md:w-[1.0417vw] md:h-[1.0417vw] text-sky-400" strokeWidth={1.667} />
              <span className="text-[4.1026vw] md:text-[0.8333vw] leading-[6.1538vw] md:leading-6">{t("footer.email")}</span>
            </a>
          )}
        </div>

        {/* 우측: CGN/Fondant 링크 + 카피라이트 */}
        <div className="flex flex-col items-start md:items-end gap-[4.1026vw] md:gap-[0.8333vw] w-full md:flex-1 min-w-0">
          <div className="flex items-center gap-[3.0769vw] md:gap-[0.625vw]">
            <a
              href="https://www.cgnkorea.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-[1.0256vw] md:rounded px-[4.1026vw] py-[2.0513vw] md:px-[0.8333vw] md:py-[0.4167vw] hover:opacity-80 transition-opacity"
            >
              <img src={CgnlogoImage} alt="CGN" className="h-[6.1538vw] md:h-[1.25vw] object-contain" />
            </a>
            <a
              href="https://www.fondant.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-[1.0256vw] md:rounded px-[4.1026vw] py-[2.0513vw] md:px-[0.8333vw] md:py-[0.4167vw] hover:opacity-80 transition-opacity"
            >
              <img src={FondantLogoImage} alt="Fondant" className="h-[6.1538vw] md:h-[1.25vw] object-contain" />
            </a>
          </div>
          <p className="text-[3.5897vw] md:text-[0.6771vw] leading-[5.1282vw] md:leading-5 text-[#C2CAD9]">
            Copyright © CGN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
