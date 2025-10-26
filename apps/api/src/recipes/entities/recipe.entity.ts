import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

@Entity('recipes')
export class Recipe {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { length: 200 })
  title!: string;

  @Column('varchar', { length: 500 })
  description!: string;

  @Column('simple-json')
  ingredients!: Ingredient[];

  @Column('simple-json')
  instructions!: string[];

  @Column('int')
  prepTimeMinutes!: number;

  @Column('int')
  cookTimeMinutes!: number;

  @Column('int')
  servings!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
