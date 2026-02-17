
import { StudentUser } from "../Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentAuthUser { // teacher interface
    user:StudentUser | null;
    isAuthenticated :boolean;
    authChecked : boolean;


}
 // inital values 
const initialState :StudentAuthUser = {
    user:null,
    isAuthenticated:false,
    authChecked:false,

}

const teacherauthslice  = createSlice({
    name:"teacher_auth",
    initialState:initialState,

    reducers:{
    setStudent:(state, action:PayloadAction<StudentUser>)=>{
        state.user = action.payload;
        state.authChecked = true;
        state.isAuthenticated = true;
    },


    logoutStudent: (state)=>{
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = false;

    }

    }

})

export const { setStudent, logoutStudent } = teacherauthslice.actions;

export default teacherauthslice.reducer;

