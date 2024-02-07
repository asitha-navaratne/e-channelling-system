import axios from "axios";

import config from "../configs/urls.config";

const AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 5000,
});

export default AxiosInstance;
