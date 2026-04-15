import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_OPEN_TIME = "2026-03-15T08:30:00+09:00";
const INITIAL_VIDEO_INDEX = {
  ko: 1,
  en: 0,
};
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const VIDEO_DATA = {// 최신순 정렬 (0번이 최신)
  ko: [
    { id: "M0i6xhY5bBU", title: "[모집 홍보] 김재원 아나운서", label: "홍보", openTime: "2026-04-15T00:00:00+09:00" },
    { id: "p65TCfUqHDo", title: "2차 모집 티저", label: "티저", openTime: "2026-04-13T00:00:00+09:00" },
    { id: "SDEGM2T-TKo", title: "모집 티저", label: "티저", openTime: DEFAULT_OPEN_TIME },
    { id: "5YqA0qryPPs", title: "티저 영상", label: "티저", openTime: DEFAULT_OPEN_TIME },
  ],
  en: [
    { id: "okEbs1xrVU8", title: "2nd Open Call", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
    { id: "tukfPRXn044", title: "Open Call", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
    { id: "pBMPu9lvUOE", title: "Teaser", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
  ],
};

export const YouTubeEmbed = ({ lang = "ko" }: { lang: "ko" | "en" }) => {
  const { t } = useLanguage();
  const initialIndex = INITIAL_VIDEO_INDEX[lang as keyof typeof INITIAL_VIDEO_INDEX] || 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 주기적인 현재 시간 갱신 (1초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 현재 시간에 맞춰 오픈 시간이 지난 영상만 필터링
  const allVideos = VIDEO_DATA[lang] || VIDEO_DATA.ko;
  const currentVideos = allVideos.filter(
    (video) => currentTime >= new Date(video.openTime).getTime()
  );

  // 3. 새로운 영상이 공개되었을 때만 (영상의 갯수가 늘어났을 때) 최신 영상(0번)으로 자동 이동
  const prevVideoCountRef = useRef(currentVideos.length);
  useEffect(() => {
    // 이전에 영상이 하나라도 있었고, 지금 영상이 더 늘어난 경우에만 0번으로 이동 (자동 갱신)
    if (prevVideoCountRef.current > 0 && prevVideoCountRef.current < currentVideos.length) {
      setActiveIndex(0);
    }
    prevVideoCountRef.current = currentVideos.length;
  }, [currentVideos.length]);

  // 4. 언어 변경 시 또는 초기 로딩 시 지정된 인덱스로 이동
  useEffect(() => {
    const initialIndex = INITIAL_VIDEO_INDEX[lang as keyof typeof INITIAL_VIDEO_INDEX] || 0;
    if (currentVideos.length > initialIndex) {
      handleVideoChange(initialIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // 4. 스크롤 및 인덱스 이동 제어
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
      const itemWidth = 160 + 16; // w-40(160px) + gap-4(16px)
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  // 노출 대상 영상이 하나도 없을 때는 렌더링하지 않음
  if (currentVideos.length === 0) return null;

  // 현재 선택된 영상 안전하게 가져오기
  const currentVideo = currentVideos[activeIndex] || currentVideos[0];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-16 px-4">
      {/* 헤더 영역 */}
      <div className="text-center mb-10">
        <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[14px] md:text-[16px]">
          {t("gallery.subtitle")}
        </span>
        <h2 className="text-[28px] md:text-[48px] font-extrabold text-[#101828] leading-tight mt-2">
          {t("gallery.title")}
        </h2>
        <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line text-[16px] md:text-[20px] font-medium">
          {t("gallery.desc")}
        </p>
      </div>

      {/* 메인 비디오 플레이어 */}
      <div className="relative overflow-hidden shadow-2xl rounded-3xl bg-black aspect-video mb-8">
        <iframe
          key={currentVideo.id} // ID가 바뀔 때만 새로고침
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${currentVideo.id}?rel=0`}
          title={currentVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 썸네일 섹션 */}
      <div className="relative group px-2">
        {currentVideos.length > 1 && (
          <>
            {/* 좌측 화살표 */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 md:-left-14 top-[35%] -translate-y-1/2 z-10 bg-white/90 p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 text-[#44a9ff] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* 우측 화살표 */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 md:-right-14 top-[35%] -translate-y-1/2 z-10 bg-white/90 p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 text-[#44a9ff] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth no-scrollbar ${currentVideos.length === 1 ? "justify-center" : ""
            }`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {currentVideos.map((video, index) => (
            <button
              key={`${video.id}-${index}`}
              onClick={() => handleVideoChange(index)}
              className={`flex-shrink-0 w-40 md:w-48 snap-start transition-all duration-300 ${activeIndex === index ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
            >
              <div className={`relative aspect-video rounded-2xl overflow-hidden mb-3 border-2 transition-all ${activeIndex === index ? "border-[#44a9ff] shadow-lg ring-2 ring-[#44a9ff]/20" : "border-transparent"
                }`}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {/* 오픈 일시가 일주일(7일) 이내인 경우 NEW 배지 표시 */}
                {(() => {
                  const openDateTime = new Date(video.openTime).getTime();
                  const isNew = currentTime - openDateTime < SEVEN_DAYS_MS;
                  return isNew && (
                    <div className="absolute top-2 left-2 bg-[#44a9ff] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      NEW
                    </div>
                  );
                })()}
              </div>
              <div className="text-left px-1">
                <p className={`text-[10px] font-bold uppercase tracking-tighter mb-1 ${activeIndex === index ? "text-[#44a9ff]" : "text-gray-400"
                  }`}>
                  {video.label}
                </p>
                <p className={`text-[13px] font-bold truncate ${activeIndex === index ? "text-gray-900" : "text-gray-500"
                  }`}>
                  {video.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 스크롤 인디케이터 */}
      {currentVideos.length > 1 && (
        <div className="mt-4 w-full max-w-[120px] mx-auto h-1 bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#44a9ff] transition-all duration-200 ease-out absolute top-0 left-0"
            style={{
              width: `${100 / currentVideos.length}%`,
              left: `${scrollProgress * (1 - 1 / currentVideos.length)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};