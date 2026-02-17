import { StudentAuthRepository } from "../../repository/Student.auth.repo";
import {AppError} from "../../core/errors/AppError";
import StudentModel from '../../models/info.student.model'
export class StudentAuthService{

    private repo : StudentAuthRepository;

    constructor(){
        this.repo = new StudentAuthRepository();
    }

    async Login(studentId:string, password:string){
        if(!studentId || !password ) throw new AppError("StudentId and Password not Wrong", 402);
        const student = await this.repo.findbystudentid(studentId);
        console.log(student)
        if(!student) throw new AppError("Student not found", 404);
        const isMatch = await this.repo.comparePassword(studentId, password);
        if(!isMatch) throw new AppError("Invalid Password", 401);
        return student;
    };
}