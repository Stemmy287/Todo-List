import {addTaskTC, fetchTasksTC, removeTaskTC, tasksReducer, TasksStateType, updateTaskTC} from "./tasks-reducer";
import {TaskType} from "../../api/todolists-api";


let tasks: TasksStateType

beforeEach(() => {
  tasks = {
    '1': [
      {
        id: "1",
        title: "Some",
        description: "",
        todoListId: "1",
        order: -4,
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
        addedDate: '2023-01-23T16:13:33.027'

      },
      {
        id: "2",
        title: "Something",
        description: "",
        todoListId: "1",
        order: -4,
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
        addedDate: '2023-01-23T16:13:33.027'
      },
    ]
  }
})

test('set tasks', () => {
  let tasks1: Array<TaskType> =

    [
      {
        id: "3",
        title: "Milk",
        description: "",
        todoListId: "1",
        order: -4,
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
        addedDate: '2023-01-23T16:13:33.027'
      },
      {
        id: "4",
        title: "Water",
        description: "",
        todoListId: "1",
        order: -4,
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
        addedDate: '2023-01-23T16:13:33.027'
      },
    ]

  const action = fetchTasksTC.fulfilled({tasks: tasks1, todolistId: '1'}, '', '1')
  const copyState = tasksReducer(tasks, action)
  console.log(copyState)
  expect(copyState['1'][0].title).toBe('Milk')
})

test('add task', () => {
  const task: TaskType = {
    id: "3",
    title: "Milk",
    description: "",
    todoListId: "1",
    order: -4,
    status: 0,
    priority: 1,
    startDate: '',
    deadline: '',
    addedDate: "2023-01-23T16:13:33.027"
  }
  const action = addTaskTC.fulfilled({task}, '', {title: task.title, todolistId: task.todoListId})
  const copyState = tasksReducer(tasks, action)
  console.log(copyState)
  expect(copyState['1'].length).toBe(3)
  expect(copyState['1'][0].title).toBe('Milk')
})

test('remove task', () => {
  const action = removeTaskTC.fulfilled({taskId: '1', todolistId: '1'}, '', {taskId: '1', todolistId: '1'})
  const copyState = tasksReducer(tasks, action)
  console.log(copyState)
  expect(copyState['1'].length).toBe(1)
})

test('update task', () => {
  const model = {
    status: 1,
    title: '123'
  }
  const action = updateTaskTC.fulfilled({taskId: '1', todolistId: '1', model}, '', {taskId: '1', domainModel: model, todolistId: '1' })
  const copyState = tasksReducer(tasks, action)
  console.log(copyState)
  expect(copyState['1'][0].status).toBe(1)
  expect(copyState['1'][0].title).toBe('123')
})