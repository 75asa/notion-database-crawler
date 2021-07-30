import { User } from "@prisma/client";
import { Page } from "./entity/Page";
export interface DatabaseDTO {
  id: string;
  name?: string;
  createdAt: Date;
  lastEditedAt: Date;
  lastFetchedAt?: Date;
  pages: PageDTO[];
  size: number;
}

export interface PageDTO {
  id: string;
  name?: string;
  databaseId: string;
  createdAt: Date;
  lastEditedBy?: UserDTO;
  url: string;
}

export interface UserDTO {
  id: string;
  name?: string;
  avatarURL?: string;
  email?: string;
}

export interface PostMessageArg {
  page: Page;
  databaseName?: string;
  user?: User;
}
