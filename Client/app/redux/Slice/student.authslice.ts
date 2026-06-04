import { StudentUser } from "../Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentAuthUser {
  user: StudentUser | null;
  isAuthenticated: boolean;
  authChecked: boolean;
}

// Inital values
const initialState: StudentAuthUser = {
  user: null,
  isAuthenticated: false,
  authChecked: false, // Shuru mein false rahega jab tak check nahi hota
};

const studentauthslice = createSlice({
  name: "student_auth", // Naming sahi kar di (pehle teacher_auth tha)
  initialState: initialState,

  reducers: {
    setStudent: (state, action: PayloadAction<StudentUser>) => {
      state.user = action.payload;
      state.authChecked = true; // Check complete!
      state.isAuthenticated = true;
    },

    logoutStudent: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // 🔥 MAIN FIX: Ise TRUE karna hai, kyunki fail hone par bhi check complete ho gaya hai
      state.authChecked = true;
    },

    // 🔥 PICHLA FIX: Agar user pehle se state me ho toh manually true set karne ke liye
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

// Naya action (setAuthChecked) bhi export karna zaruri hai
export const { setStudent, logoutStudent, setAuthChecked } =
  studentauthslice.actions;

export default studentauthslice.reducer;
