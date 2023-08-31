import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, NewUser } from "../../types/User";
// import productsReducer from "./productsReducer";
import axios, { AxiosError } from "axios";
import { UserUpdate } from "../../types/UserUpdate";
// import { act } from "react-dom/test-utils";
import { UserCredential } from "../../types/UserCredential";
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
    baseURL: "https://api.escuelajs.co/api/v1/"
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
        } catch (e) {
            const error = e as AxiosError
            return error
        }
    }
)

export const authenticate = createAsyncThunk(
    "authenticate",
    async (access_token: string) => {
        try {
            const authentication = await axiosInstance.get<User>(
                "auth/profile", {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            return authentication.data
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
            const result = await axiosInstance.post<{ access_token: string }>(
                "auth/login",
                {
                    email, password
                })
            if (result instanceof AxiosError) {
                return result
            } else {
                // console.log("result: "+ result)
                localStorage.setItem("token", result.data.access_token)
                const authentication = await dispatch(authenticate(result.data.access_token))
                localStorage.setItem("loginUser", JSON.stringify(authentication.payload as User))
                return authentication.payload as User
            }
        }
        catch (e) {
            const error = e as AxiosError
            return error.message
        }
    }
)


export const getUser = createAsyncThunk("getUser", async (id: number) => {
    const result = await axiosInstance.get(`users/${id}`);
    return result.data as User;
});


export const createUser = createAsyncThunk(
    "createNewUser",
    async ({ file, user }: { file: File | null, user: NewUser }) => {
        // async ({file, user} : {file: File, user: NewUser}) => {
        try {
            // const resultFile = await axios.post("https://api.escuelajs.co/api/v1/files/upload", { file: user.file })
            if (file) {
                const resultFile = await axiosInstance.post(
                    "files/upload",
                    { file: file },
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (resultFile) {
                    user.avatar = resultFile.data?.location
                    // console.log("user reducer: " + JSON.stringify(user))                                  
                }
                else {
                    console.error("Error creating user");
                    return null
                }
            }
            else {
                user.avatar = ''
            }
            const resultUser = await axiosInstance.post(
                "users",
                { ...user })
            return resultUser.data as User
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }

        /* first call https://api.escuelajs.co/api/v1/files/upload, send along the image */
        /* get back reponse object with location ---> image url */
        /* call https://api.escuelajs.co/api/v1/users/ --> rest of data, with url as avatar */
    }
)

export const updateUser = createAsyncThunk(
    "updateUser",
    async (user: UserUpdate) => {
        try {
            console.log("user: " + JSON.stringify(user))
            const result = await axios.put(`https://api.escuelajs.co/api/v1/users/${user.id}`, {
                email: user.update.email,
                name: user.update.name
            });
            return result.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
)

export const deleteUser = createAsyncThunk(
    "deleteUser",
    async (id: number) => {
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
            .addCase(authenticate.fulfilled, (state, action) => {
                if (action.payload instanceof AxiosError) {
                    state.error = action.payload.message
                } else {
                    state.currentUser = action.payload
                }
                state.loading = false
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                console.log("extraReducers call updateUser")
                console.log("Action payload:", action.payload)
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

            .addCase(createUser.fulfilled, (state, action) => {
                // state.pending = false; // Set the pending state back to false
                if (action.payload) state.users.push(action.payload); // Update the state with the resolved data
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