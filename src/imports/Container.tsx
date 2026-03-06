import svgPaths from "./svg-epvyekgye0";

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[19px] text-center whitespace-pre-wrap">healingvoice@cgnmail.net</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p31104c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p160c6880} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[7px] items-center left-[27.5px] top-[7px]">
      <Icon />
      <p className="font-['Inter:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[12px] not-italic relative shrink-0 text-[8px] text-center text-white">메일 주소 복사</p>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[#0084d1] h-[28px] relative rounded-[5px] shadow-[0px_5px_7.5px_0px_rgba(2,74,112,0.2),0px_2px_3px_0px_rgba(2,74,112,0.2)] shrink-0 w-[123px]" data-name="Link">
      <Frame />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative size-full" data-name="Container">
      <Paragraph />
      <Link />
    </div>
  );
}