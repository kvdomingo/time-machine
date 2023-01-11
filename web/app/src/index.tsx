import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import App from "./App";
import { AxiosInterceptorProvider } from "./api";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import theme from "./themes";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <AxiosInterceptorProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <CssBaseline />
              <App />
            </LocalizationProvider>
          </ThemeProvider>
        </AxiosInterceptorProvider>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
