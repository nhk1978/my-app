import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Product, UpdateIdProduct, UpdateProduct } from "../../types/Product";
import axios, { AxiosError } from "axios";
import { AddProduct } from "../../types/Product";

const initialState:  {
    products: Product[];
    selectedProduct: any;
    filteredProducts: Product[];
    loading: boolean;
    error: string;
} = {
    products: [],
    selectedProduct: {},
    filteredProducts: [],
    loading: false,
    error: "",
};

/* createSlice() returns 1 object {
    reducer, action, ...
} */

/* Create CRUD operations: create, read, update, delete */
interface FetchQuery {
    offset: number
    limit: number
    categoryID: number
}

interface FetchFilterQuery {
    offset: number
    limit: number
    categoryID?: number
    priceMin?: number
    priceMax?: number,
    order?: "asc" | "des"
}

const axiosInstance = axios.create({
    baseURL: "http://localhost/api/v1/"
})



export const fetchAllProducts = createAsyncThunk(
    'fetchAllProducts',
    async ({id, min,max}: { id?:string, min?:number, max?:number} = {}) => {
    // async (  {}) => {
      try {       
        
        if (min !== undefined && max !== undefined && id === undefined) {
          const result = await axiosInstance.get<Product[]>(`product/?price_min=${min}&price_max=${max}`);
          return result.data
        }
        else if (min === undefined && max === undefined && id !== undefined) {
          const result = await axiosInstance.get<Product[]>(`product/?categoryId=${id}`);
          return result.data;
        }
        else if (min !== undefined && max !== undefined && id !== undefined) {
          const result = await axiosInstance.get<Product[]>(`product/?price_min=${min}&price_max=${max}&categoryId=${id}`);
          return result.data;
        }
        else {
          const result = await axiosInstance.get<Product[]>("product");
          return result.data; // The returned result will be inside action.payload
        }
      } catch (e) {
        const error = e as AxiosError;
        return error.message;
      }
    }
);

export const createProduct = createAsyncThunk(
    "createProduct",
    async ( product: AddProduct) => {
        try {
            const result = await axiosInstance.post<Product>(
                "product", product,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}
            );
            // console.log("Reducer new product: " + JSON.stringify(result.data))
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

export const updateProduct = createAsyncThunk(
    "updateProduct",
    async ({id, product}: UpdateIdProduct) => {
        try {            
              const result = await axiosInstance.patch<Product>(
                `product/${id}`, 
                product,
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },});
            // console.log("Reducer update product: " + JSON.stringify(result.data))
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

export const deleteProduct = createAsyncThunk(
    "deleteProduct",
    async ( id : string) => {
        try {
            const result = await axiosInstance.delete(
                `product/${id}`,                   
                {headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },}             
              );              
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
)


/* update, and delete */

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        cleanUpProductReducer: (state) => {
            return initialState
        },       

    }, // list of methods to modify the state,
    extraReducers: (build) => {
        build
            .addCase(fetchAllProducts.pending, (state, action) => {
                state.loading = true
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false
                state.error = "Cannot perform this action. Please try again later"
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.products = action.payload
                }
            })
            
            .addCase(createProduct.fulfilled, (state, action) => {
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.products.push(action.payload)
                }
                state.loading = false
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    const updatedProduct = action.payload as Product
                    const products = state.products.map(prod => {
                        if(prod.id === updatedProduct.id){
                            return {...prod, ...updatedProduct};
                        }
                        return prod;
                    });
                    state.products = products;
                }
                state.loading = false
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.rejected, (state) => {
                state.error = "Cannot update product";
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                if (JSON.stringify( action.payload) !== "true") {
                    state.error = 'error'
                }       
                else{
                    //state.products.splice()
                }         
                state.loading = false
            })
    }
})

//productReducer: current state
const productsReducer = productsSlice.reducer
export const { cleanUpProductReducer } = productsSlice.actions
export default productsReducer