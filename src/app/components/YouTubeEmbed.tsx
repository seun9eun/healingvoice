import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext"; // 실제 환경에 맞게 활성화

const VIDEO_DATA = {
  ko: [
    { id: "5YqA0qryPPs", title: "티저 영상", label: "티저" },
    { id: "SDEGM2T-TKo", title: "참가자 모집", label: "모집" },
  ],
  en: [
    { id: "pBMPu9lvUOE", title: "Teaser", label: "Teaser" },
    { id: "tukfPRXn044", title: "Recruitment", label: "Recruitment" },
  ],
};

const OPEN_TIME = new Date("2026-03-15T08:30:00").getTime();

export const YouTubeEmbed = ({ lang = "ko" }: { lang: "ko" | "en" }) => {
  const { t } = useLanguage();
  // const t = (key: string) => key; // 임시 더미 함수 (실제 환경에서는 위 useLanguage 사용)

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 시간 체크 로직 수정 (무한 락 걸림 방지)
  useEffect(() => {
    const checkTime = () => {
      const now = new Date().getTime();
      const currentlyOpened = now >= OPEN_TIME;

      setIsOpened((prevOpened) => {
        // 기존 상태가 '오픈 전(false)'이었는데 방금 '오픈(true)'으로 바뀌었다면 1번으로 자동 전환
        if (!prevOpened && currentlyOpened) {
          setActiveIndex(1);
        }
        return currentlyOpened;
      });
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, []); // activeIndex 의존성을 제거하여 무한 리렌더링 및 락 방지

  // 언어 변경 시 초기화
  useEffect(() => {
    setActiveIndex(new Date().getTime() >= OPEN_TIME ? 1 : 0);
    setScrollProgress(0);
  }, [lang]);

  const allVideos = VIDEO_DATA[lang] || VIDEO_DATA.ko;
  const currentVideos = isOpened ? allVideos : [allVideos[0]];
  const currentVideo = allVideos[activeIndex] || allVideos[0];

  const scroll = (direction: "left" | "right") => {
    if (currentVideos.length <= 1) return;

    const lastIndex = currentVideos.length - 1;
    let nextIndex = activeIndex;

    if (direction === "left") {
      nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
    } else {
      nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
    }

    setActiveIndex(nextIndex);

    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current;
      const itemWidth = scrollWidth / currentVideos.length;
      const scrollTo = nextIndex * itemWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  if (!currentVideo) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-16 px-4">
      {/* 헤더 영역 */}
      <div className="text-center mb-10">
        <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
          {t("gallery.subtitle")}
        </span>
        <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none mt-4">
          {t("gallery.title")}
        </h2>
        <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line tracking-[-0.03em] md:text-[22px] font-semibold">
          {t("gallery.desc")}
        </p>
      </div>

      {/* 메인 비디오 플레이어 */}
      <div className="relative overflow-hidden shadow-2xl rounded-3xl bg-black aspect-video group mb-10">
        <iframe
          key={currentVideo.id + activeIndex}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0`}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* 썸네일 섹션 */}
      <div className="relative group">
        {/* 화살표 위치 값 조정 및 모바일 숨김(hidden md:flex) 조건 완화 (필요시 hidden 삭제) */}
        {isOpened && currentVideos.length > 1 && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-12 top-[40%] -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all flex items-center justify-center border border-gray-50 opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-4 overflow-x-auto pb-6 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${!isOpened || currentVideos.length === 1 ? "justify-center" : ""
            }`}
        >
          {currentVideos.map((video, index) => {
            const realIndex = allVideos.findIndex(v => v.id === video.id);
            return (
              <button
                key={`${video.id}-${index}`}
                onClick={() => setActiveIndex(realIndex)}
                className={`flex-shrink-0 w-40 md:w-48 snap-start transition-all duration-300 ${activeIndex === realIndex ? "scale-100 opacity-100" : "scale-95 opacity-50 hover:opacity-100"
                  }`}
              >
                <div className={`relative aspect-video rounded-2xl overflow-hidden mb-3 border-2 transition-all ${activeIndex === realIndex ? "border-[#44a9ff] shadow-xl ring-2 ring-[#44a9ff]/20" : "border-transparent"
                  }`}>
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left px-1">
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${activeIndex === realIndex ? "text-[#44a9ff]" : "text-gray-400"
                    }`}>
                    {video.label}
                  </p>
                  <p className={`text-xs font-semibold truncate ${activeIndex === realIndex ? "text-gray-900" : "text-gray-500"
                    }`}>
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isOpened && currentVideos.length > 1 && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-12 top-[40%] -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all flex items-center justify-center border border-gray-50 opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* 하단 스크롤 인디케이터 */}
      {isOpened && currentVideos.length > 1 && (
        <div className="mt-2 w-full max-w-[150px] mx-auto h-1 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#44a9ff] transition-all duration-300 ease-out absolute top-0 left-0"
            style={{
              width: `${100 / currentVideos.length}%`,
              transform: `translateX(${scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth
                ? (scrollProgress / 100) * (150 - 150 / currentVideos.length)
                : activeIndex * (150 / currentVideos.length)
                }px)`,
            }}
          />
        </div>
      )}
    </div>
  );
};