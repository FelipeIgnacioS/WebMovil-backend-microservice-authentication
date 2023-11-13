import { IUser } from "./user.interface";

export interface IProfile {
    id: number;
    nickname?: string;
    user?: IUser;
    first_name?: string;
    last_name?: string;
    job_position?: string;
    location?: string;
    profile_picture?: string;
    contact?: string;
  }
  