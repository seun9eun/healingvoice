import {
  Download,
  CheckCircle2,
  XCircle,
  User,
  PersonStanding,
  Sparkles,
  Copy
} from "lucide-react";

// 이미지 경로 설정
const FileTextImg = "https://i.imgur.com/MofD37d.png";
const VideoImg = "https://i.imgur.com/IqwIDFN.png";
const CameraImg = "https://i.imgur.com/4r6aS6b.png";
const CopyImg = "https://i.imgur.com/wEEv6d3.png";

import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

/** iOS 인앱 브라우저 감지 (Safari, Chrome 제외) */
const isIOSInApp = (() => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS/.test(ua);
  const isIOSChrome = /CriOS/.test(ua);
  return isIOS && !isSafari && !isIOSChrome;
})();

export function StepsSection() {
  const { t, lang } = useLanguage();

  /** 파일 다운로드
   * vercel.json의 Content-Disposition 헤더로 파일명(한글 포함) 처리
   * 카카오톡 인앱 브라우저 포함 모든 환경에서 동작
   */
  const handleFileDownload = (filePath: string, isHwp = false) => {
    if (isHwp && isIOSInApp) {
      toast.error(
        "이 브라우저에서는 파일이 깨져 보일 수 있습니다. 오른쪽 하단의 공유하기 아이콘을 눌러 'Safari로 열기'를 선택해 주세요!",
        { duration: 5000 }
      );
      return;
    }
    window.location.href = filePath;
  };

  /** 이메일 주소 복사 로직 */
  const handleCopyEmail = async () => {
    const email = "cgnhealingvoice@daum.net";
    try {
      await navigator.clipboard.writeText(email);
      toast.success(t('steps.toast.success'));
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          toast.success(t('steps.toast.success'));
        } else {
          throw new Error("Copy failed");
        }
      } catch (fallbackErr) {
        console.error("Copy failed", fallbackErr);
        toast.error(t('steps.toast.error'));
      }
    }
  };

  const steps = [
    {
      step: 1,
      title: t('steps.step1.title'),
      desc: t('steps.step1.desc'),
      icon: FileTextImg,
      content: (
        <div className="flex flex-col gap-3 w-full mt-2">
          {/* HWP 한글파일 - 프로젝트 내 파일, 파일명 그대로 저장 */}
          {lang === 'ko' && (
            <button
              type="button"
              onClick={() => {
                const name = t('steps.step1.downloadFilename.hwp');
                handleFileDownload(`/downloads/${encodeURIComponent(name)}`, true);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer text-left"
            >
              <span className="text-[20px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.hwp')}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#00a6f4] flex items-center justify-center shrink-0 group-hover:bg-sky-600 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </div>
            </button>
          )}

          {/* DOCX 워드파일 */}
          {lang === 'ko' && (
            <button
              type="button"
              onClick={() => {
                const name = t('steps.step1.downloadFilename.docx');
                handleFileDownload(`/downloads/${encodeURIComponent(name)}`);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer text-left"
            >
              <span className="text-[20px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.docx')}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#00a6f4] flex items-center justify-center shrink-0 group-hover:bg-sky-600 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </div>
            </button>
          )}

          {/* 영문 지원서 다운로드 */}
          {lang === 'en' && (
            <button
              type="button"
              onClick={() => {
                const name = t('steps.step1.downloadFilename.eng');
                handleFileDownload(`/downloads/${encodeURIComponent(name)}`);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer text-left"
            >
              <span className="text-[20px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.eng')}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#00a6f4] flex items-center justify-center shrink-0 group-hover:bg-sky-600 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </div>
            </button>
          )}
        </div>
      ),
    },
    {
      step: 2,
      title: t('steps.step2.title'),
      desc: t('steps.step2.desc'),
      icon: VideoImg,
      content: (
        <div className="space-y-4 mt-2">
          <div className="break-keep space-y-3 bg-sky-50/60 border border-sky-200/40 p-4 md:pl-6 md:pr-2 md:py-6 rounded-xl text-left">
            <div className="break-keep text-[20px] font-bold text-gray-700 leading-snug">
              <span>{t('steps.step2.guide1').split('\n')[0]}</span>
              {t('steps.step2.guide1').includes('\n') && (
                <div className="font-bold text-[16px]">{t('steps.step2.guide1').split('\n').slice(1).join('')}</div>
              )}
            </div>
            <div className="break-keep text-[20px] font-bold text-gray-700 leading-snug">
              <span>{t('steps.step2.guide2').split('\n')[0]}</span>
              {t('steps.step2.guide2').includes('\n') && (
                <div className="font-bold text-[16px]">{t('steps.step2.guide2').split('\n').slice(1).join('')}</div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: t('steps.step3.title'),
      desc: t('steps.step3.desc'),
      icon: CameraImg,
      content: (
        <div className="mt-2 flex gap-3 h-44">
          {[
            { label: t('steps.step3.photo1'), icon: User },
            { label: t('steps.step3.photo2'), icon: PersonStanding },
            { label: t('steps.step3.photo3'), icon: Sparkles }
          ].map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full h-[124px] bg-sky-50/50 border border-sky-200/40 rounded-xl flex items-center justify-center mb-2">
                <item.icon className="w-10 h-10 text-sky-400/80" />
              </div>
              <span className="text-[19px] font-bold text-gray-700 text-center whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      step: 4,
      title: t('steps.step4.title'),
      desc: t('steps.step4.desc'),
      icon: CopyImg,
      content: (
        <div className="flex flex-col gap-3 items-center justify-center w-full mt-2">
          <div className="w-full text-center px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-xl overflow-hidden">
            <span className="text-[18px] md:text-[14.5px] font-bold text-gray-700 font-sans break-all">
              cgnhealingvoice@daum.net
            </span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="w-full bg-[#00a6f4] hover:bg-[#0095e0] text-white font-bold text-[18px] px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Copy className="w-4 h-4 text-white" />
            <span>{t('steps.step4.copyBtn')}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="steps" className="py-24 relative scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-32">
          <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
            {t('steps.subtitle')}
          </span>
          <h2 className="text-[28px] md:text-[48px] font-nanumSquareNeo font-extrabold text-[#101828] leading-none mt-4">
            {t('steps.title')}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-6 gap-y-24 md:gap-y-16 relative max-w-7xl mx-auto">
          <div className="hidden xl:block absolute top-[48px] left-0 right-0 h-0.5 bg-sky-300/20 z-0" />

          {steps.map((step) => (
            <div key={step.step} className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden">
                  <img src={step.icon} alt={`Step ${step.step} icon`} className="w-24 h-24 object-contain" />
                </div>
                <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 flex items-center justify-center whitespace-nowrap z-20 font-black text-white border-white border-2 text-[16px] px-5 py-2 min-w-[100px] rounded-[8px] bg-[#006199] shadow-sm">
                  STEP {step.step}
                </div>
              </div>

              <div
                id={step.step === 4 ? "apply-email" : undefined}
                className={`w-full flex-1 bg-white/100 backdrop-blur-sm border border-white/70 rounded-[24px] md:rounded-[32px] p-6 md:p-8 hover:border-sky-400/60 transition-colors flex flex-col text-center shadow-sm ${step.step === 4 ? "scroll-mt-60 md:scroll-mt-102" : ""}`}>
                <h3 className="text-[26px] font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="whitespace-pre-line text-gray-600 mb-6 min-h-[40px] flex items-center justify-center break-keep text-[20px]">
                  {step.desc}
                </p>
                <div className="pt-4 border-t border-gray-200/60 w-full text-left">
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recording Guide Bottom Card */}
        <div className="mt-12 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 md:p-12 shadow-sm border border-sky-100 relative overflow-hidden">
            <div className="absolute top-1/2 right-[-4%] -translate-y-1/2 opacity-[0.04] pointer-events-none">
              <img src={CameraImg} className="w-72 h-72 object-contain" alt="" />
            </div>

            <div className="flex items-center gap-3 mb-10 relative z-10 px-0 md:px-12">
              <img src={VideoImg} className="w-9 h-9 object-contain" alt="" />
              <h3 className="text-[26px] font-bold text-gray-900">
                {lang === 'ko' ? "촬영 시 가이드" : "Video Recording Guide"}
              </h3>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6 font-bold">
                <div className="flex items-start gap-3 text-[21px] text-gray-700 break-keep">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
                  <span>
                    {t('steps.step2.check1')}{" "}
                    <span className="text-red-500 font-bold">{t('steps.step2.check2')}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3 text-[21px] text-gray-700 break-keep">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
                  <span>{t('steps.step2.check3')}</span>
                </div>
                <div className="flex items-start gap-3 text-[21px] text-gray-700 break-keep">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
                  <span>{t('steps.step2.check4')}</span>
                </div>
                <div className="flex items-start gap-3 text-[21px] text-gray-700 break-keep">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
                  <span>{t('steps.step2.check5')}</span>
                </div>
              </div>
              <div>
                <div className="font-bold flex items-start gap-3 text-[21px] text-gray-700 break-keep">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
                  <span>
                    {t('steps.step2.check6')}{" "}
                    <span className="text-red-500 font-bold">{t('steps.step2.check7')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}