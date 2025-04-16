import { createRoot } from "react-dom/client";
import "./index.css";
import store from "./app/store.js";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { DarkModeProvider } from "./context/DarkModeContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </Provider>
);
