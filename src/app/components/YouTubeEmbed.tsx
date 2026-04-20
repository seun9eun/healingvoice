import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_OPEN_TIME = "2026-03-15T08:30:00+09:00";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const VIDEO_DATA = { // 최신순 정렬 (0번이 최신)
  ko: [
    { id: "M0i6xhY5bBU", title: "[모집 홍보] 김재원 아나운서", label: "홍보", openTime: "2026-04-15T00:00:00+09:00" },
    { id: "p65TCfUqHDo", title: "2차 모집 티저", label: "티저", openTime: "2026-04-13T00:00:00+09:00", isPinned: true },
    { id: "SDEGM2T-TKo", title: "모집 티저", label: "티저", openTime: DEFAULT_OPEN_TIME },
    { id: "5YqA0qryPPs", title: "티저 영상", label: "티저", openTime: DEFAULT_OPEN_TIME },
  ],
  en: [
    { id: "CjQMdFbPVH4", title: "Kim Jae-won", label: "PR", openTime: "2026-04-15T00:00:00+09:00" },
    { id: "okEbs1xrVU8", title: "2nd Open Call", label: "Teaser", openTime: "2026-04-13T00:00:00+09:00", isPinned: true },
    { id: "tukfPRXn044", title: "Open Call", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
    { id: "pBMPu9lvUOE", title: "Teaser", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
  ],
};

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

  // 10. 기기별(PC/모바일) 반응형 감지
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // 초기 실행
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (currentVideos.length === 0) return null;
  const currentVideo = currentVideos[activeIndex] || currentVideos[0];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-16 px-4 font-sans">
      {/* 헤더 영역 */}
      <div className="text-center mb-10">
        <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[14px] md:text-[16px]">
          {t("gallery.subtitle")}
        </span>
        <h2 className="text-[28px] md:text-[48px] font-extrabold text-[#101828] leading-tight mt-2">
          {t("gallery.title")}
        </h2>
        <p className="text-[#7D7D7D] max-w-2xl mx-auto mt-4 whitespace-pre-line text-[16px] md:text-[20px] font-medium px-4">
          {t("gallery.desc")}
        </p>
      </div>

      {/* 메인 비디오 플레이어 */}
      <div className="relative overflow-hidden shadow-2xl rounded-3xl bg-black aspect-video mb-8">
        <iframe
          key={currentVideo.id}
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
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 md:-left-14 top-[35%] -translate-y-1/2 z-10 bg-white/90 p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 text-[#44a9ff] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
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
          className={`flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth no-scrollbar ${currentVideos.length === 1 ? "justify-center" : ""
            }`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {currentVideos.map((video, index) => {
            const isPinnedItem = (video as any).isPinned;
            const isOriginalNewest = video.id === newestVideoId;
            const showSeparator = index === 0 && isPinnedItem && currentVideos.length > 1;

            return (
              <React.Fragment key={`${video.id}-${index}`}>
                <button
                  onClick={() => handleVideoChange(index)}
                  className={`flex-shrink-0 w-[140px] md:w-48 snap-start transition-all duration-300 ${activeIndex === index ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <div className={`relative aspect-video rounded-2xl overflow-hidden mb-3 border-2 transition-all ${activeIndex === index ? "border-[#44a9ff] shadow-lg ring-2 ring-[#44a9ff]/20" : "border-transparent"
                    }`}>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* NEW 배지: 데이터상 0번(최신) 영상에만 표시 */}
                    {isOriginalNewest && (
                      <div className="absolute top-2 left-2 bg-[#44a9ff] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="text-left px-1">
                    <p className={`text-[10px] font-bold uppercase tracking-tighter mb-1 ${activeIndex === index ? "text-[#44a9ff]" : "text-gray-400"
                      }`}>
                      {video.label}
                    </p>
                    <p className={`text-[13px] font-bold ${isMobile ? "" : "truncate"} ${activeIndex === index ? "text-gray-900" : "text-gray-500"
                      }`}>
                      {isMobile ? (() => {
                        const limit = lang === "ko" ? 13 : 20;
                        return video.title.length > limit
                          ? video.title.slice(0, limit) + "..."
                          : video.title;
                      })() : video.title}
                    </p>
                  </div>
                </button>
                {/* 세로 구분선: 텍스트 제외, 썸네일 이미지 영역의 중앙에 오도록 위치 상단으로 조정 */}
                {showSeparator && (
                  <div className="w-[0.5px] h-16 md:h-20 bg-gray-400 self-start mt-3 md:mt-4 mx-2 shrink-0 opacity-30" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 하단 스크롤 인디케이터 및 모바일 조작 버튼 */}
      {currentVideos.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          {/* 모바일용 왼쪽 화살표 */}
          <button
            onClick={() => scroll("left")}
            className="md:hidden p-2 text-gray-400 hover:text-[#44a9ff] transition-all active:scale-90"
            aria-label="Previous video"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="w-full max-w-[100px] md:max-w-[120px] h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#44a9ff] transition-all duration-300 ease-out absolute top-0 left-0"
              style={{
                width: `${100 / currentVideos.length}%`,
                left: `${getIndicatorPosition() * (1 - 1 / currentVideos.length)}%`,
              }}
            />
          </div>

          {/* 모바일용 오른쪽 화살표 */}
          <button
            onClick={() => scroll("right")}
            className="md:hidden p-2 text-gray-400 hover:text-[#44a9ff] transition-all active:scale-90"
            aria-label="Next video"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

