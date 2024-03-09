const config = {
  routes: {
    root: "/",
    login: "/login",
    signup: "/signup",
  },

  api: {
    baseUrl: "http://localhost:8000",

    endpoints: {
      auth: "/auth/token",

      user: {
        createUser: "/user/",
        changePassword: "/user/change-password",
      },
    },
  },
};

export default config;
