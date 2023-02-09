import {authApi, LoginType} from "../../api/authApi";
import {Dispatch} from 'redux'
import {setAppStatusAC, setIsInitializedAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authApi.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatusAC({status: 'failed'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const error = e.response?.data ? e.response.data.message : e.message
            handleServerNetworkError(error, dispatch)
        }
        dispatch(setAppStatusAC({status: 'failed'}))
    }
}
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            debugger
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatusAC({status: 'failed'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const error = e.response?.data ? e.response.data.message : e.message
            handleServerNetworkError(error, dispatch)
        }
        dispatch(setAppStatusAC({status: 'failed'}))
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}))
    }
}
export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authApi.logOut()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatusAC({status: 'failed'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const error = e.response?.data ? e.response.data.message : e.message
            handleServerNetworkError(error, dispatch)
        }
        dispatch(setAppStatusAC({status: 'failed'}))
    }
}

