import { useState } from "react"; // 1. 상태 관리를 위해 추가
import { useLanguage } from "../context/LanguageContext";
import { NOTICE_DATA } from "../data/notices"; 
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

export function NoticePage() {
  const { lang } = useLanguage();
  // 2. 어떤 공지사항이 펼쳐져 있는지 ID를 저장 (null이면 모두 닫힘)
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredNotices = NOTICE_DATA.filter((notice) => {
    return notice.lang === "all" || notice.lang === lang;
  });

  // 클릭 시 열고 닫는 함수
  const toggleNotice = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {lang === 'ko' ? '진행 사항' : 'Notice'}
          </h2>
        </div>

        <div className="flex flex-col gap-4"> {/* 간격을 좁히고 카드 느낌으로 변경 */}
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => {
              const isExpanded = expandedId === notice.id;

              return (
                <article 
                  key={notice.id} 
                  className={`border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? "bg-white/5 border-sky-500/50" : "bg-transparent hover:bg-white/5"
                  }`}
                >
                  {/* 제목 섹션: 클릭 가능한 영역 */}
                  <button 
                    onClick={() => toggleNotice(notice.id)}
                    className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-sky-500 text-xs mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{notice.date}</span>
                      </div>
                      <h3 className={`text-xl font-bold transition-colors ${isExpanded ? "text-sky-400" : "text-white"}`}>
                        {notice.title}
                      </h3>
                    </div>
                    {/* 화살표 아이콘으로 열림/닫힘 표시 */}
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-sky-500" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-500" />
                    )}
                  </button>

                  {/* 상세 내용 섹션: 펼쳐질 때만 보임 */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="px-6 pb-8 md:px-8 md:pb-10 border-t border-white/5 pt-6">
                      {notice.image && (
                        <div className="mb-6 rounded-xl overflow-hidden">
                          <img src={notice.image} alt={notice.title} className="w-full h-auto" />
                        </div>
                      )}
                      <p className="text-gray-400 leading-relaxed whitespace-pre-line text-lg">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-20">
              {lang === 'ko' ? '등록된 소식이 없습니다.' : 'No news found.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}