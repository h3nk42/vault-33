import express from "express";
import dataTokenRouter from "./dataToken";
import { docsRouter } from "./docs.route";
import { env } from "../../config/config";
import { authRouter } from "./auth.route";
import { apiKeyRouter } from "./apiKey.route";

const router = express.Router();

const dataTokenRoutes = [
  {
    path: "/dataToken",
    route: dataTokenRouter,
  },
];

const authRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
];
const apiKeyRoutes = [
  {
    path: "/apiKey",
    route: apiKeyRouter,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRouter,
  },
];

dataTokenRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

authRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

apiKeyRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (env.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
