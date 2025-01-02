import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";

export type RouteConfig = (
  | (IndexRouteObject & { children?: RouteConfig[] })
  | (NonIndexRouteObject & { children?: RouteConfig[] })
) & {
  loader?: () => Promise<unknown>;
};
