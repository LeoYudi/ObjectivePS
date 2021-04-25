import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trait } from './Trait';


@Entity()
export class Food {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100
  })
  name: string;

  @ManyToOne(() => Trait, trait => trait.foods, { onDelete: 'CASCADE' })
  trait: Trait;
}
