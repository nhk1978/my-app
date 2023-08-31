export interface Profile {
    id: number
    email: string
    password: string
    role: "customer" | "admin"
    name: string
    avatar: string
}
export {}