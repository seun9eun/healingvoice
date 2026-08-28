import { useLanguage } from "../context/LanguageContext";
import { MC_DATA, MENTOR_DATA, CastMember } from "../data/castData";

// 출연진(Cast) 섹션 에셋 (Figma 답변, 2026-08-27) — 원본 3배수 PNG는 용량이 커서(최대 18MB) 리사이즈+JPEG로 최적화해 저장함
const mcSign = "/images/cast/mc_sign.png";
// 섹션 자체 배경 그룹(bg_출연진, 1178:604) — 조명 그래픽 포함, 알파 투명 원본(2026-08-28 답변)
const bgCastPhoto = "/images/cast/bg_cast.webp";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
const roleGradient = "linear-gradient(180deg, #ECFBFA 0%, #7CF0E6 100%)";
const cardBorder =
  "linear-gradient(180deg, #96F9FF 0%, #C9FEFF 16%, #92C8F2 61%, #889BF0 81%, #8384EF 94%, #E8E8FF 100%)";
// 카드 배경 합성 완료본(#7055D3 단색 + 텍스처 HARD_LIGHT 70% 블렌드, Figma에서 직접 합성해 받음, 2026-08-28)
const cardBg = "/images/cast/mentor_card_bg.jpg";
// Figma 답변으로 받은 정확한 카드 외곽선(368x425 기준 M 56.65 0 L 368 0 L 368 368 L 310.84 425 L 0 425 L 0 56.5 Z)을 %로 환산
const cardClip = "polygon(15.394% 0, 100% 0, 100% 86.588%, 84.467% 100%, 0 100%, 0 13.294%)";

function MentorCard({ member, lang }: { member: CastMember; lang: "ko" | "en" }) {
  // Figma 디자인은 국문 설명 끝의 "OO 멘토" 부분만 별도 하이라이트 색으로 분리 표시함
  const bodyKo = member.descKo.replace(member.roleKo, "").trim();

  return (
    <div
      className="relative w-full max-w-[368px] md:w-[19.1667vw] aspect-[368/425] p-1 md:p-[0.2083vw] shrink-0"
      style={{ backgroundImage: cardBorder, clipPath: cardClip }}
    >
      <div
        className="relative size-full overflow-hidden bg-[#061E49] bg-cover bg-center"
        style={{ backgroundImage: `url(${cardBg})`, clipPath: cardClip }}
      >
        <div className="relative z-10 flex flex-col items-center gap-2 md:gap-[0.4167vw] pt-8 md:pt-[2vw] px-3">
          {member.nameImage && lang === "ko" ? (
            <img src={member.nameImage} alt={member.nameKo} className="h-8 md:h-[2.1vw] w-auto object-contain" />
          ) : (
            <p className="text-xl md:text-[1.5vw] leading-[1.2] text-center font-extrabold text-white">
              {member.nameEn}
            </p>
          )}
          <div className="flex w-full flex-col items-center gap-1 md:gap-[0.2083vw]">
            <p className="text-xs md:text-[0.9375vw] leading-[1.4] text-center font-medium text-white">
              {lang === "ko" ? bodyKo : member.descEn}
            </p>
            <p
              className="text-base md:text-[1.1458vw] leading-[1.2] tracking-[-0.05em] text-center font-bold text-transparent bg-clip-text"
              style={{ backgroundImage: roleGradient }}
            >
              {lang === "ko" ? member.roleKo : member.roleEn}
            </p>
          </div>
        </div>
        {/* 사진은 카드보다 넓게(122.8%) 오버플로되며 카드 y34.6% 지점부터 시작 — 스펙 비율(462:291)로 크롭해서 원본 파일 비율 차이에 영향받지 않도록 처리 */}
        {member.photo && (
          <div className="absolute inset-x-0 top-[34.6%] bottom-0 flex items-start justify-center overflow-visible">
            <img
              src={member.photo}
              alt={member.nameKo}
              className="w-[122.8%] max-w-none aspect-[462/291] object-cover"
            />
          </div>
        )}
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
      {/* 섹션 자체 배경(bg_출연진, Figma 1178:603) — 조명 그래픽 사진 + 상단 그라디언트. PC 전용(모바일은 공용 배경만) */}
      <div
        className="hidden md:block absolute -z-10 pointer-events-none"
        style={{ left: "-4.115vw", top: "-1.979vw", width: "108.229vw", height: "131.615vw" }}
        aria-hidden
      >
        <img src={bgCastPhoto} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="hidden md:block absolute -z-10 w-full pointer-events-none"
        style={{
          top: "-1.979vw",
          height: "40vw",
          backgroundImage: "linear-gradient(to top, rgba(21,57,118,0) 0%, #00163b 100%)",
        }}
        aria-hidden
      />
      {/* MC 뒤 보라색 글로우(Figma 1178:610, glow) */}
      <div
        className="hidden md:block absolute -z-10 rounded-full opacity-70 mix-blend-screen pointer-events-none"
        style={{
          left: "40.365vw",
          top: "16.302vw",
          width: "37.031vw",
          height: "37.031vw",
          backgroundImage: "radial-gradient(circle, #722FF6 0%, rgba(26,0,255,0) 75%)",
        }}
        aria-hidden
      />

      {/* 타이틀 */}
      <div className="flex flex-col items-center gap-3 md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#4D94FF] font-bold uppercase tracking-[1.6px] text-sm md:text-[0.8333vw]">
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
          <p className="text-lg md:text-[1.25vw] leading-[1.4] tracking-[-0.03em] font-medium text-white break-keep">
            {lang === "ko"
              ? mc.descKo.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))
              : mc.descEn}
          </p>
        </div>
        {mc.photo && (
          <div className="relative w-full max-w-[520px] md:max-w-none md:flex-1">
            <img
              src={mc.photo}
              alt={mc.nameKo}
              className="w-full h-auto md:h-[30.104vw] object-cover object-top rounded-3xl md:rounded-[2.5vw]"
            />
            {/* MC 사인("힐링보이스 장성규") — 사진 우상단 근처, Figma 좌표 환산(사진 대비 left 69%, top 20%, width 21.6%) */}
            <img
              src={mcSign}
              alt=""
              className="absolute w-[21.6%] left-[69%] top-[20%] h-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* 힐링멘토 */}
      <div className="flex flex-col items-center gap-8 md:gap-[1.6667vw] w-full max-w-[1200px]">
        <div className="flex flex-col items-center gap-2 md:gap-[0.4167vw] w-full max-w-[800px] py-2 md:py-[0.8333vw]">
          {/* beam light — 텍스트 위/아래 가로 빛줄기(수평 그라디언트, 중앙 마젠타에서 양끝 짙은 보라로 갈라짐) */}
          <span
            aria-hidden
            className="block w-full max-w-[800px] h-[3px] md:h-[0.4167vw]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(40,20,90,0) 0%, #5A2E9E 15%, #E77BFB 50%, #5A2E9E 85%, rgba(40,20,90,0) 100%)",
            }}
          />
          <h3
            className="text-2xl md:text-[2.5vw] leading-tight font-black text-transparent bg-clip-text"
            style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
          >
            {t("cast.mentorsTitle")}
          </h3>
          <span
            aria-hidden
            className="block w-full max-w-[800px] h-[3px] md:h-[0.4167vw]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(40,20,90,0) 0%, #5A2E9E 15%, #E77BFB 50%, #5A2E9E 85%, rgba(40,20,90,0) 100%)",
            }}
          />
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
