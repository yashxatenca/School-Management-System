import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slice/authSlice'
import teacherauthreducer from './Slice/teacher.auth.slice';
import studentauthreducer from './Slice/student.authslice'
export const store = configureStore({
  reducer:{
    authstate:authReducer,
    teacherauthstate:teacherauthreducer,
    studentauthstate:studentauthreducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDipatch = typeof store.dispatch;