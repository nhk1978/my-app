export interface Order{
    id: string
    orderStatus: string 
    orderProducts: OrderProduct[]
}

export interface AddOrder{
    orderStatus: string 
    orderProducts: OrderProduct[]
}

export interface OrderProduct{
    productId: string
    quantity: number
}

export interface UpdateIdOrder{
    id: string,
    updateOrder: UpdateOrder
}

export interface UpdateOrder{
    orderStatus: string 
    orderProducts: OrderProduct[]
}
