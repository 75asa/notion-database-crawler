import { Page } from "./entity/Page";
import { User } from "./entity/User";
export interface PostMessageArg {
  page: Page;
  databaseName?: string;
  user?: User;
}
