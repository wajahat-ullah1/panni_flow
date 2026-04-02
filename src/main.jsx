import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import App from "./App";
import "./index.css"; // or App.css — whatever your global CSS file is called
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter must wrap everything so all panels can use useNavigate */}
    <BrowserRouter>
      {/* AuthProvider gives every component access to user/token/login/logout */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);