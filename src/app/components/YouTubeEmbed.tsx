import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

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

// 오픈 기준 시간 설정 (2026년 3월 15일 오전 8시 30분)
const OPEN_TIME = new Date("2026-03-15T08:30:00").getTime();

export const YouTubeEmbed = ({ lang = "ko" }: { lang: "ko" | "en" }) => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpened, setIsOpened] = useState(false); // 8:30 오픈 여부 상태
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 시간 체크 함수: 현재 시간이 오픈 시간을 지났는지 확인
    const checkTime = () => {
      const now = new Date().getTime();
      const opened = now >= OPEN_TIME;

      setIsOpened(opened);

      // 오픈 시간이 지났고, 아직 인덱스가 0(티저)이라면 1(참가신청)로 자동 전환
      // (단, 언어 변경 시나 초기 로드 시에만 적용하기 위해 조건부 설정 가능)
      if (opened && activeIndex === 0) {
        setActiveIndex(1);
      }
    };

    checkTime(); // 초기 로드 시 실행
    const timer = setInterval(checkTime, 1000); // 1초마다 체크하여 실시간 대응

    return () => clearInterval(timer);
  }, [activeIndex]);

  useEffect(() => {
    // 언어 변경 시 초기화 로직
    // 오픈 상태면 1번(모집), 아니면 0번(티저)이 기본값
    setActiveIndex(new Date().getTime() >= OPEN_TIME ? 1 : 0);
    setScrollProgress(0);
  }, [lang]);

  // 2. 데이터 필터링: 오픈 전이면 티저(index 0)만 보여주고, 후면 전체 노출
  const allVideos = VIDEO_DATA[lang] || VIDEO_DATA.ko;
  const currentVideos = isOpened ? allVideos : [allVideos[0]];

  const currentVideo = allVideos[activeIndex] || allVideos[0];

  const scroll = (direction: "left" | "right") => {
    if (currentVideos.length <= 1) return; // 영상이 하나면 스크롤 불필요

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
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
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

      {/* 메인 비디오 플레이어: 8:30 이후엔 자동으로 index 1번(참가신청)이 뜸 */}
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

      {/* 썸네일 섹션: 8:30 이전엔 티저만, 이후엔 모집 영상과 티저가 함께 노출 */}
      <div className="relative">
        {/* 영상이 2개 이상일 때만 화살표 노출 */}
        {isOpened && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-20 top-[36%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all hidden md:flex items-center justify-center border border-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-4 overflow-x-auto pb-6 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${!isOpened ? "justify-center" : "" // 영상이 하나일 땐 가운데 정렬
            }`}
        >
          {currentVideos.map((video, index) => {
            // 실제 데이터 배열(allVideos)에서의 인덱스를 찾아야 함
            const realIndex = allVideos.findIndex(v => v.id === video.id);
            return (
              <button
                key={`${video.id}-${index}`}
                onClick={() => setActiveIndex(realIndex)}
                className={`flex-shrink-0 w-40 md:w-48 snap-start transition-all duration-300 ${activeIndex === realIndex ? "scale-100 opacity-100" : "scale-95 opacity-30 hover:opacity-100"
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
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${activeIndex === realIndex ? "text-[#44a9ff]" : "text-gray-400"}`}>
                    {video.label}
                  </p>
                  <p className={`text-xs font-semibold truncate ${activeIndex === realIndex ? "text-gray-900" : "text-gray-500"}`}>
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isOpened && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-20 top-[36%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl hover:scale-110 text-[#44a9ff] transition-all hidden md:flex items-center justify-center border border-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* 하단 스크롤 인디케이터 (영상이 2개 이상일 때만 노출) */}
      {isOpened && (
        <div className="mt-4 w-full max-w-[150px] mx-auto h-1 bg-gray-200 rounded-full overflow-hidden relative">
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