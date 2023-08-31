export interface User {
    id: number
    email: string
    password: string
    role: "customer" | "admin"
    name: string
    avatar: string
}

export interface NewUser 
{
    email: string
    password: string
    // role: "customer" | "admin"
    name: string
    avatar: string
    //file: File | null
  }