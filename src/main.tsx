import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TwitchAuthProvider } from "./context/TwitchAuthContext";
import { BasePage } from "./components/BasePage.tsx";
import { ThumbnailProvider } from "./context/ThumbnailContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TwitchAuthProvider>
      <ThumbnailProvider>
        <BasePage>
          <App />
        </BasePage>
      </ThumbnailProvider>
    </TwitchAuthProvider>
  </StrictMode>
);
