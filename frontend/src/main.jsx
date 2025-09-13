import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";
import { GoalsProvider } from "./context/GoalsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoalsProvider>
          <App />
        </GoalsProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);