export interface Category {
    id: string
    title: string
    image: string
    description: string
}

export interface UpdateIdCategory{
    id: string
    category: UpdateCategory
}

export interface AddCategory {
    title: string
    image: string
    description: string
}

export interface UpdateCategory {
    title: string
    image: string
    description: string
}