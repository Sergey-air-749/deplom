import { createSlice } from "@reduxjs/toolkit";
import { AxiosHeaders } from "axios";

interface AuthState {
    isAuth: boolean,
    token: String | null,
    userData: {
        avatar: {
            "400": String,
            "1000": String
        },
        username: String | AxiosHeaders,
        email: String,
        shareId: String,
    } | null,
}

const authReducer = createSlice({

    name: 'counter',

    initialState: {
        isAuth: false,
        token: null,
        userData: null
    } as AuthState,

    reducers: {
        setAuth: (state) => {
            state.isAuth = true
        },
        getToken: (state) => {
            const newToken = localStorage.getItem('token');
            state.token = newToken
        },
        setUserData: (state, action) => {
            console.log(action.payload);
            state.userData = action.payload
        }
    }
})

export const {setAuth, getToken, setUserData} = authReducer.actions
export default authReducer.reducer;