
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { LabProvider } from "./context/LabContext"; // LabContext wrap

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <LabProvider>
      <App />
    </LabProvider>

  </React.StrictMode>
);
