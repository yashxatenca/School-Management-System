import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slice/authSlice'
import teacherauthreducer from './Slice/teacher.auth.slice';
import studentauthreducer from './Slice/student.authslice'
import TeacherClassSlice from './Slice/TeacherClass.slice'
export const store = configureStore({
  reducer: {
    authstate: authReducer,
    teacherauthstate: teacherauthreducer,
    studentauthstate: studentauthreducer,
    teacherclassstate: TeacherClassSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDipatch = typeof store.dispatch;