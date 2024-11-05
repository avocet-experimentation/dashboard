import React from "react";
import { Provider } from "./components/ui/provider.tsx";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/stylesheets/index.css";
import { Theme } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <Theme appearance="light">
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>
);
