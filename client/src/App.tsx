import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes/Route";
import "./i18n/config";
import AnimatedBackground from "./components/AnimatedBackground";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./store/store";

const router = createBrowserRouter(ROUTES);

function App() {
  return (
    <>
      <Provider store={store}>
        <AnimatedBackground />
        <RouterProvider router={router} />
        <SnackbarProvider />
      </Provider>

    </>
  );
}

export default App;
