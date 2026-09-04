import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageBackground } from "./PageBackground";
import { LanguageProvider } from "../context/LanguageContext";

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#061E49] text-white font-sans selection:bg-amber-500 selection:text-black">
        <Toaster position="top-center" theme="dark" />
        <Header />
        {/* Hero 하단부터 Footer까지를 관통하는 공용 배경(별+글로우)이 이 relative 컨테이너 뒤에 깔림 */}
        <div className="relative">
          <PageBackground />
          <div className="relative z-10">
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}