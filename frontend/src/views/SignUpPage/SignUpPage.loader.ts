import { redirect } from "react-router-dom";

import config from "../../configs/urls.config";

function loader() {
  const token = localStorage.getItem("token");

  if (token) {
    return redirect(config.routes.root);
  }

  return null;
}

export default loader;
