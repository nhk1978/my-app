import { createSlice } from "@reduxjs/toolkit"
import { CartProps } from "../../types/Product"
import { CartItem } from "../../types/CartItem"



interface CartReducer {
    cart: CartProps[],
    loading: false,
    error: ""
}
const initialState: CartReducer = {
    cart: [],
    loading: false,
    error: ""
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {            
            const itemPresent = state.cart.find((item: CartProps) => item.product.id === action.payload.id)
            if (itemPresent) {
                itemPresent.quantity++
            }
            else {
                const addCartProd: CartProps = {
                    product:{
                        id: action.payload.id,
                        title: action.payload.title,
                        price: action.payload.price,      
                        description: action.payload.description,
                        images: action.payload.images,
                        category: action.payload.category,
                        inventory: action.payload.inventory
                    },
                    quantity: 1
                }
                state.cart.push(addCartProd)
                // state.cart.push({...action.payload,quantity:1})
            }
            // console.log("after add: "+ JSON.stringify(state.cart))
        },
        removeFromCart: (state, action) => {
            const removeItem = state.cart.filter((item) => item.product.id !== action.payload.id)
            state.cart = removeItem
        },
        incrementQuantity: (state, action) => {
            const itemPresent = state.cart.find((item) => item.product.id === action.payload.id)
            if (itemPresent) itemPresent.quantity++
        },
        decrementQuantity: (state, action) => {
            const itemPresent = state.cart.find((item) => item.product.id === action.payload.id)
            if (itemPresent) {
                if (itemPresent.quantity === 1) {
                    const removeItem = state.cart.filter((item) => item.product.id !== action.payload.id)
                    state.cart = removeItem
                }
                else
                    itemPresent.quantity--
            }
        },
        cleanCart:(state) => {
            state.cart = []
        } 

    }
})

export type CartState = ReturnType<typeof cartReducer>;
const cartReducer = cartSlice.reducer
export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, cleanCart } = cartSlice.actions
// export const { addToCart } = cartSlice.actions
export default cartReducer