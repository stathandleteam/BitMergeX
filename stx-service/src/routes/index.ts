import { Application } from "express";

import helloRoutes from "./hello";
import walletRoutes from "./walletRoutes";
import { config } from "../config";

const { API_VERSION } = config;

/*
 * Routes registration
 */

const routes = (app: Application) => {
  const apiPrefix = `/api/${API_VERSION}`;

  // use the same route for both /hello and /api/v1/hello
  app.use(apiPrefix, helloRoutes);

  // // protected routes
  app.use(`${apiPrefix}/stx`, walletRoutes);

  return app;
};

export default routes;