import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // changed
import App from "./App";
import './output.css';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from "./components/AuthContext";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HashRouter>
      <CookiesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CookiesProvider>
    </HashRouter>
  </React.StrictMode>
);
