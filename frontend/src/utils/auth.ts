import { redirect } from "react-router-dom";

import config from "../configs/urls.config";

const getAuthToken = function () {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect(config.routes.landing);
  }

  return token;
};

export const tokenLoader = function () {
  return getAuthToken();
};
