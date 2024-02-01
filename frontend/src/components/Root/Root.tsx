import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";

const Root = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Root;
