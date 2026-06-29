import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store  from "./store.js";



const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
      <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
      </BrowserRouter>
  </StrictMode>
);
