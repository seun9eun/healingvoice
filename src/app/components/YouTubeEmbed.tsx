import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { VIDEO_DATA } from "../data/videoData";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";

export const YouTubeEmbed = ({ lang = "ko" }: { lang: "ko" | "en" }) => {
  const { t } = useLanguage();

  // 1. 주기적인 현재 시간 갱신 (1초마다)
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 현재 시간에 맞춰 오픈 시간이 지난 영상만 필터링
  const allVideos = VIDEO_DATA[lang] || VIDEO_DATA.ko;
  const filteredVideos = allVideos.filter(
    (video) => currentTime >= new Date(video.openTime).getTime()
  );

  // 3. 고정(Pinned) 영상 처리 (최대 1개)
  // 기획: 코드상 여러 개라도 첫 번째 하나만 고정으로 두고 나머지는 일반 순서대로 유지
  const pinnedVideo = filteredVideos.find(v => (v as any).isPinned);
  const otherVideos = filteredVideos.filter(v => v.id !== pinnedVideo?.id);
  const currentVideos = pinnedVideo ? [pinnedVideo, ...otherVideos] : otherVideos;

  // 4. NEW 배지 대상 특정
  // 기획: 데이터상의 0번(가장 최신) 영상에만 NEW를 붙임 (고정 여부와 상관없이 그 영상을 따라감)
  const newestVideoId = filteredVideos.length > 0 ? filteredVideos[0].id : null;

  // 5. 상태 관리
  // 기획: 항상 리스트의 0번(고정 혹은 최신)이 먼저 보이도록 0으로 초기화
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 6. 새로운 영상이 공개되었을 때만 (영상의 갯수가 늘어났을 때) 최신 영상(0번)으로 자동 이동
  const prevVideoCountRef = useRef(currentVideos.length);
  useEffect(() => {
    if (prevVideoCountRef.current > 0 && prevVideoCountRef.current < currentVideos.length) {
      setActiveIndex(0);
    }
    prevVideoCountRef.current = currentVideos.length;
  }, [currentVideos.length]);

  // 7. 언어 변경 시 인덱스 초기화 (첫 번째 영상으로)
  useEffect(() => {
    handleVideoChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);


  // 8. 스크롤 및 인덱스 이동 제어
  const scroll = (direction: "left" | "right") => {
    if (currentVideos.length <= 1) return;
    let nextIndex;
    if (direction === "left") {
      nextIndex = activeIndex === 0 ? currentVideos.length - 1 : activeIndex - 1;
    } else {
      nextIndex = activeIndex === currentVideos.length - 1 ? 0 : activeIndex + 1;
    }
    handleVideoChange(nextIndex);
  };

  const handleVideoChange = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 16; // width + gap(16px)
        container.scrollTo({
          left: index * itemWidth,
          behavior: "smooth",
        });
      }
    }
  };

  // 9. 하단 파란색 스크롤 인디케이터 위치 계산
  const getIndicatorPosition = () => {
    if (currentVideos.length <= 1) return 0;
    return (activeIndex / (currentVideos.length - 1)) * 100;
  };

  if (currentVideos.length === 0) return null;
  const currentVideo = currentVideos[activeIndex] || currentVideos[0];

  return (
    <div className="relative w-full flex flex-col items-center py-[24.6154vw] md:py-[6.25vw] px-[4.1026vw]">
      <div className="flex flex-col items-center gap-[8.2051vw] md:gap-[1.6667vw] w-full max-w-[172.3077vw] md:max-w-[46.667vw]">
        {/* 헤더 영역 — 국문 모바일 스펙 확인(2026-09-01): gap9.5, 제목 40px, 행간35px / 영문은 행간110%(44px, 2026-09-01 확인) */}
        <div className="flex flex-col items-center gap-[2.4359vw] md:gap-[0.8333vw] text-center">
          <span className="text-[#4D94FF] font-bold uppercase tracking-[0.359vw] text-[3.5897vw] md:text-[0.8333vw]">
            {t("gallery.subtitle")}
          </span>
          <h2
            className={`text-[10.2564vw] ${lang === "en" ? "leading-[11.2821vw]" : "leading-[8.9744vw]"} md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text`}
            style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("gallery.title")}
          </h2>
          <p
            className={`max-w-[172.3077vw] md:max-w-[35vw] text-[#D4EBFF] text-[4.1026vw] md:text-[1.1458vw] leading-[1.5] ${
              lang === "en" ? "whitespace-nowrap font-light" : "whitespace-pre-line font-normal"
            }`}
          >
            {t("gallery.desc")}
          </p>
        </div>

        {/* 메인 비디오 플레이어 */}
        <div className="relative overflow-hidden shadow-2xl rounded-[6.1538vw] md:rounded-[1.25vw] bg-black aspect-video w-full">
          <iframe
            key={currentVideo.id}
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideo.id}?rel=0${lang === "en" ? "&cc_load_policy=1&cc_lang_pref=en" : ""}`}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 썸네일 섹션 */}
        <div className="relative group w-full px-[2.0513vw] md:px-2">
          {currentVideos.length > 1 && (
            <>
              {/* 좌우 화살표: 평소 흰배경+파란아이콘, hover/클릭(active) 시 파란배경+흰아이콘 — 좌우 동일 */}
              <button
                onClick={() => scroll("left")}
                className="absolute -left-2 md:-left-14 top-[35%] -translate-y-1/2 z-10 bg-white hover:bg-[#6276FB] active:bg-[#6276FB] p-3 rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] hover:scale-110 text-[#6276FB] hover:text-white active:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                aria-label="Previous video"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-2 md:-right-14 top-[35%] -translate-y-1/2 z-10 bg-white hover:bg-[#6276FB] active:bg-[#6276FB] p-3 rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] hover:scale-110 text-[#6276FB] hover:text-white active:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                aria-label="Next video"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-[4.1026vw] md:gap-[1.0781vw] overflow-x-auto pb-[6.1538vw] md:pb-6 snap-x scroll-smooth no-scrollbar ${currentVideos.length === 1 ? "justify-center" : ""
              }`}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {currentVideos.map((video, index) => {
              const isPinnedItem = (video as any).isPinned;
              const isOriginalNewest = video.id === newestVideoId;
              const showSeparator = index === 0 && isPinnedItem && currentVideos.length > 1;
              const isActive = activeIndex === index;

              return (
                <React.Fragment key={`${video.id}-${index}`}>
                  <button
                    onClick={() => handleVideoChange(index)}
                    className={`flex-shrink-0 w-[35.8974vw] md:w-[10vw] snap-start origin-top transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-[0.9505] opacity-70 hover:scale-100 hover:opacity-100"
                      }`}
                  >
                    <div className={`relative aspect-video rounded-[4.1026vw] md:rounded-[0.8333vw] overflow-hidden mb-[3.0769vw] md:mb-3 border-2 transition-colors ${isActive ? "border-[#44A9FF] shadow-lg ring-2 ring-[#44a9ff]/20" : "border-transparent"
                      }`}>
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {/* NEW 배지: 데이터상 0번(최신) 영상에만 표시 */}
                      {isOriginalNewest && (
                        <div className="absolute top-[1.5385vw] left-[1.5385vw] md:top-1.5 md:left-1.5 bg-[#4D94FF] text-white text-[2.5641vw] md:text-[10px] px-[2.0513vw] md:px-2 py-[0.5128vw] md:py-0.5 rounded-full font-bold shadow-md">
                          NEW
                        </div>
                      )}
                    </div>
                    <div className="text-left px-[1.0256vw] md:px-1">
                      <p className={`text-[2.5641vw] md:text-[10px] font-extrabold tracking-[0.2564vw] md:tracking-[1px] mb-[1.0256vw] md:mb-1 ${isActive ? "text-[#4D94FF]" : "text-[#9CA3AF]"
                        }`}>
                        {video.label}
                      </p>
                      {/* 사용자 확인: 활성 #D4DCFF, 비활성 #FFFFFF */}
                      <p className={`text-[3.0769vw] md:text-[12px] font-semibold truncate ${isActive ? "text-[#D4DCFF]" : "text-white"}`}>
                        {video.title}
                      </p>
                    </div>
                  </button>
                  {/* 세로 구분선: 텍스트 제외, 썸네일 이미지 영역의 중앙에 오도록 위치 상단으로 조정 */}
                  {showSeparator && (
                    <div className="w-[0.5px] h-[16.4103vw] md:h-20 bg-[#9CA3AF] self-start mt-[3.0769vw] md:mt-4 mx-[2.0513vw] md:mx-2 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 하단 스크롤 인디케이터 및 모바일 조작 버튼 */}
        {currentVideos.length > 1 && (
          <div className="flex items-center justify-center gap-[6.1538vw] md:gap-6 w-full">
            {/* 모바일용 왼쪽 화살표 */}
            <button
              onClick={() => scroll("left")}
              className="md:hidden p-[2.0513vw] text-[#9CA3AF] hover:text-[#4D94FF] transition-all active:scale-90"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-[7.1795vw] h-[7.1795vw]" />
            </button>

            <div className="w-full max-w-[25.641vw] md:max-w-[100px] h-[1.0256vw] md:h-1 bg-[#F3F4F6] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#44A9FF] transition-all duration-300 ease-out absolute top-0 left-0"
                style={{
                  width: `${100 / currentVideos.length}%`,
                  left: `${getIndicatorPosition() * (1 - 1 / currentVideos.length)}%`,
                }}
              />
            </div>

            {/* 모바일용 오른쪽 화살표 */}
            <button
              onClick={() => scroll("right")}
              className="md:hidden p-[2.0513vw] text-[#9CA3AF] hover:text-[#4D94FF] transition-all active:scale-90"
              aria-label="Next video"
            >
              <ChevronRight className="w-[7.1795vw] h-[7.1795vw]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
