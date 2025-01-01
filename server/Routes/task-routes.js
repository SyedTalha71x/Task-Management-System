import { createTask, updateTask, deleteTask, getAllTasks, filterTasks } from "../Controllers /task-controller.js";
import express from 'express'
import { auth } from "../Middleware/auth.js";

const router = express.Router();

router.post('/create-task', auth, createTask)
router.put('/update-task/:taskId', auth, updateTask)
router.delete('/delete-task/:taskId', auth, deleteTask)
router.get('/get-all-tasks', auth, getAllTasks)
router.get('/filter-tasks', auth, filterTasks)

export default router