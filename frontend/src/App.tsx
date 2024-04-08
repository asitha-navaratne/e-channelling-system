import { RouterProvider, createBrowserRouter } from "react-router-dom";

import config from "./configs/urls.config";

import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";
import SignUpPage from "./views/SignUpPage/SignUpPage";
import LandingPage from "./views/LandingPage/LandingPage";

import Root from "./components/Root/Root";

import { tokenLoader } from "./utils/auth";
import loginLoader from "./views/LoginPage/LoginPage.loader";
import loginAction from "./views/LoginPage/LoginPage.action";
import signUpLoader from "./views/SignUpPage/SignUpPage.loader";
import signUpAction from "./views/SignUpPage/SignUpPage.action";

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
    action: loginAction,
  },
  {
    path: config.routes.signup,
    element: <SignUpPage />,
    id: "signup",
    loader: signUpLoader,
    action: signUpAction,
  },
  {
    path: config.routes.landing,
    element: <LandingPage />,
    id: "landing",
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
