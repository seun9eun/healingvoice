import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const image_6adb3ad903c1e8b4f2a5025fc3714b804847f5b0 = "https://i.imgur.com/yXB6sBo.png";//태그라인
const imgLogo = "https://i.imgur.com/NdVOBXQ.png"; //힐링보이스 파란색
const imgBg = "https://i.imgur.com/36mR3vR.jpeg"; //배경
const img_tag = "https://i.imgur.com/Mcg4fyA.png"; //퐁당 5주년 특별기획

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
          className="flex flex-col items-center gap-10 md:gap-10"
        >
          {/* 로고 및 모집 기간 그룹 (더 밀착) */}
          <div className="flex flex-col items-center gap-4 md:gap-6">
            {/* 로고 및 태그라인 그룹 */}
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <div className="flex flex-col items-center gap-5 md:gap-7">
                {/* 로고 슬롯 1 - 상단 이미지퐁당 5주년*/}
                <div className="flex justify-center">
                  <img
                    src={lang === "en" ? "https://i.imgur.com/Mvwg170.png" : img_tag}
                    alt={t("hero.tagline")}
                    className={`w-full ${lang === "en" ? "max-w-[360px] md:max-w-[480px]" : "max-w-[230px] md:max-w-[310px]"} h-auto object-contain`}
                  />
                </div>

                {/* 로고 슬롯 2 - 태그라인 이미지 */}
                <div className="flex justify-center w-full">
                  <img
                    src={lang === "en" ? "https://i.imgur.com/8NPYy8S.png" : image_6adb3ad903c1e8b4f2a5025fc3714b804847f5b0}
                    alt={t("hero.tagline")}
                    className="w-full max-w-[440px] md:max-w-[600px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* 힐링보이스 로고 */}
              <div className="flex justify-center w-full px-4 md:px-0">
                <img
                  src={lang === "en" ? "https://i.imgur.com/czHtSNl.png" : imgLogo}
                  alt="힐링보이스"
                  className="w-full max-w-[420px] md:max-w-[600px] h-auto object-contain filter saturate-[1.2] brightness-[1.05] drop-shadow-md"
                />
              </div>
            </div>

            {/* 모집 기간 뱃지 (노랑-연두) - 로고 그룹에 더 가깝게 배치 */}
            <div className="bg-[#e9ed7f] rounded-[10px] shadow-sm px-[16px] md:px-[20px] py-[10px] md:py-[12px]">
              <p className="font-bold text-[#101828] text-[18px] md:text-[22px] text-center break-words break-keep whitespace-pre-wrap">
                {t("hero.period")}
              </p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full px-4 md:px-0">
            <button
              onClick={() =>
                document
                  .getElementById("steps")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto min-w-[180px] md:min-w-[200px] bg-[#00a6f4] hover:bg-[#0095e0] text-white font-bold text-[15px] md:text-lg px-6 py-3.5 md:py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.4)] whitespace-nowrap"
            >
              {t("hero.downloadBtn")}
            </button>
            <a
              href="https://www.fondant.kr/event/000a0b29-52d8-dbdf-f6fb-d91118000095"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[180px] md:min-w-[200px] bg-[#6a71f0] hover:bg-[#5b63eb] text-white font-bold text-[15px] md:text-lg px-6 py-3.5 md:py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(106,113,240,0.3)] whitespace-nowrap hover:scale-105 active:scale-95"
            >
              {t("hero.infoBtn")}
              <ArrowUpRight className="w-5 h-5 text-[#00E5FF] shrink-0" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}