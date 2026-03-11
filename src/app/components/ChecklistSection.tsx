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
      <div className="max-w-7xl mx-auto">

        {/* 메인 흰색 박스: 기존의 적절한 크기 유지 */}
        <div
          className="bg-white rounded-[32px] border border-sky-200/50 p-8 md:p-12 shadow-xl shadow-blue-900/5 relative overflow-hidden"
          style={pretendardStyle}
        >
          <div className="relative z-10 flex flex-col gap-10">

            {/* Header: 빨간색 포인트와 안내 문구 */}
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-[#FF3B30] flex items-start text-[26px] md:text-[30px] break-keep">
                {t('checklist.title')}
              </h2>

              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p className="text-[19px] md:text-[21px] break-keep">
                  {t('checklist.item1')}
                </p>
                <p className="text-[19px] md:text-[21px] text-[#FF3B30] font-bold break-keep">
                  {t('checklist.item2_1')}{t('checklist.item2_bold')}{t('checklist.item2_2')}
                </p>
              </div>
            </div>

            {/* 내부 카드 그리드 (2열) */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1: 메일 제목 */}
              <div className="bg-[#F8FDFF] border border-[#E0F2FE] rounded-2xl p-5 md:p-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00a6f4] p-2 rounded-xl">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-bold text-gray-900">
                    {t('checklist.subject.title')}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[#44a9ff] text-[18px] md:text-[21px] font-bold break-all leading-tight">
                    {t('checklist.subject.format')}
                  </p>
                  <div className="bg-white border border-[#44a9ff]/10 rounded-xl p-4">
                    <p className="text-gray-600 text-[18px] md:text-[21px] font-medium leading-[26px] md:leading-[30px] break-all">
                      {t('checklist.subject.example')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: 파일명 예시 */}
              <div className="bg-[#F8FDFF] border border-[#E0F2FE] rounded-2xl p-5 md:p-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#155dfc] p-2 rounded-xl">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-bold text-gray-900">
                    {t('checklist.filename.title')}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[#155dfc] text-[18px] md:text-[21px] font-bold break-all leading-tight">
                    {t('checklist.filename.format')}
                  </p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="bg-white border border-[#155dfc]/5 rounded-xl p-3.5">
                        <p className="text-gray-600 text-[18px] md:text-[21px] font-medium leading-[26px] md:leading-[30px] break-all">
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