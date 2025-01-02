import { FC } from "react";
import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
  Navigate,
} from "react-router-dom";
import { publicRoutes, protectedRoutes } from "./routes";
import PrivateRoute from "./PrivateRoute";
import DashBoardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import PATHS from "./paths";
// import useWallet from "@/hooks/useWallet";

const RouterProvider: FC = () => {
  // const { isConnected } = useWallet();

  const router = createBrowserRouter(
    [
      ...publicRoutes,
      {
        element: (
          <PrivateRoute>
            <DashBoardLayout />
          </PrivateRoute>
        ),
        children: protectedRoutes,
      },
      // Catch 404 error and if no routes found, redirect to not found 404 page.
      {
        path: "*",
        element: <Navigate to={PATHS.PUBLIC.NOTFOUND} replace />,
      },
    ],
    {
      future: {
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_fetcherPersist: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );

  return <ReactRouterProvider router={router} />;
};

export default RouterProvider;
