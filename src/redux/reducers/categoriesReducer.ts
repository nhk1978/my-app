import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AddCategory, Category, UpdateCategory, UpdateIdCategory } from "../../types/Category";



const initialState:  {
    categories: Category[];
    selectedCategory: any;
    filteredCategories: Category[];
    loading: boolean;
    error: string;
} = {
    categories: [],
    selectedCategory: {},
    filteredCategories: [],
    loading: false,
    error: "",
};



const axiosInstance = axios.create({
    baseURL: "http://172.178.59.63:8080/api/v1/"
})



export const getCategory = createAsyncThunk(
    "getCategory",
    async () => {
        try {
            const result = await axiosInstance.get(
                `category`               
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

export const createCategory = createAsyncThunk(
    "createCategory",
    async ( category: AddCategory) => {
        try {
            const result = await axiosInstance.post(
                `category`, category,
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

export const updateCategory = createAsyncThunk(
    "updateCategory",
    async ({id,category}: UpdateIdCategory) => {
        try {
            const result = await axiosInstance.patch(
                `category/${id}`, category,
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

export const deleteCategory = createAsyncThunk(
    "deleteCategory",
    async ( id: string, { dispatch}) => {
        try {
            const result = await axiosInstance.delete(
                `category/${id}`,
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

const categoriesSlice = createSlice({
    name: "Categories",
    initialState,
    reducers: {
        cleanUpCategoryReducer: (state) => {
            return initialState
        },

    }, // list of methods to modify the state,
    extraReducers: (build) => {
        build
            .addCase(getCategory.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false
                state.error = "Cannot perform this action. Please try again later"
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.categories = action.payload
                }
            })
            
            .addCase(createCategory.fulfilled, (state, action) => {
                if (typeof action.payload === "string") {
                    state.error = action.payload
                } else {
                    state.categories.push(action.payload)
                }
                state.loading = false
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    const updatedCategory = action.payload as Category
                    const Categories = state.categories.map(cat => {
                        if(cat.id === updatedCategory.id){
                            return {...cat, ...updatedCategory};
                        }
                        return cat;
                    });
                    state.categories = Categories;
                }
                state.loading = false
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategory.rejected, (state) => {
                state.error = "Cannot update Category";
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                if (JSON.stringify( action.payload) !== "true") {
                    state.error = 'error'
                }       
                else{
                    //state.Categorys.splice()
                }         
                state.loading = false
            })
    }
})

//CategoryReducer: current state
const CategoriesReducer = categoriesSlice.reducer
export const { cleanUpCategoryReducer } = categoriesSlice.actions
export default CategoriesReducer