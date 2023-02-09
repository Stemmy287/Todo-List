import {
    addTodolistAC, changeTodolistEntityStatusAC, changeTodolistFilterAC, changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";


let TodoLists: Array<TodolistDomainType>

beforeEach(() => {
    TodoLists = [
        {addedDate: '2023-01-23T15:56:23.153', title: 'what to read', id: '1', order: 1, filter: 'all', entityStatus: 'idle'},
        {addedDate: '2023-01-23T15:56:23.153', title: 'what to eat', id: '2', order: 0, filter: 'all', entityStatus: 'idle'}
    ]
})

test('set todoLists', () => {
    const todos = [
        {addedDate: '2023-01-23T15:56:23.153', title: 'what to learn', id: '3', order: 3, filter: 'all', entityStatus: 'idle'},
        {addedDate: '2023-01-23T15:56:23.153', title: 'what to buy', id: '4', order: 2, filter: 'all', entityStatus: 'idle'}
    ]
    const action = setTodolistsAC({todolists: todos})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo[0].title).toBe('what to learn')
    expect(copyTodo.length).toBe(2)
})

test('add todo', () => {
    const todo = {addedDate: '2023-01-23T15:56:23.153', title: 'what to learn', id: '3', order: 3, filter: 'all', entityStatus: 'idle'}

    const action = addTodolistAC({todolist: todo})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo[0].title).toBe('what to learn')
    expect(copyTodo.length).toBe(3)
})

test('remove todo', () => {
    const action = removeTodolistAC({id: '2'})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo.length).toBe(1)
})

test('update todo title', () => {
    const action = changeTodolistTitleAC({title: 'what to learn', id: '2'})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo[1].title).toBe('what to learn')
})

test('update todo filter', () => {
    const action = changeTodolistFilterAC({id: '2', filter: 'active'})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo[1].filter).toBe('active')
})

test('update todo entity status', () => {
    const action = changeTodolistEntityStatusAC({id: '2', status: 'loading'})
    let copyTodo = todolistsReducer(TodoLists, action)
    console.log(copyTodo)
    expect(copyTodo[1].entityStatus).toBe('loading')
})