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
          className="flex flex-col items-center gap-4 md:gap-8"
        >
          <div className="max-w-screen-lg mx-auto flex flex-col items-center gap-2">
            {/* 로고 슬롯 1 - 상단 이미지퐁당 5주년*/}
            <div className="flex justify-center w-50">
              <img
                src={img_tag}
                alt={t("hero.tagline")}
                className="w-full max-w-[120px] md:max-w-[160px] h-auto object-contain"
              />
            </div>

            {/* 로고 슬롯 2 - 태그라인 이미지 */}
            <div className="flex justify-center w-full">
              <img
                src={image_6adb3ad903c1e8b4f2a5025fc3714b804847f5b0}
                alt={t("hero.tagline")}
                className="w-full max-w-[280px] md:max-w-[340px] h-auto object-contain"
              />
            </div>
          </div>

          {/* 힐링보이스 로고 */}
          <div className="flex justify-center w-full px-4 md:px-0">
            <img
              src={lang === "en" ? "https://i.imgur.com/czHtSNl.png" : imgLogo}
              alt="힐링보이스"
              className="w-full max-w-[320px] md:max-w-[460px] h-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* 설명 텍스트 컨테이너: max-w를 조금 더 넉넉하게 잡거나 없애서 한 줄 확보 */}
          <div className="text-[#101828] max-w-4xl mx-auto space-y-1.5 md:space-y-2 text-center px-2 md:px-0 mt-2 md:mt-0">

            {/* 첫 번째 줄 */}
            <p className="text-[14px] md:text-[20px] font-semibold leading-relaxed md:leading-[32px] tracking-normal break-words break-keep whitespace-pre-wrap">
              <span>"{t("hero.descPart1")}</span>
              <span>{t("hero.descPart2")}</span>
              <span className="font-black text-[#0084d1]">CCM</span>
              <span>{t("hero.descPart3")}"</span>
            </p>

            {/* 두 번째 줄 */}
            <p className="text-[14px] md:text-[20px] font-semibold leading-relaxed md:leading-[32px] tracking-normal break-words break-keep whitespace-pre-wrap">
              {t("hero.descPart4")}
            </p>

          </div>

          {/* 모집 기간 뱃지 (노랑-연두) */}
          <div className="bg-[#e9ed7f] rounded-[10px] shadow-sm px-[16px] md:px-[20px] py-[10px] md:py-[12px] mt-2 md:mt-0">
            <p className="font-semibold text-[#101828] text-[15px] md:text-[18px] text-center break-words break-keep whitespace-pre-wrap">
              {t("hero.period")}
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-lg mt-2 md:mt-0 px-2 md:px-0 auto-rows-fr">
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