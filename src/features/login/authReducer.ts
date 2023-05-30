import {authApi, LoginType} from "../../api/authApi";
import {setAppStatusAC, setIsInitializedAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk<{}, LoginType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<string> } }>('auth/login', async (param,  {dispatch,rejectWithValue}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await authApi.login(param)
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({value: true}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(setAppStatusAC({status: 'failed'}))
      return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
      return rejectWithValue({errors: [e.message], fieldsErrors: undefined})
    }
    dispatch(setAppStatusAC({status: 'failed'}))
  }
})
export const meTC = createAsyncThunk('auth/me', async (param,  {dispatch, rejectWithValue}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({value: true}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(setAppStatusAC({status: 'failed'}))
      return rejectWithValue(null)
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    dispatch(setAppStatusAC({status: 'failed'}))
    return rejectWithValue(null)
  } finally {
    dispatch(setIsInitializedAC({isInitialized: true}))
  }
})
export const logOutTC = createAsyncThunk('auth/logOut', async (param, {dispatch,rejectWithValue}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await authApi.logOut()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({value: false}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(setAppStatusAC({status: 'failed'}))
      return rejectWithValue(null)
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    dispatch(setAppStatusAC({status: 'failed'}))
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
  }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions



