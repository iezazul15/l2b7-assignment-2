import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../types";

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  name: string;
  email: string;
  role: Role;
}
