"use client"
import { Provider
 } from "react-redux"
import AdminAuthBootstrap from '@/components/AdminAuthBootstrap'
import { store } from "./store"
export default function ReduxProvider({
    children
}: {children:React.ReactNode}){
    return <Provider store={store }>
       <AdminAuthBootstrap/>
{children}
    </Provider>
}