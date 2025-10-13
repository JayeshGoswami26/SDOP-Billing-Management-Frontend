import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BillingProvider } from "./context/BillingContext.tsx";
import { Provider } from "react-redux";
import store from "./store/store";
import { getAuth } from "./utils/auth";
import { setUser } from "./store/authSlice";

// Rehydrate Redux store from localStorage if user/token exist
const { user, token } = getAuth();
if (user && token) {
  store.dispatch(setUser({ user, token }));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BillingProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </BillingProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
