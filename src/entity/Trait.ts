import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Food } from './Food';

@Entity()
export class Trait {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Food, food => food.trait, { cascade: true })
  foods: Food[];
}