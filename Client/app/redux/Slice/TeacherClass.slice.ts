import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeacherClassState {
  classId: string | null; // _id ke liye
  className: string | null; // name ke liye
  sectionName: string | null; // section ke liye
  totalStudent: number; // studentCount ke liye
  academicSession: string; // academicYear ke liye
}

const initialState: TeacherClassState = {
  classId: null,
  className: null,
  sectionName: null,
  totalStudent: 0,
  academicSession: "",
};

const TeacherClassSlice = createSlice({
  name: "teacherClass",
  initialState,
  reducers: {
    setClassDetail(state, action: PayloadAction<any>) {
      const data = action.payload;

      state.classId = data.classes._id; // Added _id
      state.className = data.classes.name; // "12"
      state.sectionName = data.classes.section; // "A"
      if (data.classes.academicYear && data.classes.academicYear.length === 8) {
        const year1 = data.classes.academicYear.substring(0, 4);
        const year2 = data.classes.academicYear.substring(4, 8);
        state.academicSession = `${year1} - ${year2}`; // Output: "2025 - 2026"
      } else {
        state.academicSession = data.classes.academicYear;
      }
      state.totalStudent = data.studentCount;
    },
    clearClassDetail: () => initialState,
  },
});

export const { setClassDetail, clearClassDetail } = TeacherClassSlice.actions;
export default TeacherClassSlice.reducer;
