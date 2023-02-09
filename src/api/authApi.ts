import axios, {AxiosResponse} from 'axios'
import {ResponseType} from "./todolists-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '7d13a953-137d-462b-b5e2-b6c51dbfe64c'
    }
})

export const authApi = {
    login(data: LoginType) {
        return instance.post<LoginType, AxiosResponse<ResponseType<{ userId: number }>>>('auth/login', data)
    },
    me() {
        return instance.get<ResponseType<UserType>>('auth/me')
    },
    logOut() {
        return instance.delete<ResponseType>('auth/login')
    }
}

//types
export type LoginType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type UserType = {
    id: number
    email: string
    password: string
}

