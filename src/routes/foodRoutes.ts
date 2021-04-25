import { FoodController } from "../controllers/FoodController";

export const foodRoutes = [{
  method: 'post',
  route: '/food',
  controller: FoodController,
  action: 'create'
}, {
  method: 'get',
  route: '/all',
  controller: FoodController,
  action: 'all'
}];