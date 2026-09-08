import mongoose, { Schema, Document } from 'mongoose';
import { IExam } from './exam.interface';


const ExamSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    examType: {
        type: String,
        required: true,
    },
    academicYear: {
        type: String,
        required: true
    },
    principal: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    
    classesAssigned: [{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }],
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Results_Declared'],
        default: 'Upcoming'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IExam>('Exam', ExamSchema);