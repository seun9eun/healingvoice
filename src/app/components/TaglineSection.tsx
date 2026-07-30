import { useLanguage } from "../context/LanguageContext";

export function TaglineSection() {
    const { t, lang } = useLanguage();

    return (
        <section
            className="w-full flex flex-col items-center gap-[10px] self-stretch"
            style={{
                padding: '160px 0',
                background: 'linear-gradient(273.83deg, rgba(255, 255, 255, 0.60) -0.32%, rgba(153, 249, 241, 0.60) 29.86%, rgba(241, 255, 194, 0.60) 74.12%, rgba(229, 255, 140, 0.60) 90.71%, rgba(246, 255, 164, 0.60) 100.81%), #FDFFF8'
            }}
        >
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col items-center gap-2 md:gap-4 font-nanumSquareNeo font-extrabold">
                    <p className="text-[22px] md:text-[48px] text-[#101828] tracking-tight break-keep leading-[1.4]">
                        {t("hero.taglineLine1")}
                        <span className="text-[#44a9ff] whitespace-nowrap">&lt;{lang === "ko" ? "힐링보이스" : "Healing Voice"}&gt;</span>
                    </p>
                    <p className="text-[22px] md:text-[48px] text-[#101828] tracking-tight break-keep leading-[1.4] whitespace-pre-line">
                        {t("hero.descPart1")}
                    </p>
                </div>
            </div>
        </section>
    );
}
