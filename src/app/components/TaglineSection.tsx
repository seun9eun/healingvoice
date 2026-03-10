import { useLanguage } from "../context/LanguageContext";

export function TaglineSection() {
    const { t, lang } = useLanguage();

    return (
        <section className="bg-white py-12 md:py-16 border-b border-gray-100">
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col items-center space-y-2 md:space-y-3">
                    {/* 첫 번째 줄 */}
                    <p className={`text-[20px] md:text-[32px] font-bold text-[#101828] tracking-tight break-keep ${lang === "ko" ? "md:whitespace-nowrap" : ""}`}>
                        {t("hero.descPart1")}
                        <span className="text-[#44a9ff]">K-CCM</span>
                        {t("hero.descPart3")}
                    </p>

                    {/* 두 번째 줄 */}
                    <p className="text-[18px] md:text-[28px] font-bold text-[#101828] tracking-tight break-keep">
                        {t("hero.descPart4")}
                    </p>
                </div>
            </div>
        </section>
    );
}
