import {
  Trophy, Disc, Globe, Video
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function InfoSection() {
  const { t } = useLanguage();

  const eligibilityItems = [
    { icon: "https://i.imgur.com/TMv5uek.png", title: t('info.eligibility.item1.title'), desc: t('info.eligibility.item1.desc') },
    { icon: "https://i.imgur.com/rYtD5h5.png", title: t('info.eligibility.item2.title'), desc: t('info.eligibility.item2.desc') },
    { icon: "https://i.imgur.com/XT0kTYg.png", title: t('info.eligibility.item3.title'), desc: t('info.eligibility.item3.desc') },
    { icon: "https://i.imgur.com/quRXU3v.png", title: t('info.eligibility.item4.title'), desc: t('info.eligibility.item4.desc') },
  ];

  const awardItems = [
    { icon: Disc, title: t('info.awards.item1.title'), desc: t('info.awards.item1.desc') },
    { icon: Globe, title: t('info.awards.item2.title'), desc: t('info.awards.item2.desc') },
    { icon: Video, title: t('info.awards.item3.title'), desc: t('info.awards.item3.desc') },
  ];

  return (
    <section id="info" className="w-full relative overflow-hidden bg-transparent">

      {/* 1. Eligibility Section */}
      <div
        className="w-full min-h-[710px] py-[120px] px-6 xl:px-[208px] flex flex-col items-start self-stretch"
      >
        <div className="w-full flex flex-col items-start gap-[62px]">
          {/* Header */}
          <div className="flex flex-col items-center gap-[12px] self-stretch text-center">
            <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
              {t('info.eligibility.subtitle')}
            </span>
            <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none">
              {t('info.eligibility.title')}
            </h2>
            <p className="text-[#7D7D7D] max-w-2xl mt-3 md:text-[22px] font-semibold leading-relaxed break-keep whitespace-pre-line">
              {t('info.eligibility.desc')}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col items-center gap-[24px] self-stretch w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[30px] gap-y-[24px] items-stretch max-w-7xl mx-auto w-full">
              {eligibilityItems.map((item, idx) => {
                const isTypeOne = idx === 0 || idx === 3;
                const gradient = isTypeOne
                  ? 'linear-gradient(98deg, #B4FFF9 3.14%, #E9FFFD 96.88%), rgba(255, 255, 255, 0.70)'
                  : 'linear-gradient(99deg, #A4FFC7 2.06%, #F2FFF7 96.87%), rgba(255, 255, 255, 0.70)';

                return (
                  <div
                    key={idx}
                    className="rounded-[48px] border-2 border-white flex flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all px-8 md:px-12 py-10"
                    style={{ background: gradient }}
                  >
                    {/* 텍스트 영역: whitespace-pre-line 복구! */}
                    <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                      <h4 className="font-nanumSquareNeo font-extrabold text-[#101828] mb-2 leading-[1.2] tracking-[-1.2px] text-[22px] md:text-[30px] whitespace-pre-line">
                        {item.title}
                      </h4>
                      {item.desc && (
                        <p className="text-[#101828] text-[15px] md:text-[16px] font-medium leading-relaxed opacity-70 whitespace-pre-line">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    {/* 아이콘 영역: 너비를 적절히 제한하여 글자 공간 확보 */}
                    <div className="flex-shrink-0 w-[100px] h-[100px] md:w-[140px] md:h-[140px] flex justify-center items-center">
                      <img
                        src={item.icon}
                        alt=""
                        className={`w-full h-full object-contain ${idx === 1 || idx === 2 ? 'p-4 md:p-5' : 'p-1'}`}
                      />
                    </div>
                  </div>
                ); // map return 끝
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Awards Section */}
      <div className="container mx-auto px-4 pt-24 mb-32">
        <div id="awards" className="scroll-mt-24">
          <div className="text-center mb-16">
            <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
              {t('info.awards.subtitle')}
            </span>
            <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none mt-4">
              {t('info.awards.title')}
            </h2>
            <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line tracking-[-0.03em] md:text-[22px] font-semibold">
              {t('info.awards.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
            {/* Grand Prize Card */}
            <div className="relative bg-[#0084d1] border border-sky-400 p-8 rounded-[32px] flex flex-col items-center text-center shadow-[0_25px_50px_-12px_rgba(2,74,112,0.5)] w-full overflow-hidden transform hover:scale-105 transition-transform duration-300 min-h-[320px] justify-center">
              <div className="absolute top-0 right-0 bg-white text-[#0084d1] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                {t('info.awards.grandPrize.badge')}
              </div>
              <div className="bg-white/20 p-5 rounded-full mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{t('info.awards.grandPrize.title')}</h4>
              <p className="text-sky-100 font-medium">{t('info.awards.grandPrize.benefit')}</p>
            </div>

            {/* Top 7 Benefit Cards */}
            {awardItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-white/70 p-8 rounded-[32px] flex flex-col items-center text-center hover:border-sky-400/50 transition-colors transform hover:-translate-y-1 duration-300 shadow-sm min-h-[320px] justify-center"
              >
                <div className="bg-sky-100/60 p-5 rounded-full mb-6">
                  <item.icon className="w-10 h-10 text-sky-500" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-[20px]">{item.title}</h4>
                <p className="text-gray-600 text-[14px] leading-relaxed break-keep">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}