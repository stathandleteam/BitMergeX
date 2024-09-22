import { Application } from "express";

import helloRoutes from "./hello";
import authRoutes from "./auth";
import { config } from "../config";

const { API_VERSION } = config;

/*
 * Routes registration
 */
const routes = (app: Application) => {
  const apiPrefix = `/api/${API_VERSION}`;

  // use the same route for both /hello and /api/v1/hello
  app.use(apiPrefix, helloRoutes);

//   // authentication routes
  app.use(apiPrefix, authRoutes);

//   // protected routes
//   app.use(apiPrefix, protectedRoutes);

//   // admin routes
//   app.use(`${apiPrefix}/admin`, adminRoutes);

//   // protected routes
//   app.use(apiPrefix, dataRoutes);

  return app;
};

export default routes;