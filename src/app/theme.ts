// 여러 섹션(Hero, BigText, YouTubeEmbed, Cast, Awards)에서 똑같이 반복해서 정의하고 있던
// CSS 그라데이션 문자열들을 한곳에 모아둔 파일이다(2026-09-02 리팩토링).
// 예전엔 같은 값이 파일마다 이름만 다르게(titleGradient / broadcastGradient 등) 복붙되어 있어서,
// 만약 디자인이 바뀌어 색을 하나 고쳐야 하면 그 값이 들어있는 파일을 전부 찾아서 고쳐야 했다.
// 이제는 여기 값만 고치면 사용하는 모든 곳에 한 번에 반영된다.
//
// 이 문자열들은 React의 style={{ backgroundImage: ... }}에 그대로 넣거나,
// text-transparent bg-clip-text 클래스와 함께 써서 글자 자체를 그라데이션으로 칠하는 데 쓰인다.

// 섹션 타이틀/서브텍스트에 가장 많이 쓰이는 하늘색 계열 그라데이션(위→아래로 밝은 하늘색에서 진한 파랑으로).
// 예전 이름: Cast/Awards/YouTubeEmbed/BigText의 titleGradient, Hero의 broadcastGradient — 전부 같은 값이었음.
export const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";

// 흰색에서 연보라색으로 이어지는 그라데이션. "Healing Voice" 브랜드명이나 강조 이름에 사용.
// 예전 이름: BigText의 brandGradient, Cast의 mentorsTitleGradient — 전부 같은 값이었음.
export const brandGradient = "linear-gradient(180deg, #FFFFFF 0%, #A9A9FF 100%)";
