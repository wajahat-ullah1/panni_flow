import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import RegisterCompany from "./pages/RegisterCompany";
import Subscriptions from "./pages/Subscriptions";

export default function SuperAdminApp() {
  const navigate = useNavigate();

  // Guard — if no token redirect to login
  const token = localStorage.getItem("superAdminToken");
  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminUser");
    navigate("/super-admin/login", { replace: true });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <Sidebar onLogout={handleLogout} />
        <Routes>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<Dashboard />} />
          <Route path="companies"         element={<Companies />} />
          <Route path="register-company"  element={<RegisterCompany />} />
          <Route path="subscriptions"     element={<Subscriptions />} />
          <Route path="*"                 element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}