import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";
// TypeScript
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
}
// Mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        require: true,
        trim: true,
    },
    clientName: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
},{timestamps: true})

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project