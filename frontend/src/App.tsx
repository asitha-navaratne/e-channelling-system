import { RouterProvider, createBrowserRouter } from "react-router-dom";

import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";

import Root from "./components/Root/Root";

import { tokenLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
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
    path: "/login",
    element: <LoginPage />,
    id: "login",
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
