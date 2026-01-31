import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slice/authSlice'
import teacherauthreducer from './Slice/teacher.auth.slice'
export const store = configureStore({
  reducer:{
    authstate:authReducer,
    teacherauthstate:teacherauthreducer

  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDipatch = typeof store.dispatch;