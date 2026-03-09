import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

const VIDEO_DATA = {
  ko: [
    {
      id: "5YqA0qryPPs",
      title: "티저 영상",
      label: "티저",
    },
    {
      id: "SoOr5xxGpjk",
      title: "참가자 모집",
      label: "모집",
    },
    /*{ id: 'SoOr5xxGpjk', title: '티저 영상2 (한국어)', label: '티저' },
    { id: 'SoOr5xxGpjk', title: '티저 영상3 (한국어)', label: '티저' },
    { id: 'SoOr5xxGpjk', title: '티저 영상4 (한국어)', label: '티저' },
    { id: 'SoOr5xxGpjk', title: '티저 영상5 (한국어)', label: '티저' },
    { id: 'SoOr5xxGpjk', title: '티저 영상6 (한국어)', label: '티저' }*/
  ],
  en: [
    {
      id: "pBMPu9lvUOE",
      title: "Teaser",
      label: "Teaser",
    },
    {
      id: "EN_RECRUIT_ID",
      title: "Recruitment",
      label: "Recruitment",
    },
  ],
};

export const YouTubeEmbed = ({
  lang = "ko",
}: {
  lang: "ko" | "en";
}) => {
  const { t } = useLanguage();
  const currentVideos = VIDEO_DATA[lang] || VIDEO_DATA.ko;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    setScrollProgress(0); // 언어 변경 시 스크롤 위치 초기화
  }, [lang]);

  const currentVideo = currentVideos[activeIndex];

  const scroll = (direction: "left" | "right") => {
    const lastIndex = currentVideos.length - 1;
    let nextIndex = activeIndex;

    // 1. 순환 인덱스 계산 (무한 루프 핵심)
    if (direction === "left") {
      // 첫 번째에서 왼쪽 누르면 마지막으로, 아니면 이전으로
      nextIndex =
        activeIndex === 0 ? lastIndex : activeIndex - 1;
    } else {
      // 마지막에서 오른쪽 누르면 첫 번째로, 아니면 다음으로
      nextIndex =
        activeIndex === lastIndex ? 0 : activeIndex + 1;
    }

    setActiveIndex(nextIndex);

    // 2. 스크롤 위치 보정
    if (scrollRef.current) {
      const { clientWidth, scrollWidth } = scrollRef.current;

      // 이동할 위치 계산: (전체 스크롤 가능 길이 / 영상 개수) * 목표 인덱스
      const itemWidth = scrollWidth / currentVideos.length;
      const scrollTo = nextIndex * itemWidth;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };
  // 2. 실제 스크롤 움직임을 감지해서 막대 위치를 계산하는 함수 (독립적)
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollRef.current;
      const progress =
        (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  if (!currentVideo) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      {/* 헤더 영역 */}
      <div className="text-center mb-10">
        <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
          {t("gallery.subtitle")}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
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
          src={`https://www.youtube.com/embed/${currentVideo.id}`}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* 썸네일 섹션 */}
      <div className="relative">
        {/* 좌측 화살표 */}
        <button
          onClick={() => scroll('left')}
          // top-[40%]에서 [36%]로 올려 썸네일 이미지 중앙에 맞춤
          // -left-4에서 -left-6으로 옮겨 이미지와 겹치지 않게 여유 공간 확보
          className="absolute -left-20 top-[36%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all hidden md:flex items-center justify-center border border-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* 썸네일 리스트 (기존 코드 유지) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-6 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {currentVideos.map((video, index) => (
            <button
              key={`${video.id}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-40 md:w-48 snap-start transition-all duration-300 ${activeIndex === index ? 'scale-100 opacity-100' : 'scale-95 opacity-30 hover:opacity-100'
                }`}
            >
              <div className={`relative aspect-video rounded-2xl overflow-hidden mb-3 border-2 transition-all ${activeIndex === index ? 'border-[#44a9ff] shadow-xl ring-2 ring-[#44a9ff]/20' : 'border-transparent'
                }`}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left px-1">
                <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${activeIndex === index ? 'text-[#44a9ff]' : 'text-gray-400'}`}>
                  {video.label}
                </p>
                <p className={`text-xs font-semibold truncate ${activeIndex === index ? 'text-gray-900' : 'text-gray-500'}`}>
                  {video.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* 우측 화살표 */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-20 top-[36%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all hidden md:flex items-center justify-center border border-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* 하단 커스텀 스크롤 인디케이터 */}
      <div className="mt-4 w-full max-w-[150px] mx-auto h-1 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-[#44a9ff] transition-all duration-300 ease-out absolute top-0 left-0"
          style={{
            width: `${100 / currentVideos.length}%`,
            transform: `translateX(${
              // 로직: 스크롤이 가능한 상태면 scrollProgress를 쓰고,
              // 스크롤이 안 되는 상태(영상이 적을 때)면 activeIndex를 비율로 계산함
              scrollRef.current &&
                scrollRef.current.scrollWidth >
                scrollRef.current.clientWidth
                ? (scrollProgress / 100) *
                (150 - 150 / currentVideos.length)
                : activeIndex * (150 / currentVideos.length)
              }px)`,
          }}
        />
      </div>
    </div>
  );
};