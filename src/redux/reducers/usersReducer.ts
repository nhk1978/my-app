import { PayloadAction, createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, NewUser } from "../../types/User";
// import productsReducer from "./productsReducer";
import axios, { AxiosError, AxiosResponse } from "axios";
import { UserUpdate } from "../../types/UserUpdate";
// import { act } from "react-dom/test-utils";
import { UserCredential, UserToken } from "../../types/UserCredential";
// import { access } from "fs";


interface UserReducer {
    users: User[]
    currentUser?: User
    loading: boolean
    error: string
}

const initialState: UserReducer = {
    users: [],
    loading: false,
    error: ""
}

interface UserState {
    users: User[];
    pending: boolean;
    error: string | null;
}

const axiosInstance = axios.create({
    baseURL: "http://localhost/api/v1/"
})

interface FetchQuery {
    page: number
    per_page: number
}
export const fetchAllUsers = createAsyncThunk(
    "fetchAllUsers",
    async ({
        page, per_page
    }: FetchQuery) => {
        try {            
            const result = await axiosInstance.get<User[]>(
                `users?page=${page}&per_page=${per_page}`)
            return result.data // returned result would be inside action.payload
        }catch (e) {
            const error = e as AxiosError
            return error
        }
    }
)



export const getUser = createAsyncThunk(
    "getUser",
    async (nameId : string) => {
        try {
            const result = await axiosInstance.get<User>(
                "user/"+nameId, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            return result.data
        }
        catch (e) {
            const error = e as AxiosError
            return error
        }
    }
)

export const logout = createAction('logout');

export const createNewUser = createAsyncThunk(
    "createNewUser",
    async (user: NewUser) => {
        try {
            const createUserReponse = await axiosInstance.post("user",
            { ...user })
            return createUserReponse.data as User
        }
        catch (e) {
            const error = e as AxiosError
            return error
        }
    }
)

export const login = createAsyncThunk(
    "login",
    async ({ email, password }: UserCredential, { dispatch }) => {
        try {
            console.log("email: "+ email)
            const result = await axiosInstance.post(
                "auth",
                {
                    'email': email, 
                    'password': password
                })
            if (result instanceof AxiosError) {
                localStorage.removeItem("token");
                localStorage.removeItem ("loginUser");
                return result
            } else {
                // console.log("result: "+ JSON.stringify(result.data))
                                
                localStorage.setItem('token', result.data);

                // Split the token into its three parts
                const token = JSON.stringify(result.data);
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token');
                }

                // Decode the payload (second part of the token)
                const payload = JSON.parse(atob(parts[1]));

                // Extract user ID or other user-related information
                const nameId = payload.nameid; // Replace with the actual claim name

                // console.log('User ID:', nameId);

                const userInfo = await dispatch(getUser(nameId))
                // console.log("result 2: "+ JSON.stringify(authentication))
                localStorage.setItem("loginUser", JSON.stringify(userInfo.payload as User));
                // return authentication.payload as User
            }
        }
        catch (e) {
            const error = e as AxiosError
            return error.message
        }
    }
)



export const updateUser = createAsyncThunk(
    "updateUser",
    async (user: UserUpdate) => {
        try {
            // console.log("user: " + JSON.stringify(user));
            // const token = localStorage.getItem("token");
            const storedToken = localStorage.getItem('token');
            const token = storedToken ? storedToken.replace(/"/g, '') : null;
            const result = await axiosInstance.patch(`user/${user.id}`, 
                {
                    firstName: user.update.firstName,
                    lastName: user.update.lastName,
                    avatar: user.update.avatar
                },
                {
                    headers: {
                        Authorization: `Bearer  ${token}`,
                    },
                }
            );
            return result.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
)

export const deleteUser = createAsyncThunk(
    "deleteUser",
    async (id: string) => {
        /* first call https://api.escuelajs.co/api/v1/files/upload, send along the image */
        /* get back reponse object with location ---> image url */
        /* call https://api.escuelajs.co/api/v1/users/ --> rest of data, with url as avatar */
    }
)



const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        /* user needs to pass data to this method. 
        data would be a new user 
        ! data is always passed to action.payload*/
        /*  createUser: (state, action: PayloadAction<User>) => {
             state.users.push(action.payload) // redux toolkit has another integrated package called `immer`
            
         }, */

        /* createNewUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload) // redux toolkit has another integrated package called `immer`
           
        }, */

        updateUserReducer: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },

        emptyUsersReducer: (state) => {
            /* state = [] // redux does not recognize the changes */
            state.users = []
        },
        updateOneUser: (state, action: PayloadAction<UserUpdate>) => {
            console.log("updateOneUser")
            const { id, update } = action.payload;
            //updateUser({id: id, user: update.user})
            const index = state.users.findIndex((user) => user.id === id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...update };
            }
        },
       


        sortByEmail: (state, action: PayloadAction<"asc" | "desc">) => {
            if (action.payload === "asc") {
                state.users.sort((a, b) => a.email.localeCompare(b.email))
            } else {
                state.users.sort((a, b) => b.email.localeCompare(a.email))
            }
        },
        /*         filterOnName: (state, action) => {
                    const filterList = state.filterList.filter()
                    return {...state, filterList}
                } */
        /*         filterOnName: (state, action: PayloadAction<string>) => {
                   return state.filter(user => user.name.includes(action.payload))
                } --> never filter on original state */
        /* 2 senarios when state is updated
        1. use method to modify value of the current state
        2. use return statement to return new value */
    },
    extraReducers: (build) => {
        build
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    state.users = action.payload
                }
                state.loading = false
            })
            .addCase(fetchAllUsers.pending, (state, action) => {
                state.loading = true
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.error = "Cannot fetch data"
            })
            .addCase(login.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError || typeof action.payload === "string") {
                    state.error = action.payload.toString()
                } else {
                    state.currentUser = action.payload
                }
                state.loading = false
            })
            .addCase(getUser.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    state.currentUser = action.payload
                }
                state.loading = false
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                // console.log("extraReducers call updateUser")
                // console.log("Action payload:", action.payload)
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message;
                } else {
                    const updatedUser = action.payload;
                    const index = state.users.findIndex((user) => user.id === updatedUser.id);
                    if (index !== -1) {
                        state.users[index] = updatedUser;
                    }
                }
                state.loading = false;
            })

            .addCase(createNewUser.fulfilled, (state, action) => {
                if(action.payload instanceof AxiosError){
                    state.error = action.payload.message;
                } else{
                    state.users.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(createNewUser.pending, (state, action) => {                
                state.loading = true;                
            })
            .addCase(createNewUser.rejected, (state, action) => {                
                state.error = "Can not create new user";                
            })
            .addCase(logout, (state) => {
                state.currentUser = undefined;
                localStorage.removeItem('token');
              })

    }
})

export type RootState = ReturnType<typeof usersReducer>;
const usersReducer = usersSlice.reducer
export const
    {

        updateUserReducer,
        emptyUsersReducer,
        updateOneUser,
        sortByEmail
    } = usersSlice.actions
export default usersReducer // once per file