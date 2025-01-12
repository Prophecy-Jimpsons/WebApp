/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import PATHS from "./paths";
import { RouteConfig } from "./types";
import LoadingSpinner from "@/components/ui/LoadingSpinner/LoadingSpinner";

// Lazy loading components for better performance
const Landing = lazy(() => import("@/pages/Landing/Landing"));
const App = lazy(() => import("@/pages/App/App"));
const RoadMap = lazy(() => import("@/pages/Roadmap/Roadmap"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
const PrivacyPolicy = lazy(
  () => import("@/pages/PrivacyPolicy/PrivacyPolicyPage"),
);
const TermsOfService = lazy(
  () => import("@/pages/TermsOfService/TermsOfServicePage"),
);
const AccountDetails = lazy(
  () => import("@/pages/AccountDetails/AccountDetailsPage"),
);
const WorkInProgress = lazy(
  () => import("@/pages/WorkInProgress/WorkInProgressPage"),
);
const HowToBuy = lazy(() => import("@/pages/HowToBuy/HowToBuyPage"));
const TicTacToe = lazy(() => import("@/pages/TicTacToe/GameBoard"));

// Layout components should be eager loaded
import DashBoardLayout from "@/layouts/DashboardLayout/DashboardLayout";

// Public Routes - No authentication needed
export const publicRoutes: RouteConfig[] = [
  {
    path: PATHS.PUBLIC.LANDING,
    errorElement: <LoadingSpinner text="Oops! Something went wrong..." />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.APP,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <App />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.MARKETPLACE,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <WorkInProgress />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.ROADMAP,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RoadMap />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.NOTFOUND,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.PRIVACY_POLICY,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.ACCOUNT_DETAILS,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AccountDetails />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.TERMS_OF_SERVICE,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.WORK_IN_PROGRESS,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <WorkInProgress />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.HOW_TO_BUY,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HowToBuy />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.TIC_TAC_TOE,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TicTacToe />
          </Suspense>
        ),
      },
    ],
  },
];

// Protected Routes - Require wallet connections
export const protectedRoutes: RouteConfig[] = [
  {
    path: PATHS.PROTECTED.DASHBOARD,
    element: <DashBoardLayout />,
    errorElement: <LoadingSpinner text="Oops! Something went wrong..." />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner text="Loading Dashboard..." />}>
            <Dashboard />
          </Suspense>
        ),
        loader: async () => {
          // Fetch initial dashboard data
          // return fetchDashBoardData();
        },
      },
    ],
  },
];
