import { RouterProvider, createBrowserRouter } from "react-router-dom";

import HomePage from "./views/HomePage/HomePage";

import Root from "./components/Root/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    id: "root",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
