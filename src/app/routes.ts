import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { NoticePage } from "./pages/NoticePage"; // 1. NoticePage를 임포트하세요!
import { PreviewPage } from "./pages/PreviewPage";

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