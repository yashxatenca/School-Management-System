import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudentClassState {
  classId: string | null; // _id for class
  className: string | null; // name
  sectionName: string | null; // section
  academicSession: string;
}

const initialState: StudentClassState = {
  classId: null,
  className: null,
  sectionName: null,
  academicSession: "",
};

const StudentClassSlice = createSlice({
  name: "StudentClass",
  initialState,
  reducers: {
    setStudentClassDetail(state, action: PayloadAction<any>) {
      const data = action.payload;
      state.academicSession = data.academicYear;
      state.sectionName = data.section;
      state.classId = data._id;
      state.className = data.name;
    },

    clearStudentClassDetail: () => initialState,
  },
});
export const { setStudentClassDetail, clearStudentClassDetail } =
  StudentClassSlice.actions;
export default StudentClassSlice.reducer;
