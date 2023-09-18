export interface User {
    id: string
    email: string
    role: "User" | "Admin"
    firstName: string
    lastName: string
    avatar: string
    dateOfBirth: string
}

export interface NewUser 
{
    email: string
    password: string
    firstName: string
    lastName: string
    avatar: string
    dateOfBirth: string
    // phoneNumber: string
    // address:string
  }
export interface UpdateUser 
{
    // email: string
    // password: string
    firstName: string
    lastName: string
    avatar: string
    // dateOfBirth: string
    // phoneNumber: string
    // address:string
  }