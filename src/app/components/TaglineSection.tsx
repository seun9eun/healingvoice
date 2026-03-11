import { useLanguage } from "../context/LanguageContext";

export function TaglineSection() {
    const { t, lang } = useLanguage();

    return (
        <section
            className="w-full flex flex-col items-center gap-[10px] self-stretch"
            style={{
                padding: '160px 0',
                background: 'linear-gradient(274deg, rgba(255, 255, 255, 0.60) -0.32%, rgba(153, 249, 241, 0.60) 29.86%, rgba(241, 255, 194, 0.60) 74.12%, rgba(229, 255, 140, 0.60) 90.71%, rgba(246, 255, 164, 0.60) 100.81%)'
            }}
        >
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col items-center gap-[10px] font-nanumSquareNeo font-extrabold">
                    {/* 첫 번째 줄 */}
                    <p className={`text-[28px] md:text-[48px] text-[#101828] tracking-tight break-keep ${lang === "ko" ? "md:whitespace-nowrap" : ""}`}>
                        {t("hero.descPart1")}
                        <span className="text-[#44a9ff]">K-CCM</span>
                        {t("hero.descPart3")}
                    </p>

                    {/* 두 번째 줄 */}
                    <p className="text-[24px] md:text-[48px] text-[#101828] tracking-tight break-keep">
                        {t("hero.descPart4")}
                    </p>
                </div>
            </div>
        </section>
    );
}
