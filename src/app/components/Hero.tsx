import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const image_6adb3ad903c1e8b4f2a5025fc3714b804847f5b0 = "https://i.imgur.com/yXB6sBo.png";
const imgLogo = "https://i.imgur.com/NdVOBXQ.png";
const imgTagline = "https://i.imgur.com/yXB6sBo.png";
const imgBg = "https://i.imgur.com/36mR3vR.jpeg";
const img_tag = "https://i.imgur.com/EdLebEx.png";

export function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="intro"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-[#FEFBEB]" />

      {/* 하늘/풀밭 일러스트 배경 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={imgBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-10 md:gap-12"
        >
          {/* 로고 및 모집 기간 그룹 (더 밀착) */}
          <div className="flex flex-col items-center gap-6 md:gap-10">
            {/* 로고 및 태그라인 그룹 */}
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <div className="flex flex-col items-center gap-8 md:gap-10">
                {/* 로고 슬롯 1 - 상단 이미지퐁당 5주년*/}
                <div className="flex justify-center">
                  <img
                    src={lang === "en" ? "https://i.imgur.com/Mvwg170.png" : img_tag}
                    alt={t("hero.tagline")}
                    className={`w-full ${lang === "en" ? "max-w-[300px] md:max-w-[400px]" : "max-w-[190px] md:max-w-[260px]"} h-auto object-contain`}
                  />
                </div>

                {/* 로고 슬롯 2 - 태그라인 이미지 */}
                <div className="flex justify-center w-full">
                  <img
                    src={lang === "en" ? "https://i.imgur.com/8NPYy8S.png" : image_6adb3ad903c1e8b4f2a5025fc3714b804847f5b0}
                    alt={t("hero.tagline")}
                    className="w-full max-w-[370px] md:max-w-[500px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* 힐링보이스 로고 */}
              <div className="flex justify-center w-full px-4 md:px-0">
                <img
                  src={lang === "en" ? "https://i.imgur.com/czHtSNl.png" : imgLogo}
                  alt="힐링보이스"
                  className="w-full max-w-[350px] md:max-w-[640px] h-auto object-contain filter saturate-[1.2] brightness-[1.05] drop-shadow-md"
                />
              </div>
            </div>

            {/* 모집 기간 뱃지 (노랑-연두) - 로고 그룹에 더 가깝게 배치 */}
            <div className="bg-[#e9ed7f] rounded-[10px] shadow-sm px-[16px] md:px-[20px] py-[10px] md:py-[12px]">
              <p className="font-medium text-[#101828] text-[15px] md:text-[18px] text-center break-words break-keep whitespace-pre-wrap">
                {t("hero.period")}
              </p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full max-w-lg px-2 md:px-0 auto-rows-fr">
            <button
              onClick={() =>
                document
                  .getElementById("steps")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 bg-[#00a6f4] hover:bg-[#0095e0] text-white font-bold text-[15px] md:text-lg px-6 py-3.5 md:py-3 rounded-[24px] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.4)] whitespace-nowrap h-full"
            >
              {t("hero.downloadBtn")}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("info")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 bg-white hover:bg-sky-50 text-[#44a9ff] font-bold text-[15px] md:text-lg px-6 py-3.5 md:py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,135,190,0.2)] whitespace-nowrap h-full"
            >
              {t("hero.infoBtn")}
              <ArrowRight className="w-5 h-5 text-[#44a9ff] shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}