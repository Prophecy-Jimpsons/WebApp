/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import PATHS from "./paths";
import { RouteConfig } from "./types";

// Lazy loading components for better performance
const Landing = lazy(() => import("@/pages/Landing/Landing"));
// const App = lazy(() => import("@/pages/App/App")); // need to change this
// const Marketplace = lazy(() => import("@/pages/Marketplace/Marketplace")); // need to change this
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

// Layout components should be eager laoded
// import MainLayout from "@/layouts/MainLayout/MainLayout";
import DashBoardLayout from "@/layouts/DashboardLayout/DashboardLayout";

// Public Routes - No authentication needed
export const publicRoutes: RouteConfig[] = [
  {
    path: PATHS.PUBLIC.LANDING,
    // element: <MainLayout />,
    errorElement: <h1>Error Page</h1>, // replace with <ErrorBoundary/>
    children: [
      {
        index: true,
        element: (
          // replace with <LoadingSpinner/>
          <Suspense fallback={<h1>Loading Spinner</h1>}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.APP,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            {/* <App />  // need to change this */}
            <WorkInProgress />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.MARKETPLACE,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            {/* <Marketplace />  // need to change this */}
            <WorkInProgress />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.ROADMAP,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <RoadMap />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.NOTFOUND,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.PRIVACY_POLICY,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.ACCOUNT_DETAILS,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <AccountDetails />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.TERMS_OF_SERVICE,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.WORK_IN_PROGRESS,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <WorkInProgress />
          </Suspense>
        ),
      },
      {
        path: PATHS.PUBLIC.HOW_TO_BUY,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
            <HowToBuy />
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
    errorElement: <h1>Error Page</h1>, // replace with <ErrorBoundary/>
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<h1>LoadingSpinner</h1>}>
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
