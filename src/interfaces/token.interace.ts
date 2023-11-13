import { IUser } from "./user.interface";

export interface IToken {
    id: number;
    user: IUser;
    type: string;
    expires_at: Date;
  }
  