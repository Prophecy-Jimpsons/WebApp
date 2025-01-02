import React, { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useWallet from "@/hooks/useWallet";
import PATHS from "./paths";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { isConnected, isConnecting } = useWallet();

  //Get current location for redirect after login
  const location = useLocation();

  if (isConnecting) {
    return <h1>Loading...</h1>;
  }

  if (!isConnected) {
    return (
      <Navigate
        to={PATHS.PUBLIC.CONNECT_WALLET}
        // Saving attempted URL for redirect after connection
        state={{ from: location }}
        replace
      />
    );
  }

  //   If connected, render the protected routes
  return <>{children}</>;
};

export default PrivateRoute;
