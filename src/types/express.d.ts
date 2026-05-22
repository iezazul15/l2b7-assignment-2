import type { AuthUser } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};

/** TOTALLY COPY PASTED FROM CHATGPT **/
