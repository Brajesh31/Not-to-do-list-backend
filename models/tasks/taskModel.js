import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    hour: Number,
    type: String
})

const Task = mongoose.model('Task', taskSchema)

export default Task