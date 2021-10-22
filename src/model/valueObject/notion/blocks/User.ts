import { ValueObject } from "../../ValueObject";

export interface UserProps {
  name: string;
  icon: string;
}

export class UserBlock extends ValueObject<UserProps> {
  static create(propValue: UserBlock):  {
    if (!isDetectiveType<PeoplePropertyValue>(propValue)) {
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    }
    const { people } = propValue;
    const peopleList = people
      .map((item) => {
        const { name, type, avatar_url } = item;
        if (type === "bot") {
          return {
            name: name || "",
            icon: avatar_url || "",
          };
        } else if (type === "person") {
          return {
            name: name || "",
            icon: avatar_url || "",
          };
        }
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new UserBlock(peopleList);
  }
}
