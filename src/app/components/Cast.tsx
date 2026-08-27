import { useLanguage } from "../context/LanguageContext";
import { MC_DATA, MENTOR_DATA, CastMember } from "../data/castData";

// 출연진(Cast) 섹션 에셋 (Figma 답변, 2026-08-27) — 원본 3배수 PNG는 용량이 커서(최대 18MB) 리사이즈+JPEG로 최적화해 저장함
const bgSrc = "/images/cast/cast_bg.jpg";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
const roleGradient = "linear-gradient(180deg, #ECFBFA 0%, #7CF0E6 100%)";
const cardBorder =
  "linear-gradient(180deg, #96F9FF 0%, #C9FEFF 16%, #92C8F2 60.5%, #889BF0 80.5%, #8384EF 93.8%, #E8E8FF 100%)";

function MentorCard({ member, lang }: { member: CastMember; lang: "ko" | "en" }) {
  // Figma 디자인은 국문 설명 끝의 "OO 멘토" 부분만 별도 하이라이트 색으로 분리 표시함
  const bodyKo = member.descKo.replace(member.roleKo, "").trim();

  return (
    <div
      className="relative w-full max-w-[368px] md:w-[19.1667vw] aspect-[368/425] rounded-3xl md:rounded-[1.6667vw] p-1 md:p-[0.2083vw] shrink-0"
      style={{ backgroundImage: cardBorder }}
    >
      <div className="relative flex size-full flex-col items-center gap-3 md:gap-[0.625vw] overflow-hidden rounded-[calc(1.5rem-2px)] md:rounded-[1.4583vw] bg-[#7055D3] pt-6 md:pt-[1.6667vw]">
        <div className="flex w-full flex-col items-center gap-1.5 md:gap-[0.3125vw] px-3 md:px-[0.4167vw]">
          <p className="text-sm md:text-[1.0417vw] leading-[1.4] text-center font-medium text-white">
            {lang === "ko" ? bodyKo : member.descEn}
          </p>
          <p
            className="text-lg md:text-[1.25vw] leading-[1.2] tracking-[-0.05em] text-center font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: roleGradient }}
          >
            {lang === "ko" ? member.roleKo : member.roleEn}
          </p>
        </div>
        <div className="relative w-full flex-1">
          {member.photo && (
            <img src={member.photo} alt={member.nameKo} className="absolute inset-0 w-full h-full object-cover object-top" />
          )}
        </div>
      </div>
    </div>
  );
}

export function Cast() {
  const { t, lang } = useLanguage();
  const mc = MC_DATA[0];
  const [row1, row2] = [MENTOR_DATA.slice(0, 2), MENTOR_DATA.slice(2)];

  return (
    <section
      id="cast"
      className="relative w-full flex flex-col items-center gap-16 md:gap-[3.3333vw] overflow-hidden px-4 md:px-[18.75vw] py-16 md:py-[6.25vw]"
    >
      {/* 배경 사진 + 그라디언트 오버레이 */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,57,118,0)_0%,#00163B_100%)]" />
      </div>

      {/* 타이틀 */}
      <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#4D94FF] font-bold tracking-[1.6px] text-sm md:text-[0.8333vw]">
          {t("cast.eyebrow")}
        </span>
        <h2
          className="text-3xl md:text-[2.9167vw] leading-tight font-black text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("cast.title")}
        </h2>
        <p className="max-w-[527px] text-[#D4EBFF] text-base md:text-[1.1458vw] font-semibold leading-[1.4]">
          {t("cast.desc")}
        </p>
      </div>

      {/* MC */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-[1200px] gap-6 md:gap-[1.25vw] rounded-[2rem] md:rounded-[2.5vw] md:px-[6.25vw]">
        <div className="flex flex-col items-center gap-2 md:gap-[0.4167vw] md:w-[14.479vw] shrink-0 text-center">
          <p
            className="text-2xl md:text-[2.0833vw] leading-none font-extrabold text-white"
            style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("cast.mcLabel")}
          </p>
          <p className="text-lg md:text-[1.25vw] leading-[1.4] tracking-[-0.03em] font-medium text-white">
            {lang === "ko" ? mc.descKo : mc.descEn}
          </p>
        </div>
        {mc.photo && (
          <img
            src={mc.photo}
            alt={mc.nameKo}
            className="w-full max-w-[520px] md:max-w-none md:flex-1 h-auto md:h-[30.104vw] object-cover object-top rounded-3xl md:rounded-[2.5vw]"
          />
        )}
      </div>

      {/* 힐링멘토 */}
      <div className="flex flex-col items-center gap-8 md:gap-[1.6667vw] w-full max-w-[1200px]">
        <div className="flex items-center gap-4 w-full max-w-[800px]">
          <span className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent to-white/40" />
          <h3
            className="shrink-0 text-2xl md:text-[2.5vw] leading-tight font-black text-transparent bg-clip-text px-2"
            style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("cast.mentorsTitle")}
          </h3>
          <span className="hidden md:block flex-1 h-px bg-gradient-to-l from-transparent to-white/40" />
        </div>

        {/* 데스크탑: 2장 + 3장 두 줄 / 모바일: 2열 그리드 */}
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row1.map((m) => (
            <MentorCard key={m.id} member={m} lang={lang} />
          ))}
        </div>
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row2.map((m) => (
            <MentorCard key={m.id} member={m} lang={lang} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:hidden">
          {MENTOR_DATA.map((m) => (
            <MentorCard key={m.id} member={m} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
