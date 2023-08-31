import { User } from "./User";

export interface UserUpdate{
    id: number,
    update: Omit<User, "id">
}