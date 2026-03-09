import { AlertTriangle, Mail, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function ChecklistSection() {
  const { t } = useLanguage();

  // 프리텐다드 베리어블 폰트 스타일
  const pretendardStyle = {
    fontFamily: '"Pretendard Variable", sans-serif',
    letterSpacing: '0px'
  };

  return (
    <section
      id="checklist"
      className="w-full py-[100px] px-6"
      // 요청하신 그라디언트 배경 (화면 전체 노출)
      style={{
        background: 'linear-gradient(180deg, #F5FDFF 0%, #D2F6FF 100%)'
      }}
    >
      {/* 흰색 박스가 들어갈 컨테이너: 기존 사이즈인 max-w-5xl 유지 */}
      <div className="max-w-5xl mx-auto">

        {/* 메인 흰색 박스: 기존의 적절한 크기 유지 */}
        <div
          className="bg-white rounded-[32px] border border-sky-200/50 p-8 md:p-12 shadow-xl shadow-blue-900/5 relative overflow-hidden"
          style={pretendardStyle}
        >
          {/* 배경 워터마크 아이콘 */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-[0.03] pointer-events-none transform rotate-12">
            <AlertTriangle className="w-80 h-80 text-sky-500" />
          </div>

          <div className="relative z-10 flex flex-col gap-10">

            {/* Header: 빨간색 포인트와 안내 문구 */}
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-[#FF3B30] flex items-start gap-3 text-[26px] md:text-[30px] break-keep">
                <AlertTriangle className="w-9 h-9" strokeWidth={2.5} />
                {t('checklist.title')}
              </h2>

              <div className="space-y-2 text-gray-800 font-medium">
                <p className="text-[16px] md:text-[17px]">
                  {t('checklist.item1')}
                </p>
                <p className="text-[16px] md:text-[17px]">
                  {t('checklist.item2_1')}
                  <span className="text-[#FF3B30] font-bold">{t('checklist.item2_bold')}</span>
                  {t('checklist.item2_2')}
                </p>
              </div>
            </div>

            {/* 내부 카드 그리드 (2열) */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1: 메일 제목 */}
              <div className="bg-[#F8FDFF] border border-[#E0F2FE] rounded-2xl p-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00a6f4] p-2 rounded-xl">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[19px] font-bold text-gray-900">
                    {t('checklist.subject.title')}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[#44a9ff] text-[14px] md:text-[15px] font-bold break-words leading-tight">
                    {t('checklist.subject.format')}
                  </p>
                  <div className="bg-white border border-[#44a9ff]/10 rounded-xl p-4">
                    <p className="text-gray-600 text-[13px] md:text-[14px] font-medium leading-[18px] md:leading-[20px] break-words">
                      {t('checklist.subject.example')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: 파일명 예시 */}
              <div className="bg-[#F8FDFF] border border-[#E0F2FE] rounded-2xl p-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#155dfc] p-2 rounded-xl">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[19px] font-bold text-gray-900">
                    {t('checklist.filename.title')}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[#155dfc] text-[14px] md:text-[15px] font-bold break-words leading-tight">
                    {t('checklist.filename.format')}
                  </p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="bg-white border border-[#155dfc]/5 rounded-xl p-3.5">
                        <p className="text-gray-600 text-[13px] md:text-[14px] font-medium leading-[18px] md:leading-[20px] break-words">
                          {t(`checklist.filename.file${num}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}