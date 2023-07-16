import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/900.css";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import App from "./App";
import { AxiosInterceptorProvider } from "./api";
import "./index.css";
import { store } from "./store/store";
import theme from "./themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <AxiosInterceptorProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <App />
              </LocalizationProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </AxiosInterceptorProvider>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
);
