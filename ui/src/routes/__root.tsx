import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Helmet } from "react-helmet";

import { RouterDevTools } from "@/components/shared/DevTools.tsx";
import GlobalNotification from "@/components/shared/GlobalNotification.tsx";

import { Toaster } from "@/components/ui/sonner.tsx";
import type { RouterContext } from "@/types/router.ts";
import { Suspense } from "react";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Helmet>
        <link rel="icon" href="/logo192.png" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Helmet>

      <main>
        <Outlet />
      </main>

      <Toaster position="bottom-left" closeButton />
      <GlobalNotification />
      <Suspense>
        <RouterDevTools />
      </Suspense>
    </>
  ),
});
