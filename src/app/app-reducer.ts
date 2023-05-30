import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'app',
    initialState: {
        isInitialized: false,
        status: 'idle',
        error: null
    },
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error:  string | null}>) {
            state.error = action.payload.error as null
        },
        setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized  = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
