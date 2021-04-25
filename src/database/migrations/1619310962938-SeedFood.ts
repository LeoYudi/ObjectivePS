import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { Food } from '../../entity/Food';
import { Trait } from '../../entity/Trait';

export class SeedFood1619310962938 implements MigrationInterface {

  private foodRepository = getRepository(Food);
  private traitRepository = getRepository(Trait);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const trait = await this.traitRepository.save({ name: 'massa' });
      await this.foodRepository.save({ name: 'lasanha', trait: trait.id });
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      const trait = await this.traitRepository.findOne({ where: { name: 'massa' } });
      await this.traitRepository.remove(trait);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

}
