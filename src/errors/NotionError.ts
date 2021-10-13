export class NotionError extends Error {
  constructor(private code: string, message?: string) {
    super(message);
    this.name = new.target.name;
  }
  is502Error() {
    return this.code === "502";
  }
}
