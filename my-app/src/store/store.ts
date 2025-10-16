import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../festures/authSlice'

export const store = () => {
    return configureStore({
        reducer: {
            authReducer: authReducer
        }
    })
}

// export type AppStore = typeof store; 
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']