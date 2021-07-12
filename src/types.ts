export interface DatabaseDTO {
  id?: string;
  notionId: string;
  createdAt: Date;
  lastEditedAt: Date;
  lastFetchedAt?: Date;
  pages: PageDTO[];
  size: number;
}

export interface PageDTO {
  notionId: string;
  id?: string;
  databaseId?: string;
  createdAt: Date;
  name?: string;
  url: string;
}
