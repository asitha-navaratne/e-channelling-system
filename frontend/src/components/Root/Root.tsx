import { FC } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";

const Root: FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Root;
