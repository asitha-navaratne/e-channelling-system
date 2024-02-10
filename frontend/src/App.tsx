import { RouterProvider, createBrowserRouter } from "react-router-dom";

import config from "./configs/urls.config";

import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";

import Root from "./components/Root/Root";

import { tokenLoader } from "./utils/auth";
import loginLoader from "./views/LoginPage/LoginPage.loader";

const router = createBrowserRouter([
  {
    path: config.routes.root,
    element: <Root />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: config.routes.login,
    element: <LoginPage />,
    id: "login",
    loader: loginLoader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
