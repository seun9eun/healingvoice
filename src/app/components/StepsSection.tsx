import {
  Download,
  FileText,
  Video,
  Camera,
  Copy,
  CheckCircle2,
  XCircle,
  User,
  PersonStanding,
  Smile,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import { toast } from "sonner";

export function StepsSection() {
  const { t, lang } = useLanguage(); // 번역 버튼 가동

  const handleCopyEmail = async () => {
    const email = "cgnhealingvoice@daum.net";
    try {
      await navigator.clipboard.writeText(email);
      toast.success(t('steps.toast.success'));
    } catch (err) {
      // Fallback for environments where Clipboard API is blocked
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
      icon: FileText,
      content: (
        <div className="flex flex-col gap-3 w-full mt-2">
          {/* HWP 한글파일 */}
          {lang === 'ko' && (
            <a
              href="https://drive.google.com/uc?export=download&id=1nLkDq9uSwJCyDJFihEFCP5YKB5EI6lmg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-[18px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.hwp')}
              </span>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </a>
          )}

          {/* DOCX 워드파일 */}
          {lang === 'ko' && (
            <a
              href="https://drive.google.com/uc?export=download&id=1L_536GYEvEf4Nw543_bxrEu24pIMLg4d"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-[18px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.docx')}
              </span>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </a>
          )}

          {/* 영문 지원서 다운로드 */}
          {lang === 'en' && (
            <a
              href="https://drive.google.com/uc?export=download&id=1LGSsjH-bF83PK27XnfsDZAkcqVfek1D2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-[18px] font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.eng')}
              </span>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </a>
          )}
        </div>
      ),
    },
    {
      step: 2,
      title: t('steps.step2.title'),
      desc: t('steps.step2.desc'),
      icon: Video,
      content: (
        <div className="space-y-4 mt-2">
          <div className="break-keep text-[18px] space-y-1 bg-sky-50/60 border border-sky-200/40 p-3 rounded-lg text-left">
            <p className="break-keep text-gray-700 font-bold">{t('steps.step2.guide1')}</p>
            <p className="break-keep font-bold whitespace-pre-line text-gray-700">{t('steps.step2.guide2')}</p>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: t('steps.step3.title'),
      desc: t('steps.step3.desc'),
      icon: Camera,
      content: (
        <div className="mt-4 flex gap-2 h-40">
          {[
            { label: t('steps.step3.photo1'), icon: User },
            { label: t('steps.step3.photo2'), icon: PersonStanding },
            { label: t('steps.step3.photo3'), icon: Smile }
          ].map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full h-28 bg-sky-50/50 border border-sky-200/40 rounded-lg flex items-center justify-center mb-2">
                <item.icon className="w-8 h-8 text-sky-400/80" />
              </div>
              <span className="text-[17px] font-bold text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      step: 4,
      title: t('steps.step4.title'),
      desc: t('steps.step4.desc'),
      icon: Copy,
      content: (
        <div className="flex flex-col gap-3 items-center justify-center w-full mt-2">
          <div className="w-full text-center px-2 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg overflow-hidden">
            <span className="text-[15px] md:text-[16px] font-bold text-gray-700 font-sans break-all">
              cgnhealingvoice@daum.net
            </span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="w-full bg-[#00a6f4] hover:bg-[#0095e0] text-white font-bold text-[18px] px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Copy className="w-4 h-4 text-white" />
            <span>
              {t('steps.step4.copyBtn')}
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="steps" className="py-24 relative scroll-mt-20"
      style={{ background: 'linear-gradient(180deg, #F5FDFF 0%, #D2F6FF 100%)' }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
            {t('steps.subtitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
            {t('steps.title')}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-7xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-0 right-0 h-0.5 bg-sky-300/20 z-0" />

          {steps.map((step) => (
            <div
              key={step.step}
              className="relative z-10 flex flex-col items-center"
            >
              {/* STEP Marker */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-[#00a6f4] flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] z-10 relative">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                {/* STEP Badge (Rounded Rect) */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#00a6f4] text-white font-black rounded-[8px] flex items-center justify-center text-[13px] border-2 border-white z-20 shadow-sm whitespace-nowrap min-w-[80px]">
                  STEP {step.step}
                </div>
              </div>

              {/* Card */}
              <div
                id={step.step === 4 ? "apply-email" : undefined}
                className={`w-full flex-1 bg-white/100 backdrop-blur-sm border border-white/70 rounded-[24px] md:rounded-[32px] p-6 hover:border-sky-400/60 transition-colors flex flex-col text-center shadow-sm ${step.step === 4 ? "scroll-mt-60 md:scroll-mt-102" : ""}`}>
                <h3 className="text-[26px] font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="whitespace-pre-line text-gray-600 mb-6 min-h-[40px] flex items-center justify-center break-keep text-[21px]">
                  {step.desc}
                </p>
                <div className="pt-4 border-t border-gray-200/60 w-full text-left">
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 영상 촬영시 주의사항 (Bottom Card) */}
        <div className="mt-12 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 md:p-12 shadow-sm border border-white/70">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">
              {lang === 'ko' ? "영상 촬영시 주의사항" : "Video Recording Precautions"}
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 max-w-5xl mx-auto">
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check1')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check2')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check3')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check4')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-red-500 font-bold break-keep">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check5')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-red-500 font-bold break-keep">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check6')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm md:text-[15px] text-red-500 font-bold break-keep">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{t('steps.step2.check7')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}