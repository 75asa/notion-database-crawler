import { PropertyValueUser } from "../../../../../@types/notion-api-types";
import { ValueObject } from "../../../ValueObject";

export interface UserBlockProps {
  name: string;
  icon: string;
}

export class UserBlock extends ValueObject<UserBlockProps> {
  private constructor(props: UserBlockProps) {
    super(props);
  }
  static create(propValue: PropertyValueUser): UserBlock {
    const { name, avatar_url } = propValue;
    if (!name) {
      throw new Error("UserBlock: name is missing");
    }
    return new UserBlock({
      name,
      icon: avatar_url || "",
    });
  }
}
