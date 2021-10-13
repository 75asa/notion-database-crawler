export class NotionError extends Error {
  constructor(private code: string, message: string) {
    super(message);
    this.name = new.target.name;
  }
  is502Error() {
    return (
      this.code === "notionhq_client_response_error" &&
      this.message === "Request to Notion API failed with status: 502"
    );
  }
}
