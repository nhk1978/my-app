import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Product } from "../../types/Product";
import axios, { AxiosError } from "axios";
import { NewProduct } from "../../types/NewProduct";

interface ProductReducer {
    loading: boolean
    error: string
    products: Product[]
}

const initialState: ProductReducer = {
    loading: false,
    error: "",
    products: []
}

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
    baseURL: "https://api.escuelajs.co/api/v1/"
})

/** This function will read products from api and apply the data to the state*/
export const fetchAllProducts__old = createAsyncThunk(
    "fetchAllProducts__old",
    async ({
        offset, limit, categoryID,
        }: FetchQuery) => {
            // console.log("categoryID: " + categoryID)
        try {
            const result = await axiosInstance.get<Product[]>(
                `products?offset=${offset}&limit=${limit}` + (categoryID===0 ? "": `&categoryId=${categoryID}`))
            return result.data
        } catch (e) {
            const error = e as AxiosError
            return error.message
        }
    }
)

export const fetchFilterProducts__old = createAsyncThunk(
    "fetchFilterProducts__old",
    async ({
        offset, 
        limit, 
        categoryID,
        priceMin,
        priceMax,
        order
        }: FetchFilterQuery) => {
            // console.log("categoryID: " + categoryID)
        try {
            const result = await axiosInstance.get<Product[]>(
                `products?offset=${offset}&limit=${limit}` + 
                (categoryID===undefined || categoryID===0 ? "": `&categoryId=${categoryID}`) +
                (priceMin ===undefined || priceMin===-1 ? "": `&price_min=${priceMin + 1}`) + 
                (priceMax===undefined ||  priceMax===-1 ? "": `&price_max=${priceMax}`))
                const products: Product[] = result.data
                return products
            /* const sortedData: Product[] = [...products].sort((a, b) => {
                if(order === "asc"){                
                    return (a.price - b.price)                  
                }else{
                    return (b.price - a.price)
                }     
            })
            return sortedData */
        } catch (e) {
            const error = e as AxiosError
            return error.message
        }
    }
)

export const fetchAllProducts = createAsyncThunk(
    'fetchAllProducts',
    async ({id, min,max}: { id?:number, min?:number, max?:number} = {}) => {
      try {
        if (min !== undefined && max !== undefined && id === undefined) {
          const result = await axiosInstance.get<Product[]>(`products/?price_min=${min}&price_max=${max}`);
          return result.data
        }
        else if (min === undefined && max === undefined && id !== undefined) {
          const result = await axiosInstance.get<Product[]>(`products/?categoryId=${id}`);
          return result.data;
        }
        else if (min !== undefined && max !== undefined && id !== undefined) {
          const result = await axiosInstance.get<Product[]>(`products/?price_min=${min}&price_max=${max}&categoryId=${id}`);
          return result.data;
        }
        else {
          const result = await axiosInstance.get<Product[]>("products");
          return result.data; // The returned result will be inside action.payload
        }
      } catch (e) {
        const error = e as AxiosError;
        return error.message;
      }
    }
);

/* const sortedData = [...data].sort((a, b) => {
    if (sortColumn === 'category') {
      // Sort by category name
      return sortOrder === 'asc' ? a.category.name.localeCompare(b.category.name) : b.category.name.localeCompare(a.category.name);
    } else if (sortColumn === 'price') {
      // Sort by price
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else {
      return 0;
    }
  });
 */

export const createProduct = createAsyncThunk(
    "createProduct",
    async ({file, product}:{file: File | null, product: NewProduct}) => {
        try {
            const resultFile = await axiosInstance.post(
                "files/upload",
                { file: file },
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              product.images.push(resultFile.data?.location)
              const result = await axiosInstance.post<Product>(
                "products/", product)
            console.log("Reducer new product: " + JSON.stringify(result.data))
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
    async (product: Product) => {
        try {
            const result = await axiosInstance.delete(
                `products/${product.id}`,                
              );
              
            // console.log("result: " + JSON.stringify(result.data))
            if(JSON.stringify(result) === 'true') return result.data
            else return 'error' 
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return JSON.stringify(error.response.data)
            }
            return error.message
        }
    }
)

export const getCategory = createAsyncThunk(
    "getCategory",
    async () => {
        try {
            const result = await axiosInstance.get(
                `categories`,                
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

/* update, and delete */

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        cleanUpProductReducer: (state) => {
            return initialState
        },
        /* createNewProduct: (state, action: PayloadAction<NewProduct>) => {
            const result = createProduct(action.payload)
            if(typeof result === "string"){
                state.error = result
            }else{
                state.products.push(result)
                
            }

        }, */

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
            .addCase(fetchFilterProducts__old.fulfilled, (state, action) => {
                state.loading = false
                /* if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.products = action.payload
                } */
                if(Array.isArray(action.payload)){
                    state.products = action.payload
                }
                else state.error = action.payload
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.products.push(action.payload)
                }
                state.loading = false
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
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false
                /* if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.products = action.payload
                } */
            })
            
    }
})

//productReducer: current state
const productsReducer = productsSlice.reducer
export const { cleanUpProductReducer } = productsSlice.actions
export default productsReducer