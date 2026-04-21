export interface IMarkSubject {
    subjectId: string;
    maxMarks: number;
    passingMarks: number;
    obtainedMarks: number;
    grade?: string;
    remarks?: string;
}

export interface IMark {
    _id?: string;
    examId: string;
    studentId: string;
    teacherId: string;
    classId: string;
    subjects: IMarkSubject[];
    totalMaxMarks: number;
    totalObtainedMarks: number;
    percentage: number;
    overallGrade?: string;
    resultStatus: 'Pass' | 'Fail' | 'Promoted' | 'Withheld';
    remarks?: string;
    createdAt?: string;
    updatedAt?: string;
}