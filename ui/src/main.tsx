import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";

import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/900.css";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { QueryDevTools } from "@/components/shared/DevTools.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AxiosInterceptorProvider, queryClient } from "./api";
import "./index.css";
import theme from "./themes";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AxiosInterceptorProvider>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <CssBaseline />
              <App />
              <Suspense>
                <QueryDevTools />
              </Suspense>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </AxiosInterceptorProvider>
  </React.StrictMode>,
);
