import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; 
import { Providers } from "./providers.tsx";
import { router } from "./routes";  
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <Providers>
    <RouterProvider router={router} />
  </Providers>
</StrictMode>
);
