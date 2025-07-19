import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes/Route";
import { Toaster } from "./components/ui/sonner";
import "./i18n/config";

const router = createBrowserRouter(ROUTES);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
