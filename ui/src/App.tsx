import { RouterProvider, createRouter } from "@tanstack/react-router";

import { queryClient } from "./api";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
