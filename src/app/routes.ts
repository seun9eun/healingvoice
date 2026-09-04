import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { NoticePage } from "./pages/NoticePage"; // 1. NoticePage를 임포트하세요!

// 라우터 설정 — 실제 화면에 연결되는 페이지들을 주소(path)와 매핑한다.
// path에 있는 ":lang?" 는 "/ko", "/en" 처럼 언어 코드가 주소 맨 앞에 붙는다는 뜻이고
// 물음표(?)가 있어서 언어 코드 없이 "/"로 접속해도 동작한다(LanguageContext가 기본 언어를 정함).
export const router = createBrowserRouter([
  {
    path: "/:lang?",
    Component: Layout,
    children: [
      {
        index: true,
        Component: LandingPage
      },
      {
        path: "notice", // 2. 새로운 경로 추가 (주소창에 /notice라고 치면 나옴)
        Component: NoticePage
      },
    ],
  },
]);