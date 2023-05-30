import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
  const res = await todolistsAPI.getTasks(todolistId)
  const tasks = res.data.items
  thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
  return {tasks, todolistId}
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }) => {
  await todolistsAPI.deleteTask(param.todolistId, param.taskId)
  return {taskId: param.taskId, todolistId: param.todolistId}
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, {dispatch,rejectWithValue}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {task: res.data.data.item}
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null)
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response?.data ? e.response.data.message : e.message
      handleServerNetworkError(error, dispatch)
    }
    return rejectWithValue(null)
  }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, {
  dispatch,
  getState,
  rejectWithValue
}) => {
  const state = getState() as AppRootStateType
  const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
  if (!task) {
    return rejectWithValue('task not found in the state')
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...param.domainModel
  }
  try {
    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
    if (res.data.resultCode === 0) {
      return {taskId: param.taskId, todolistId: param.todolistId, model: param.domainModel}
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null)
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
  name: 'tasks',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      if (action.payload?.task) {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      }
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload?.taskId)
          if (index > -1) {
            state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
          }
        }
      }
    )
  }
})

export const tasksReducer = slice.reducer

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
