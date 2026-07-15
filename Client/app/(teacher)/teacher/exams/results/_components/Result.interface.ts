// types/result.types.ts

export interface SubjectMark {
  name: string;
  max: number;
  passing: number;
  obtained: number;
  grade: string;
  remarks: string;
}

export interface ResultData {
  schoolName: string;
  schoolAddress: string;
  examName: string;
  student: {
    name: string;
    studentId: string;
    class: string;
  };
  subjects: SubjectMark[];
  summary: {
    totalMax: number;
    totalObtained: number;
    percentage: string;
    overallGrade: string;
    resultStatus: string;
  };
}
