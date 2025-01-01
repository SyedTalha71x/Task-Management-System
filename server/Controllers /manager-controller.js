import { SuccessResponse, FailureResponse } from "../Helper/helper.js";
import Task from "../Models/task-schema.js";
import { Manager } from "../Models/manager-schema.js";
import User from "../Models/credientials-schema.js";

export const managerCreateTask = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, description, dueDate, status } = req.body;
        const managerId = req.user._id; 

        const manager = await Manager.findOne({ managerId: managerId });
        if (!manager) {
            return FailureResponse(res, "Manager not found", null, 404);
        }

        if (!manager.assignedUsers.includes(userId)) {
            return FailureResponse(res, "This user is not assigned to you", null, 403);
        }

        const newTask = new Task({
            title,
            description,
            dueDate: new Date(dueDate),
            status,
            creatorId: userId,
        });

        await newTask.save();

        return SuccessResponse(res, "Task created successfully", { task: newTask }, 201);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const managerUpdateTask = async (req, res) => {
    try {
        const {  taskId } = req.params; 
        const {userId, title, description, dueDate, status } = req.body;
        const managerId = req.user._id; 

        const manager = await Manager.findOne({ managerId: managerId });
        if (!manager) {
            return FailureResponse(res, "Manager not found", null, 404);
        }

        if (!manager.assignedUsers.includes(userId)) {
            return FailureResponse(res, "This user is not assigned to you", null, 403);
        }
        const task = await Task.findOne({ _id: taskId, creatorId: userId });
        if (!task) {
            return FailureResponse(res, "Task not found for this user", null, 404);
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (status) task.status = status;

        await task.save();

        return SuccessResponse(res, "Task updated successfully", { task }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const managerViewTasks = async (req, res) => {
    try {
        const { userId } = req.params; 
        const managerId = req.user._id; 

        const manager = await Manager.findOne({ managerId: managerId });
        if (!manager) {
            return FailureResponse(res, "Manager not found", null, 404);
        }

        if (!manager.assignedUsers.includes(userId)) {
            return FailureResponse(res, "This user is not assigned to you", null, 403);
        }

        const tasks = await Task.find({ creatorId: userId });
        if (tasks.length === 0) {
            return FailureResponse(res, "No tasks found for this user", null, 404);
        }

        return SuccessResponse(res, "Tasks retrieved successfully", { tasks }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const managerDeleteTask = async (req, res) => {
    try {
        const { taskId } = req.params; 
        const managerId = req.user._id; 
        const manager = await Manager.findOne({ managerId: managerId });
        if (!manager) {
            return FailureResponse(res, "Manager not found", null, 404);
        }

        const task = await Task.findOne({ _id: taskId });
        if (!task) {
            return FailureResponse(res, "Task not found for this user", null, 404);
        }

        // Use deleteOne instead of remove
        await Task.deleteOne({ _id: taskId });

        return SuccessResponse(res, "Task deleted successfully", null, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};

export const getManagerWithAssignedUsers = async (req, res) => {
    try {
        const  managerId  = req.user._id;

        const manager = await User.findById(managerId);
        if (!manager || manager.role !== 'manager') {
            return FailureResponse(res, "Manager not found or user is not a manager", null, 404);
        }

        const managerInManagerTable = await Manager.findOne({ managerId: managerId });
        if (!managerInManagerTable) {
            return FailureResponse(res, "Manager not found in Manager table", null, 404);
        }

        const assignedUsers = await User.find({ '_id': { $in: managerInManagerTable.assignedUsers } })
            .select('name email'); 

        return SuccessResponse(res, "Fetched manager with assigned users", { manager, assignedUsers }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};