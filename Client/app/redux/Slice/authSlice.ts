import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminUser } from "../Types";

interface AuthState {
    user:AdminUser | null;
    isAuthenticated :boolean;
    authChecked : boolean;
}

const initialState : AuthState = {
    user:null,
    isAuthenticated:false,
    authChecked:false,
}
const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{

        // reducer start >>>>>>>>>>>>>>>>>>>>>>>>

        // function to set admin 
        setAdmin:(state, action:PayloadAction<AdminUser>)=>{
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true
        },

          // function to logout admin 
        logoutAdmin: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
        },
        //check autheticated or not

        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
       //reducer end 
    }

}
) 

export const { setAdmin, logoutAdmin, 
} = authSlice.actions;

export default authSlice.reducer