export interface DatabaseDTO {
  notionId: string;
  createdAt: string;
  lastEditedAt: string;
  pages: PageDTO[];
  size: number;
}

export interface PageDTO {
  notionId: string;
  databaseId?: String;
  createdAt: string;
  name?: string;
  url: string;
}
