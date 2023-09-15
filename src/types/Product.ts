import { updateProduct } from "../redux/reducers/productsReducer"
import { Category } from "./Category"

export interface Product{
    id: string
    title: string
    price: number
    description: string,
    images: string[],
    category: Category,
    inventory: number
}
export interface UpdateIdProduct{
    id: string,
    product: UpdateProduct
}

export interface UpdateProduct{
    title: string
    price: number
    description: string,
    images: string[],
    categoryId: string,
    inventory: number
}

export interface AddProduct{
    title: string
    price: number
    description: string,
    images: string[],
    categoryId: string,
    inventory: number
}

export interface CartProps {
    product: Product
    quantity: number
  }