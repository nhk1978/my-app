export interface Profile {
    id: number
    email: string
    password: string
    role: "User" | "Admin"
    name: string
    avatar: string
}
export {}