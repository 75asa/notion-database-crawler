/** @jsxImportSource jsx-slack **/
import JSXSlack, { Blocks, Mrkdwn, Section, Divider } from "jsx-slack";
import { Page } from "model/entity/Page";

export const MainBlocks = (
  databaseName: string,
  page: Page,
  contents: JSXSlack.JSX.Element[]
) => {
  const { name, url, rawProperties } = page;
  return (
    <Blocks> <Section>
        <Mrkdwn>
          <b>{databaseName}</b> に新しいページ: <a href={url}>{name}</a>
          が投稿されました
        </Mrkdwn>
      </Section>
      <Divider />
      {/* {...contents} */}
    </Blocks>
  );
};

// {
//   '{"id": "KF%3Fn", "type": "created_by", "created_by": {"id": "049d2f20-6faf-490c-8c20-641b8e5fcc21", "object": "user"}}',
//     '{"id": "%5B%5D%5DL", "date": {"end": null, "start": "2021-11-19"}, "type": "date"}',
//     '{"id": "%5D%3BYX", "type": "last_edited_by", "last_edited_by": {"id": "d11ad3bd-9709-4ec3-bc0d-7645c2ac0cc1", "name": "ナゴアサ ⑦❺", "type": "person", "object": "user", "person": {"email": "asato.nago@tam-bourine.co.jp"}, "avatar_url": "https://lh3.googleusercontent.com/a-/AOh14Gi-jLJlNkrXxr_qDjpu9qCEH-pt3kVNQ5-MhCrt=s100"}}',
//     '{"id": "qJw%3A", "type": "created_time", "created_time": "2021-11-19T08:43:00.000Z"}',
//     '{"id": "wGdf", "type": "checkbox", "checkbox": true}',
//     '{"id": "yxQn", "type": "multi_select", "multi_select": []}',
//     '{"id": "title", "type": "title", "title": [{"href": null, "text": {"link": null, "content": "😄 臥薪嘗胆"}, "type": "text", "plain_text": "😄 臥薪嘗胆", "annotations": {"bold": false, "code": false, "color": "default", "italic": false, "underline": false, "strikethrough": false}}]}',
//     '{"id": "24fee19a-09fe-4c0f-ba5c-f9d3d19375e1", "type": "select", "select": {"id": "3ac7666d-69b5-49d8-b5d2-2cb02d48ea80", "name": "😀 Good", "color": "gray"}}',
//     '{"id": "4bf022a7-5f71-4e09-ad32-5270bd020bb6", "type": "select", "select": {"id": "c372bd0c-fe4c-4542-88c3-5c49d72d9de1", "name": "🥲 Bad", "color": "purple"}}',
//     '{"id": "e4a61e0e-0081-4210-8066-569320cc97ff", "type": "select", "select": {"id": "3ac7666d-69b5-49d8-b5d2-2cb02d48ea80", "name": "😀 Good", "color": "gray"}}';
// }
