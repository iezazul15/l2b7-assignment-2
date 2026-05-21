import type { Role } from "../../types";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: Role;
  created_at: Date;
  updated_at: Date;
}
