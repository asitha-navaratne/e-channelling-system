import { FC } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";

const Root: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Root;
