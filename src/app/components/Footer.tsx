import { Phone, ExternalLink, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// 이미지 경로 변수
const CgnlogoImage = "https://i.imgur.com/N6ZvM5s.png";
const FondantLogoImage = "https://i.imgur.com/yZuLvLq.png";
const logoImage_bl = "https://i.imgur.com/NdVOBXQ.png";
const logoImage_w = "https://i.imgur.com/CXq2kw9.png";
const logoImageEn = "https://i.imgur.com/czHtSNl.png"; // 영문 로고 

export function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer className="bg-[#101828] text-gray-400 py-12 border-t border-white/10">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="mb-2">
                  <img 
                    src={lang === "en" ? logoImageEn : logoImage_w} 
                    alt="HEALING VOICE" 
                    className="h-6 md:h-7 w-auto object-contain" 
                  />
          </h3>
          <p className="flex items-center gap-2 text-[#e2e2e2]">
            <Phone className="w-5 h-5 text-sky-400" />
            {t('footer.phone')}{" "}
            <span className="text-sm">{t('footer.phoneHours')}</span>
          </p>
          {lang === "ko" ? (
            <a
              href="https://pf.kakao.com/_wrKzX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-sky-400 transition-colors text-[#e2e2e2]"
            >
              <ExternalLink className="w-5 h-5 text-sky-400" />
              {t('footer.kakao')}
            </a>
          ) : (
            <div className="flex items-center gap-2 text-[#e2e2e2]">
              <Mail className="w-5 h-5 text-sky-400" />
              {t('footer.email')}
            </div>
          )}
        </div>

        <div className="md:text-right">
          <div className="flex flex-wrap gap-3 md:justify-end mb-4">
            {/* CGN Logo Button */}
            <a
              href="https://www.cgnkorea.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors group bg-[#ffffff8f]"
            >
              {/* ✅ 수정한 부분: span 대신 img 태그 사용 */}
              <img
                src={CgnlogoImage}
                alt="CGN"
                className="h-6 object-contain"
              />
            </a>

            {/* Fondant Logo Button */}
            <a
              href="https://www.fondant.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors group bg-[#ffffff8f]"
            >
              {/* ✅ 수정한 부분: 만약 퐁당 로고 변수가 따로 없다면 일단 텍스트나 다른 이미지를 넣어야 해요 */}
              <img
                src={FondantLogoImage}
                alt="Fondant"
                className="h-6 object-contain"
              />
            </a>
          </div>

          <p className="text-sm text-[#c2cad9]">
            Copyright © CGN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}