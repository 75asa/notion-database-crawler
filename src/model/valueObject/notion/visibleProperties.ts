import { PropertyValueMap } from "@notionhq/client/build/src/api-endpoints";
import { DateProperty, SelectProperty } from ".";
import { Config } from "../../../Config";
import { ValueObject } from "../ValueObject";
import * as DatabaseProperties from "./databaseProperties";

const { VISIBLE_PROPS } = Config.Notion;

export class VisibleProperties extends ValueObject<
  typeof DatabaseProperties[]
> {
  static create(propValues: PropertyValueMap): VisibleProperties {
    const visibleProps = VISIBLE_PROPS.split(",")
      .map((propName) => {
        const targetPropValue = propValues[propName];
        switch (targetPropValue.type) {
          case "select": {
            return SelectProperty.create(targetPropValue);
          }
          case "date": {
            return DateProperty.create(targetPropValue);
          }
          default: {
            break;
          }
        }
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );

    return new VisibleProperties(visibleProps);
  }
}
