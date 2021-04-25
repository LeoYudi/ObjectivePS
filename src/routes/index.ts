import { foodRoutes } from './foodRoutes';

type Route = {
  method: string,
  route: string,
  controller: any,
  action: string
}

export const Routes: Route[] = foodRoutes;
