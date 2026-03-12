import {
  Users, UserCheck, HeartHandshake, Mic,
  Trophy, Disc, Globe, Video
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function InfoSection() {
  const { t } = useLanguage();

  const eligibilityItems = [
    { icon: "https://i.imgur.com/quRXU3v.png", title: t('info.eligibility.item1.title'), desc: t('info.eligibility.item1.desc') },
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
    // 상위 section에서 padding과 container 제한을 없애고 100% 너비로 설정합니다.
    <section id="info" className="w-full relative overflow-hidden bg-transparent">

      {/* =========================================
          1. Eligibility Section (배경 꽉 차게)
      ========================================= */}
      <div
        className="w-full min-h-[710px] py-[120px] px-6 xl:px-[208px] flex flex-col items-start self-stretch"
        style={{ background: 'linear-gradient(180deg, #E4F3FF 0%, #BADFFF 100%)' }}
      >
        {/* 콘텐츠 영역: 세로 배치, 왼쪽 정렬, 간격 62px 적용 */}
        <div className="w-full flex flex-col items-start gap-[62px]">

          {/* Header: 왼쪽 정렬로 변경 */}
          <div className="text-left">
            <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px] block mb-3">
              {t('info.eligibility.subtitle')}
            </span>
            <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none">
              {t('info.eligibility.title')}
            </h2>
            <p className="text-[#7D7D7D] max-w-2xl mt-6 md:text-[22px] font-semibold leading-relaxed break-keep whitespace-pre-line">
              {t('info.eligibility.desc')}
            </p>
          </div>

          {/* Grid: 1504px 안에서 2*2 그리드, 간격 30px 및 상단 정렬 적용 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] items-start max-w-7xl mx-auto self-stretch">
            {eligibilityItems.map((item, idx) => {
              const isTypeOne = idx === 0 || idx === 3; // 1번, 4번 (0-indexed)
              const gradient = isTypeOne
                ? 'linear-gradient(98deg, #B4FFF9 3.14%, #E9FFFD 96.88%), rgba(255, 255, 255, 0.70)'
                : 'linear-gradient(99deg, #A4FFC7 2.06%, #F2FFF7 96.87%), rgba(255, 255, 255, 0.70)';

              return (
                <div
                  key={idx}
                  className="rounded-[48px] border-2 border-white flex flex-row items-center justify-between gap-8 h-full shadow-sm hover:shadow-md transition-all px-16 py-12"
                  style={{ background: gradient }}
                >
                  {/* 텍스트 영역: 중앙 정렬 및 가득 차게 설정 */}
                  <div className="flex flex-col justify-center flex-1 self-stretch text-left">
                    <h4 className="font-nanumSquareNeo font-extrabold text-[#101828] mb-3 leading-[1.2] tracking-[-1.6px] break-keep text-[24px] md:text-[32px] whitespace-pre-line">
                      {item.title}
                    </h4>
                    {item.desc && (
                      <p className="text-[#101828] text-[15px] md:text-[17px] font-medium leading-relaxed tracking-tight break-keep opacity-80">
                        {item.desc}
                      </p>
                    )}
                  </div>

                  {/* 아이콘 (이미지) - 200px 컨테이너 가이드 반영 */}
                  <div className="flex-shrink-0 w-[200px] h-[200px] p-[33.333px] flex flex-col justify-center items-center">
                    <img src={item.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* =========================================
          2. Awards Section (다시 중앙으로 모이게)
      ========================================= */}
      {/* 기존에 최상위에 있던 container 클래스를 Awards 전용으로 옮겼습니다. */}
      <div className="container mx-auto px-4 pt-24 mb-32">
        <div id="awards" className="scroll-mt-24">

          {/* Header */}
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

          {/* Awards Layout: Single 4-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
            {/* Grand Prize Card (Blue) */}
            <div
              className="relative bg-[#0084d1] border border-sky-400 p-8 rounded-[32px] flex flex-col items-center text-center shadow-[0_25px_50px_-12px_rgba(2,74,112,0.5)] w-full overflow-hidden transform hover:scale-105 transition-transform duration-300 min-h-[320px] justify-center"
            >
              <div className="absolute top-0 right-0 bg-white text-[#0084d1] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                {t('info.awards.grandPrize.badge')}
              </div>
              <div className="bg-white/20 p-5 rounded-full mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{t('info.awards.grandPrize.title')}</h4>
              <p className="text-sky-100 font-medium">{t('info.awards.grandPrize.benefit')}</p>
            </div>

            {/* Top 7 Benefit Cards (White) */}
            {awardItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/100 backdrop-blur-sm border border-white/70 p-8 rounded-[32px] flex flex-col items-center text-center hover:border-sky-400/50 transition-colors transform hover:-translate-y-1 duration-300 shadow-sm bg-[#ffffff] min-h-[320px] justify-center"
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