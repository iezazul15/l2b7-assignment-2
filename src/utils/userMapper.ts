import type { IUser } from "../modules/auth/auth.interface";
import type { SafeUser } from "../types";

const userMapper = (obj: IUser): SafeUser => {
  const { password, ...safe } = obj;
  return safe;
};

export { userMapper };
