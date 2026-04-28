/**
 * 지원 마감 시간 설정
 */
const DEFAULT_DEADLINE = "2026-05-11T00:00:00+09:00";

// 내부 관리 변수
let currentDeadline = DEFAULT_DEADLINE;
let isTestMode = false;

/**
 * 현재 설정된 마감일을 가져옵니다.
 */
export const getDeadlineDate = () => {
  return currentDeadline;
};

/**
 * 마감 여부를 판단합니다.
 */
export const getIsClosed = () => {
  const deadline = new Date(getDeadlineDate()).getTime();
  return Date.now() >= deadline;
};

// 브라우저 전역 제어 기능
if (typeof window !== 'undefined') {
  /**
   * [Secret] 테스트 모드 활성화 함수
   */
  (window as any).testModeOn = () => {
    isTestMode = true;
    
    (window as any).setDeadline = (input: string | number) => {
      let finalDate = "";
      if (typeof input === 'number') {
        const targetDate = new Date(Date.now() + input * 60000);
        finalDate = targetDate.toISOString();
      } else if (typeof input === 'string' && input.includes(':') && !input.includes('-')) {
        const [hours, minutes] = input.split(':').map(Number);
        const targetDate = new Date();
        targetDate.setHours(hours, minutes, 0, 0);
        finalDate = targetDate.toISOString();
      } else {
        finalDate = input;
      }
      currentDeadline = finalDate;
      console.log(`%c[Deadline] 마감일이 ${finalDate}로 변경되었습니다.`, "color: #ff9800; font-weight: bold;");
    };

    (window as any).openModal = () => {
      window.dispatchEvent(new CustomEvent("open-deadline-modal"));
      console.log("%c[Deadline] 마감 모달을 호출했습니다.", "color: #ff9800; font-weight: bold;");
    };

    console.clear();
    console.log("%c[Healing Voice Test Mode Activated]", "background: #44a9ff; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
    console.log("\n이제 다음 명령어들을 사용할 수 있습니다:");
    console.log("%c1. setDeadline(분)%c : 현재 시간으로부터 n분 뒤 마감", "color: #44a9ff; font-weight: bold;", "");
    console.log("%c2. setDeadline('HH:mm')%c : 오늘 특정 시간에 마감", "color: #44a9ff; font-weight: bold;", "");
    console.log("%c3. openModal()%c : 마감 모달 즉시 확인", "color: #44a9ff; font-weight: bold;", "");
    console.log("%c4. testModeOff()%c : 테스트 모드 종료 및 마감일 원복", "color: #44a9ff; font-weight: bold;", "");
    return "테스트 모드가 활성화되었습니다. 즐거운 테스트 되세요! 🚀";
  };

  /**
   * [Secret] 테스트 모드 비활성화 함수
   */
  (window as any).testModeOff = () => {
    isTestMode = false;
    currentDeadline = DEFAULT_DEADLINE; // 실제 마감일로 원복
    
    // 테스트 함수들 삭제
    delete (window as any).setDeadline;
    delete (window as any).openModal;
    
    console.log("%c[Healing Voice Test Mode Deactivated]", "background: #666; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
    console.log("모든 설정이 실제 마감일(5/11)로 원복되었습니다.");
    return "테스트 모드가 종료되었습니다.";
  };
}
