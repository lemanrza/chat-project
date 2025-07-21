import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes/Route";
import "./i18n/config";
import AnimatedBackground from "./components/AnimatedBackground";
import { SnackbarProvider } from "notistack";

const router = createBrowserRouter(ROUTES);

function App() {
  return (
    <>
      <AnimatedBackground />
      <RouterProvider router={router} />
      <SnackbarProvider />
    </>
  );
}

export default App;
