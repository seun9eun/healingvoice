import {
  Download,
  FileText,
  Video,
  Camera,
  Copy,
  CheckCircle2,
  XCircle,
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
              href="https://drive.google.com/uc?export=download&id=1Pc37Yhxniexhj52AtOWsWkR3vyO59mUT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.hwp')}
              </span>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </a>
          )}

          {/* DOCX 워드파일 */}
          {lang === 'ko' && (
            <a
              href="https://drive.google.com/uc?export=download&id=1C9dRbAhKIAHVTcSkh2HjmHF36GakoNsk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-sky-600">
                {t('steps.step1.docx')}
              </span>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </a>
          )}

          {/* 영문 지원서 다운로드 */}
          {lang === 'en' && (
            <a
              href="https://drive.google.com/uc?export=download&id=1416cE9fLMMIyHbPfvZdSrRVRFuBiJyG8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-sky-50/60 border border-sky-200/50 rounded-lg hover:bg-sky-100/70 hover:border-sky-400 transition-colors group cursor-pointer"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-sky-600">
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
           <div className="break-keep text-sm space-y-1 bg-sky-50/60 border border-sky-200/40 p-3 rounded-lg text-left">
             <p className="break-keep text-sky-600 font-bold">{t('steps.step2.guide1')}</p>
             <p className="break-keep font-bold whitespace-pre-line text-[#0084d1]">{t('steps.step2.guide2')}</p>
           </div>
           
           <ul className="text-xs text-gray-600 space-y-2 text-left">
            <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t('steps.step2.check1')}</span>
            </li>
            <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t('steps.step2.check2')}</span>
            </li>
            <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t('steps.step2.check3')}</span>
            </li>
            <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t('steps.step2.check4')}</span>
            </li> 
            <li className="flex items-start gap-2 text-red-500 font-bold break-keep">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{t('steps.step2.check5')}</span>
            </li>
            <li className="flex items-start gap-2 text-red-500 font-bold break-keep">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{t('steps.step2.check6')}</span>
            </li> 
           </ul>
        </div>
      ),
    },
    {
      step: 3,
      title: t('steps.step3.title'),
      desc: t('steps.step3.desc'),
      icon: Camera,
      content: (
        <div className="mt-4 flex gap-2 h-32">
          {[t('steps.step3.photo1'), t('steps.step3.photo2'), t('steps.step3.photo3')].map((label, index) => (
             <div key={index} className="flex-1 bg-sky-50/50 border border-sky-200/40 rounded-lg flex items-center justify-center">
               <span className="text-gray-500 text-xs">{label}</span>
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
        <div className="flex flex-col gap-[12px] items-center justify-center w-full mt-0">
          <p className="text-center font-normal whitespace-pre-wrap text-gray-800 text-[16px]">
            cgnhealingvoice@daum.net
          </p>
          <button
            onClick={handleCopyEmail}
            className="bg-[#0084d1] h-[30px] w-[200px] rounded-[5px] shadow-[0px_5px_7.5px_0px_rgba(2,74,112,0.2),0px_2px_3px_0px_rgba(2,74,112,0.2)] flex items-center justify-center gap-[7px] hover:bg-[#0073b7] transition-colors cursor-pointer"
          >
            <Copy className="w-[10px] h-[10px] text-white" />
            <span className="font-bold text-white leading-[12px] text-[15px]">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-7xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-0 right-0 h-0.5 bg-sky-300/40 z-0" />

          {steps.map((step, idx) => (
            <div
              key={step.step}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Icon Circle */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-[#00a6f4] flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] z-10 relative">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#00a6f4] text-black font-bold rounded-full flex items-center justify-center text-sm border-2 border-white z-20">
                    {step.step}
                </div>
              </div>

              {/* Card */}
              <div 
                id={step.step === 4 ? "apply-email" : undefined}
                className={`w-full flex-1 bg-white/100 backdrop-blur-sm border border-white/70 rounded-2xl p-6 hover:border-sky-400/60 transition-colors flex flex-col text-center shadow-sm ${step.step === 4 ? "scroll-mt-60 md:scroll-mt-102" : ""}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="whitespace-pre-line text-gray-600 mb-6 min-h-[40px] flex items-center justify-center break-keep text-[16px]">
                  {step.desc}
                </p>
                <div className="pt-4 border-t border-gray-200/60 w-full text-left">
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}