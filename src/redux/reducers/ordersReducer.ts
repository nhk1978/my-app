import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AddOrder, Order, UpdateIdOrder } from "../../types/Order";



const initialState:  {
    orders: Order[];
    selectedOrder: any;
    filteredOrders: Order[];
    loading: boolean;
    error: string;
} = {
    orders: [],
    selectedOrder: {},
    filteredOrders: [],
    loading: false,
    error: "",
};



const axiosInstance = axios.create({
    baseURL: "http://localhost/api/v1/"
})



export const getOrder = createAsyncThunk(
    "getOrder",
    async () => {
        try {
            const result = await axiosInstance.get(
                `order`               
              );              
              return result.data
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
)

export const createOrder = createAsyncThunk(
    "createOrder",
    async ( order: AddOrder) => {
        try {
            const result = await axiosInstance.post(
                `order`, order,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}
            );              
            return result.data
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
)

export const updateOrder = createAsyncThunk(
    "updateOrder",
    async ({id,updateOrder}: UpdateIdOrder) => {
        try {
            const result = await axiosInstance.patch(
                `order/${id}`, updateOrder,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}

              );              
              return result.data
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
);

export const payOrder = createAsyncThunk(
    "payOrder",
    async (id: string) => {
        try {
            const result = await axiosInstance.patch(
                `order/${id}/pay-an-order`, updateOrder,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}

              );              
              return result.data
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "deleteOrder",
    async ( id: string, { dispatch}) => {
        try {
            const result = await axiosInstance.delete(
                `order/${id}`,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}

              );              
              return result.data
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
);

/* update, and delete */

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        cleanUpOrderReducer: (state) => {
            return initialState
        },

    }, // list of methods to modify the state,
    extraReducers: (build) => {
        build
            .addCase(getOrder.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.loading = false
                state.error = "Cannot perform this action. Please try again later"
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.loading = false
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.orders = action.payload
                }
            })
            
            .addCase(createOrder.fulfilled, (state, action) => {
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.orders.push(action.payload)
                }
                state.loading = false
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    const updatedOrder = action.payload as Order
                    const Orders = state.orders.map(ord => {
                        if(ord.id === updatedOrder.id){
                            return {...ord, ...updatedOrder};
                        }
                        return ord;
                    });
                    state.orders = Orders;
                }
                state.loading = false
            })
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrder.rejected, (state) => {
                state.error = "Cannot update Order";
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                if (JSON.stringify( action.payload) !== "true") {
                    state.error = 'error'
                }       
                else{
                    //state.Orders.splice()
                }         
                state.loading = false
            })
    }
})

//OrderReducer: current state
const ordersReducer = ordersSlice.reducer
export const { cleanUpOrderReducer } = ordersSlice.actions
export default ordersReducer