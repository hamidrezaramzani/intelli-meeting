import { StoreProvider } from "@intelli-meeting/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StoreProvider>
    <StrictMode>
      <MemoryRouter>
        <ToastContainer />
        <App />
      </MemoryRouter>
    </StrictMode>
  </StoreProvider>,
);
