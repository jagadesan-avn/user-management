import { createBrowserRouter } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import { lazy, Suspense } from "react";
import PageNotFound from "./pages/404";
import Loader from "./components/Loader";

const LazyLogin = lazy(() => import("./pages/Login"));
const LazyUsers = lazy(() => import("./pages/Users"));
const LazyLayout = lazy(() => import("./components/Layout"));

const withSuspense = (Component) => <Suspense fallback={<Loader />}>{Component}</Suspense>;
const routes = [
  {
    path: "/login",
    element: withSuspense(<LazyLogin />),
  },
  {
    path: "/",
    element: withSuspense(<Authenticate><LazyLayout /></Authenticate>),
    children: [
      { path: "users", element: <LazyUsers /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
];

export const AppRoutes = createBrowserRouter(routes);