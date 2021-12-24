import { PropertyValueRelation } from "~/@types/notion-api-types";

interface RelationPropertyProps {
  key: string;
  property: PropertyValueRelation;
}

export const RelationProperty = ({ key, property }: RelationPropertyProps) => {
  return (
    <>
      <p>
        {/* TODO: 見せ方を考える ID が DB or Page で URL に置き換える？ */}
        <b>{key}</b>: {property.relation.map((item) => item.id).join(", ")}
      </p>
    </>
  );
};
