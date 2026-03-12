import { useLanguage } from "../context/LanguageContext";

export function InfoSection() {
  const { t } = useLanguage();

  const eligibilityItems = [
    { icon: "https://i.imgur.com/TMv5uek.png", title: t('info.eligibility.item1.title'), desc: t('info.eligibility.item1.desc') },
    { icon: "https://i.imgur.com/rYtD5h5.png", title: t('info.eligibility.item2.title'), desc: t('info.eligibility.item2.desc') },
    { icon: "https://i.imgur.com/XT0kTYg.png", title: t('info.eligibility.item3.title'), desc: t('info.eligibility.item3.desc') },
    { icon: "https://i.imgur.com/quRXU3v.png", title: t('info.eligibility.item4.title'), desc: t('info.eligibility.item4.desc') },
  ];

  // The first image is assigned to the Grand Prize separately below.
  const grandPrizeIcon = "https://i.imgur.com/MIxVFwH.png";

  // The remaining 3 images are assigned to the small cards.
  const awardItems = [
    { icon: "https://i.imgur.com/nrHZKUb.png", title: t('info.awards.item1.title'), desc: t('info.awards.item1.desc') },
    { icon: "https://i.imgur.com/OwvapbK.png", title: t('info.awards.item2.title'), desc: t('info.awards.item2.desc') },
    { icon: "https://i.imgur.com/Ewenhqg.png", title: t('info.awards.item3.title'), desc: t('info.awards.item3.desc') },
  ];

  return (
    <section id="info" className="w-full relative overflow-hidden bg-transparent">

      {/* 1. Eligibility Section */}
      <div className="w-full min-h-[710px] py-[120px] px-6 xl:px-[208px] flex flex-col items-start self-stretch">
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
                    {/* 텍스트 영역 */}
                    <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                      <h4 className="font-nanumSquareNeo font-extrabold text-[#101828] mb-2 leading-[1.2] tracking-[-1.2px] text-[22px] md:text-[30px] whitespace-pre-line break-keep">
                        {item.title}
                      </h4>
                      {item.desc && (
                        <p className="text-[#101828] text-[15px] md:text-[16px] font-medium leading-relaxed opacity-70 whitespace-pre-line break-keep">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    {/* 아이콘 영역 */}
                    <div className="flex-shrink-0 w-[100px] h-[100px] md:w-[140px] md:h-[140px] flex justify-center items-center">
                      <img
                        src={item.icon}
                        alt=""
                        className={`w-full h-full object-contain ${idx === 1 || idx === 2 ? 'p-4 md:p-5' : 'p-1'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Awards Section */}
      <section id="awards" className="flex flex-col items-center w-full py-[120px] gap-[64px] scroll-mt-24">

        {/* Header Text Container */}
        <div className="text-center px-4">
          <span className="text-[#44A9FF] font-bold uppercase tracking-widest text-[16px]">
            {t('info.awards.subtitle')}
          </span>
          <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none mt-4">
            {t('info.awards.title')}
          </h2>
          <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line tracking-[-0.03em] md:text-[22px] font-semibold">
            {t('info.awards.desc')}
          </p>
        </div>

        {/* Card Container */}
        <div className="flex flex-col items-center w-full max-w-[1024px] gap-[24px] px-4">

          {/* Big Card */}
          <div
            className="relative flex flex-col justify-center items-start w-full px-8 py-10 md:px-[80px] md:py-[56px] rounded-[48px] border-2 border-[#D3EBFF] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden"
            style={{
              background: 'linear-gradient(0deg, #44A9FF 0%, #44A9FF 100%), linear-gradient(98deg, #F5FF96 2.73%, #FCFFE4 97.35%), rgba(255, 255, 255, 0.70)'
            }}
          >
            <div className="z-10 bg-white text-[#44A9FF] text-[14px] md:text-[16px] font-bold px-4 py-2 rounded-full mb-4 shadow-sm">
              {t('info.awards.grandPrize.title')} {/* Example: 최종 우승자 1인 */}
            </div>
            <h3 className="z-10 text-white font-extrabold text-[32px] md:text-[48px] leading-tight tracking-tight">
              {t('info.awards.grandPrize.benefit')} {/* Example: 상금 3,000만원 */}
            </h3>

            {/* Trophy Image Placeholder */}
            <div className="absolute right-[-20px] bottom-[-20px] md:right-[40px] md:bottom-[-10px] pointer-events-none">
              <Trophy className="w-48 h-48 md:w-[240px] md:h-[240px] text-yellow-300 drop-shadow-md" fill="currentColor" />
            </div>
          </div>

          {/* Small Cards Wrapper */}
          <div className="flex flex-col md:flex-row w-full gap-[24px]">
            {awardItems.map((item, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-start flex-1 pt-[40px] px-[32px] pb-[80px] rounded-[48px] border-2 border-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] backdrop-blur-[6px] overflow-visible group"
                style={{
                  background: 'linear-gradient(98deg, #B4FFF9 3.14%, #E9FFFD 96.88%), linear-gradient(137deg, #B5F8FF 4.05%, #C7FFD1 98.24%), rgba(255, 255, 255, 0.70)'
                }}
              >

                <div className="z-10">
                  <h4 className="font-extrabold text-gray-900 mb-2 text-[20px]">{item.title}</h4>
                  <p className="text-gray-600 text-[14px] leading-relaxed break-keep font-medium">{item.desc}</p>
                </div>

                {/* Small Icons */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <item.icon className="w-14 h-14 md:w-16 md:h-16 text-[#45D3C2]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </section>
  );
}