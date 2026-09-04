// 여러 컴포넌트(Cast, Awards 등)에서 "\n"으로 하드 개행이 들어있는 번역 문구를
// 실제 화면에서 줄바꿈(<br/>)으로 보여줄 때 매번 똑같이 반복해서 쓰던 코드를 함수 하나로 뽑았다
// (2026-09-02 리팩토링). 예전엔 아래와 같은 코드가 파일마다 복붙되어 있었다:
//
//   {text.split("\n").map((line, i) => (
//     <span key={i}>
//       {i > 0 && <br />}
//       {line}
//     </span>
//   ))}
//
// 이 프로젝트에서 문구 줄바꿈은 CSS(word-wrap)가 아니라 기획/디자인이 지정한 정확한 위치에서
// 강제로 끊어야 하는 경우가 많아서(예: "국문 모바일은 2줄로 고정" 같은 스펙), 문자열 안에
// "\n"을 직접 넣어두고 그 위치에서 <br/>로 바꿔주는 방식을 쓴다.
//
// 사용법: <p>{renderLines(t("cast.desc"))}</p>
export function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}
