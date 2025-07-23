import express from "express"
import cors from "cors"
import fs from "fs"
import mongodbConnection from "./config/mongodbConfig.js";
import Task from "./models/tasks/taskModel.js";

const app = express()
const PORT = 3001;

// allow cors
app.use(cors())

// populate request body
app.use(express.json())

mongodbConnection()

// Get all tasks
app.get('/api/v1/tasks', async (req, res) => {
    //read taskList.json
    // let queryType = req.query.type;
    // let filteredTask = [];
    // if (queryType) {
    //     filteredTask = tasks.filter((t) => t.type == queryType);
    // } else {
    //     filteredTask = tasks;
    // }

    let tasks = await Task.find()

    let queryType = req.query.type

    let filteredTask = []
    if (queryType) {
        filteredTask = tasks.filter((t) => t.type == queryType)
    } else {
        filteredTask = tasks
    }

    return res.json({
        status: true,
        message: "Tasks Found",
        tasks: filteredTask
    })
})

// Get specific tasks
app.get("/api/v1/tasks/:taskid", async (req, res) => {
    // read taskList.json
    // let data = fs.readFileSync("./taskList.json")
    // let tasks = JSON.parse(data)

    let id = req.params.taskid;

    let task = tasks.find((t) => t.id == id)

    // let task = tasks.find((t) => t.id == id)

    if (task) {
        return res.json({
            status: true,
            message: "Task Found",
            task: task
        })
    } else {
        return res.status(404).json({
            status: false,
            message: "Task Not Found"
        })
    }
})

// Create task
app.post('/api/v1/tasks', async (req, res) => {
    // let data = fs.readFileSync("./taskList.json")
    // let tasks = JSON.parse(data)

    let task = new Task(req.body)
    await task.save()
    // tasks.push(task);

    // write to file
    // fs.writeFileSync("./taskList.json", JSON.stringify(tasks))

    res.status(201).json({
        status: true,
        message: "Task Added",
        task,
    })
})

// Update task
app.patch("/api/v1/tasks/:taskid", async (req, res) => {
    try {
        // let data = fs.readFileSync("./taskList.json")
        // let tasks = JSON.parse(data)

        let id = req.params.taskid
        let updatedList = req.body
        let task = await Task.findByIdAndUpdate(id, updatedList, { new: true })

        // let task = tasks.find((t) => t.id == id)
        // task.type = updatedList.type

        // fs.writeFileSync("./taskList.json", JSON.stringify(tasks))

        return res.json({
            status: true,
            message: "Task List Updated",
            task,
        })
    } catch (err) {
        console.log(err)

        return res.status(500).json({
            status: false,
            message: "Task could not be updated",
            err: err.message
        })
    }
})

// Delete task
app.delete("/api/v1/tasks/:taskid", async (req, res) => {
    // let data = fs.readFileSync("./taskList.json")
    // let tasks = JSON.parse(data)

    let id = req.params.taskid
    let deletedTask = await Task.findByIdAndDelete(id)

    //   filter task with id
    // tasks = tasks.filter((t) => t.id != id)

    // update file
    // fs.writeFileSync("./taskList.json", JSON.stringify(tasks))

    return res.json({
        status: true,
        message: "Task Deleted",
        deletedTask
    })
})

// Delete multiple tasks
app.delete("/api/v1/tasks", async (req, res) => {
    let idsToDelete = req.body?.ids || []

    await Task.deleteMany({ _id: { $in: idsToDelete } })

    return res.json({
        status: true,
        message: "Tasks Deleted!"
    })
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server could not be started", err)
    } else {
        console.log("Server started at PORT: ", PORT)
    }
});