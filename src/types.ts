import { Page, User } from "./entity";
export interface PostMessageArg {
  page: Page;
  databaseName?: string;
  user?: User;
}
