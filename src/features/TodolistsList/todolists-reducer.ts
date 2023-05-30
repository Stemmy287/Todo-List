import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {handleServerNetworkError} from "../../utils/error-utils";

export const fetchTodolistsTC = createAsyncThunk('todoLists/fetchTodolists', async (param, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC({todolists: res.data}))
    dispatch(setAppStatusAC({status: 'succeeded'}))
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    return rejectWithValue(null)
  }
})
export const removeTodolistTC = createAsyncThunk('todoLists/removeTodolist', async (param: { todolistId: string }, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'loading'}))
  try {
    await todolistsAPI.deleteTodolist(param.todolistId)
    dispatch(removeTodolistAC({id: param.todolistId}))
    dispatch(setAppStatusAC({status: 'succeeded'}))
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    return rejectWithValue(null)
  }
})
export const addTodolistTC = createAsyncThunk('todoLists/addTodoList', async (param: { title: string }, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await todolistsAPI.createTodolist(param.title)
    if (res.data.resultCode === 0) {
      dispatch(addTodolistAC({todolist: res.data.data.item}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    return rejectWithValue(null)
  }
})
export const changeTodolistTitleTC = createAsyncThunk('todoLists/changeTodolistTitle', async (param: { id: string, title: string }, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await todolistsAPI.updateTodolist(param.id, param.title)
    if (res.data.resultCode === 0) {
      dispatch(changeTodolistTitleAC({title: param.title, id: param.id}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'todoLists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }
  },
  extraReducers: () => {

  }
})

export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  setTodolistsAC
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

