import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PropertyDataProvider } from "./hooks/usePropertyData";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PropertyDataProvider>
      <App />
    </PropertyDataProvider>
  </StrictMode>,
);
