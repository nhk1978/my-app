import { UpdateUser } from "./User";

export interface UserUpdate{
    id: string,
    update: Omit<UpdateUser, "id">
}