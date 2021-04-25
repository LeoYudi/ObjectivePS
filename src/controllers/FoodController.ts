import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Food } from '../entity/Food';
import { Trait } from '../entity/Trait';

type Return = {
  status: number,
  data: any
}

class FoodController {

  private foodRepository = getRepository(Food);
  private traitRepository = getRepository(Trait);

  async create(req: Request, res: Response): Promise<Return> {
    try {
      const { food, trait } = req.body;

      if (!food || !trait)
        return { status: 400, data: { msg: 'some data is invalid' } };

      const foodExists = await this.foodRepository.findOne({ where: { name: food } });
      if (foodExists)
        return { status: 400, data: { msg: 'food already exists' } }

      const newTrait = await this.getTrait(trait);

      if (!newTrait)
        return { status: 500, data: { msg: 'server error' } };

      const newFood = this.foodRepository.create({ name: food });
      await this.foodRepository.save({ ...newFood, trait: newTrait.id });

      return { status: 200, data: { ...newFood, trait: newTrait.name } }
    } catch (error) {
      console.log(error);
      return { status: 500, data: { msg: 'server error' } };
    }
  }

  private async getTrait(name: string): Promise<Trait | null> {
    try {
      const traitExists = await this.traitRepository.findOne({ where: { name } });

      if (traitExists)
        return traitExists;

      else {
        const newTrait = this.traitRepository.create({ name });
        await this.traitRepository.save(newTrait);
        return newTrait;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async all(req: Request, res: Response): Promise<Return> {
    try {
      const allTraits = await this.traitRepository.find({
        join: {
          alias: 'trait',
          innerJoinAndSelect: {
            foods: 'trait.foods',
          }
        }
      });

      return { status: 200, data: allTraits }
    } catch (error) {
      console.log(error);
      return { status: 500, data: { msg: 'server error' } }
    }
  }
}

export { FoodController };