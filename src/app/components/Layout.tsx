import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-amber-500 selection:text-black">
      <Toaster position="top-center" theme="dark" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}