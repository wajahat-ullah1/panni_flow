import { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import RegisterCompany from "./pages/RegisterCompany";
import Subscriptions from "./pages/Subscriptions";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; }
        `}</style>
        <Login onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

  const renderPage = () => {
    switch (activeNav) {
      case "Dashboard":
        return <Dashboard setActive={setActiveNav} />;
      case "Companies":
        return <Companies setActive={setActiveNav} />;
      case "Register Company":
        return <RegisterCompany setActive={setActiveNav} />;
      case "Subscriptions":
        return <Subscriptions setActive={setActiveNav} />;
      default:
        return (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#cbd5e1" strokeWidth="1.5"/>
              <path d="M3 9h18M9 21V9" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#64748b" }}>{activeNav}</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>This page is under construction</div>
          </div>
        );
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}>
        <Sidebar
          active={activeNav}
          setActive={setActiveNav}
          onLogout={() => setIsLoggedIn(false)}
        />
        {renderPage()}
      </div>
    </>
  );
}