import { DateProperty, SelectProperty, VisibleProps } from ".";
import { PropertyValueMap } from "../../../@types/notion-api-types";
import { Config } from "../../../Config";
import { ValueObject } from "../ValueObject";

const { VISIBLE_PROPS } = Config.Notion;

export class VisibleProperties extends ValueObject<VisibleProps> {
  static create(propValues: PropertyValueMap): VisibleProperties {
    const visibleProps = VISIBLE_PROPS.map((propName) => {
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
    }).filter(
      (item): item is Exclude<typeof item, undefined> => item !== undefined
    );

    return new VisibleProperties(visibleProps);
  }
}
