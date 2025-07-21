import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes/Route";
import { Toaster } from "./components/ui/sonner";
import "./i18n/config";
import AnimatedBackground from "./components/AnimatedBackground";

const router = createBrowserRouter(ROUTES);

function App() {
  return (
    <>
    <AnimatedBackground/>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
