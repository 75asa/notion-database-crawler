export class NotionError extends Error {
  constructor(private code: string, message?: string) {
    super(message);
    this.name = new.target.name;
  }
  // 2021-10-13T05:54:52.997115+00:00 app[worker.1]: UnknownHTTPResponseError: Request to Notion API failed with status: 502
  // 2021-10-13T05:54:52.997115+00:00 app[worker.1]: at Object.buildRequestError (/app/node_modules/@notionhq/client/build/src/errors.js:170:12)
  // 2021-10-13T05:54:52.997116+00:00 app[worker.1]: at Client.request (/app/node_modules/@notionhq/client/build/src/Client.js:266:32)
  // 2021-10-13T05:54:52.997116+00:00 app[worker.1]: at processTicksAndRejections (node:internal/process/task_queues:96:5)
  // 2021-10-13T05:54:52.997116+00:00 app[worker.1]: at async getPages (/app/dist/repository/NotionRepository.js:69:26)
  // 2021-10-13T05:54:52.997117+00:00 app[worker.1]: at async NotionRepository.getAllContentsFromDatabase (/app/dist/repository/NotionRepository.js:90:9)
  // 2021-10-13T05:54:52.997117+00:00 app[worker.1]: at async /app/dist/index.js:23:29
  // 2021-10-13T05:54:52.997117+00:00 app[worker.1]: at async Promise.all (index 50)
  // 2021-10-13T05:54:52.997118+00:00 app[worker.1]: at async main (/app/dist/index.js:18:5) {
  // 2021-10-13T05:54:52.997118+00:00 app[worker.1]: code: 'notionhq_client_response_error',
  // 2021-10-13T05:54:52.997118+00:00 app[worker.1]: status: 502,
  // 2021-10-13T05:54:52.997118+00:00 app[worker.1]: headers: Headers {
  // 2021-10-13T05:54:52.997119+00:00 app[worker.1]: [Symbol(map)]: [Object: null prototype] {
  // 2021-10-13T05:54:52.997119+00:00 app[worker.1]: date: [ 'Wed, 13 Oct 2021 05:54:52 GMT' ],
  // 2021-10-13T05:54:52.997119+00:00 app[worker.1]: 'content-type': [ 'text/html; charset=UTF-8' ],
  // 2021-10-13T05:54:52.997119+00:00 app[worker.1]: 'transfer-encoding': [ 'chunked' ],
  // 2021-10-13T05:54:52.997120+00:00 app[worker.1]: connection: [ 'close' ],
  // 2021-10-13T05:54:52.997120+00:00 app[worker.1]: 'set-cookie': [
  // 2021-10-13T05:54:52.997120+00:00 app[worker.1]: 'cf_ob_info=502:69d650d6cad50616:IAD; path=/; expires=Wed, 13-Oct-21 05:55:22 GMT',
  // 2021-10-13T05:54:52.997120+00:00 app[worker.1]: 'cf_use_ob=443; path=/; expires=Wed, 13-Oct-21 05:55:22 GMT'
  // 2021-10-13T05:54:52.997120+00:00 app[worker.1]: ],
  // TODO: ↑ を検知する
  is502Error() {
    return this.code === "502";
  }
}
