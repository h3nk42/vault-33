import express from "express";
import tokenRouter from "./token.route";
import docsRoute from "./docs.route";
import { env } from "../../config/config";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/token",
    route: tokenRouter,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (env.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
