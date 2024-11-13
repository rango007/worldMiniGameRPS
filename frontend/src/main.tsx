// main.tsx
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import MiniKitProvider from "./minikit-provider";
import { StrictMode } from "react";
import { ErudaProvider } from "./components/Eruda";
// Import Firebase configuration to initialize Firebase at startup
//import "./services/firebaseConfig"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErudaProvider>
      <MiniKitProvider>
        <App />
      </MiniKitProvider>
    </ErudaProvider>
  </StrictMode>
);
