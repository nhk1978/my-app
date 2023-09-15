import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./reducers/productsReducer";
import usersReducer from "./reducers/usersReducer";
import cartReducer from "./reducers/CartSlice";
import categoriesReducer from "./reducers/ordersReducer";
import ordersReducer from "./reducers/ordersReducer";
// import favReducer from "./reducers/favReducer";

const favData = localStorage.getItem("fav");
// const initialState = favData ? JSON.parse(favData) : [];
const cartData = localStorage.getItem("cart")
// const cartInitialState = (cartData === null || cartData === undefined || cartData.length === 0) ? [] : JSON.parse(cartData);
const prodData = localStorage.getItem("products")
// const prodInitialState = (prodData === null || prodData === undefined || prodData.length === 0) ? [] : JSON.parse(prodData);

const store = configureStore({
    reducer: {
        orders: ordersReducer,
        categories: categoriesReducer,
        products: productsReducer,
        users: usersReducer,
        cart: cartReducer
    },
    preloadedState: {

        /* productsReducer: {
            loading: false,
            error: "",
            products: prodInitialState
        },
        usersReducer: {
            loading: false,
            error: "",
            users: []
        }, */
        /* cartReducer: {
            cart: cartInitialState,
            loading: false,
            error: ""
        } */
    }
})
/* store.subscribe(() => {
    localStorage.setItem("fav", JSON.stringify(store.getState().favReducer))
})
store.subscribe(() => {
    localStorage.setItem("cart", JSON.stringify(store.getState().cartReducer.cart));
});
store.subscribe(() => {
    localStorage.setItem("products", JSON.stringify(store.getState().productsReducer.products));
}); */

// store.getState : return the whole global state value

/* type GlobalState = {
    productsReducer: Product[],
    usersReducer: User[]
} */
export type GlobalState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch //type of dispatch method from redux store
export default store