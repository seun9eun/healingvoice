import { 
  Users, UserCheck, HeartHandshake, Mic,
  Trophy, Disc, Globe, Video
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function InfoSection() {
  const { t } = useLanguage();

  const eligibilityItems = [
    { icon: Users, title: t('info.eligibility.item1.title'), desc: t('info.eligibility.item1.desc') },
    { icon: UserCheck, title: t('info.eligibility.item2.title'), desc: t('info.eligibility.item2.desc') },
    { icon: HeartHandshake, title: t('info.eligibility.item3.title'), desc: t('info.eligibility.item3.desc') },
    { icon: Mic, title: t('info.eligibility.item4.title'), desc: t('info.eligibility.item4.desc') },
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
        className="w-full min-h-[710px] py-[120px] px-6" 
        style={{ background: 'linear-gradient(180deg, #E4F3FF 0%, #BADFFF 100%)' }}
      >
        {/* 콘텐츠 중앙 정렬 및 최대 너비 제한 (2042 - 269*2 = 1504px) */}
        <div className="max-w-[1504px] mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px] block mb-3">
              {t('info.eligibility.subtitle')}
            </span>
            <h2 className="text-4xl md:text-[48px] font-bold text-gray-900 leading-tight">
              {t('info.eligibility.title')}
            </h2>
            <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-6 md:text-[22px] font-semibold leading-relaxed break-keep whitespace-pre-line">
              {t('info.eligibility.desc')}
            </p>
          </div>
      
          {/* Grid: 1504px 안에서 4등분 됨 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibilityItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-md border border-white rounded-[32px] flex flex-col items-center text-center h-full shadow-sm hover:shadow-md transition-all px-[40px] pt-[56px] pb-[30px] bg-[#ffffff]"
              >
                {/* 아이콘 */}
                <div className="flex-shrink-0 bg-[#E4F3FF] p-5 rounded-3xl mb-8">
                  <item.icon className="w-10 h-10 text-[#00BCFF]" />
                </div>
          
                {/* 텍스트 */}
                <div className="flex flex-col items-center">
                  <h4 className="font-bold text-gray-900 mb-4 leading-snug break-keep text-[22px]">
                    {item.title}
                  </h4>
                  {item.desc && (
                    <p className="text-[#7D7D7D] text-[14px] font-medium leading-[20px] tracking-normal text-center break-keep">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
              {t('info.awards.title')}
            </h2>
            <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line tracking-[-0.03em] md:text-[22px] font-semibold">
              {t('info.awards.desc')}
            </p>
          </div>

          {/* Awards Layout */}
          <div className="flex flex-col items-center gap-6 max-w-5xl mx-auto">
             
             {/* Grand Prize */}
             <div
                className="relative bg-[#0084d1] border border-sky-400 p-10 rounded-2xl flex flex-col items-center text-center shadow-[0_25px_50px_-12px_rgba(2,74,112,0.5)] w-full max-w-sm overflow-hidden transform hover:scale-105 transition-transform duration-300"
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

             {/* Divider */}
             <div className="w-full flex items-center gap-4 py-8">
                <div className="h-px bg-gray-300/60 flex-grow"></div>
             </div>

             {/* Other Awards */}
             <div className="grid md:grid-cols-3 gap-6 w-full">
                {awardItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/100 backdrop-blur-sm border border-white/70 p-8 rounded-2xl flex flex-col items-center text-center hover:border-sky-400/50 transition-colors transform hover:-translate-y-1 duration-300 shadow-sm bg-[#ffffff]"
                  >
                    <div className="bg-sky-100/60 p-4 rounded-full mb-4">
                      <item.icon className="w-8 h-8 text-sky-500" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-[20px]">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
             </div>

          </div>
        </div>
      </div>

    </section>
  );
}