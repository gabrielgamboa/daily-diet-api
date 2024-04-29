// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from "knex";

interface Users {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Meals {
  id: string;
  user_id: string;
  name: string;
  description: string;
  date: Date;
  is_on_diet: boolean;
  created_at: string;
  updated_at: string;
}

declare module "knex/types/tables" {
  export interface Tables {
    users: Users;
    meals: Meals;
  }
}
