import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";
export interface PostMessageArg {
  page: Page;
  databaseName?: string;
  user?: User;
}
