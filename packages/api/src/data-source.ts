import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import UserSeeder from "./database/seeds/userSeeder";
import userFactory from "./database/factories/userFactory";
import CourseSeeder from "./database/seeds/courseSeeder";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "code_mastery",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: [],
  subscribers: [],
  seeds: [UserSeeder, CourseSeeder],
  factories: [userFactory]
}

export const db = new DataSource(options);
