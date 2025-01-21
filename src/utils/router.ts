import { RouteConfig } from "@/config/routes";

export function matchPath(pathname: string, route: RouteConfig): boolean {
  const routePath = route.path.replace(/:[^/]+/g, "[^/]+");
  const regex = new RegExp(`^${routePath}$`);
  return regex.test(pathname);
}

export function generatePath(
  path: string,
  params: Record<string, string> = {}
): string {
  return path.replace(/:([^/]+)/g, (_, param) => params[param] || "");
}
