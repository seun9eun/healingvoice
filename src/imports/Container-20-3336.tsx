import svgPaths from "./svg-8j7qlnfk06";

function Heading() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[24px] top-[24px] w-[246px]" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Inter:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px not-italic relative text-[20px] text-center text-white whitespace-pre-wrap">이메일 접수</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-center justify-center left-[24px] top-[60px] w-[246px]" data-name="Paragraph">
      <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-center">
        지원서, 영상, 사진을
        <br aria-hidden="true" />
        공식 메일로 보내주세요.
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[189.469px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[95px] not-italic text-[#efeffa] text-[16px] text-center top-[-2px]">healingvoice@cgnmail.net</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p17e9c500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p34d51c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[12px] relative shrink-0 w-[73.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[12px] left-[37px] not-italic text-[11px] text-center text-white top-[-1px]">메일 주소 복사</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#0084d1] h-[28px] relative rounded-[5px] shadow-[0px_5px_7.5px_0px_rgba(2,74,112,0.2),0px_2px_3px_0px_rgba(2,74,112,0.2)] shrink-0 w-[123px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center justify-center pr-[0.016px] relative size-full">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[64px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Button />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[97px] items-start left-[24px] pt-[33px] top-[149.5px] w-[246px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Container2 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(16,24,40,0.5)] border border-[rgba(255,255,255,0.1)] border-solid relative rounded-[16px] size-full" data-name="Container">
      <Heading />
      <Paragraph />
      <Container1 />
    </div>
  );
}