
import { TeacherUser } from "../Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeacherAuthUser { // teacher interface
    user:TeacherUser | null;
     isAuthenticated :boolean;
    authChecked : boolean;


}
 // inital values 
const initialState :TeacherAuthUser = {
     user:null,
    isAuthenticated:false,
    authChecked:false,

}

const teacherauthslice  = createSlice({
    name:"teacher_auth",
    initialState:initialState,

    reducers:{
    setTeacher:(state, action:PayloadAction<TeacherUser>)=>{
        state.user = action.payload;
        state.authChecked = true;
        state.isAuthenticated = true;
    },


    logoutTeacher: (state)=>{
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = false;

    }

    }

})

export const { setTeacher, logoutTeacher } = teacherauthslice.actions;

export default teacherauthslice.reducer;

