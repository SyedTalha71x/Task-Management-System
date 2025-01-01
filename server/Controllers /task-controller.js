import Task from "../Models/task-schema.js";
import { SuccessResponse, FailureResponse } from "../Helper/helper.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = req.user.userId;
    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }
    if (!title || !description || !dueDate || !status) {
      return FailureResponse(res, "All Fields are required", null, 400);
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      creatorId: userId,
    });

    return SuccessResponse(res, "Task has been created", { task }, 200);
  } catch (error) {
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};
export const updateTask = async (req,res) =>{
    try{
        const {taskId} = req.params;
        const { title, description, dueDate, status } = req.body;
        const userId = req.user.userId;
        if (!userId) {
          return FailureResponse(res, "Sorry you are not authorized", null, 400);
        }

        let newPayload = {}
        if(title) {newPayload.title = title}
        if(description) {newPayload.description = description}
        if(dueDate) {newPayload.dueDate = dueDate}
        if(status) {newPayload.status = status}

        const checkTask = await Task.findById(taskId)
        if(!checkTask){
            return FailureResponse(res, 'Task not found', null, 404)
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: newPayload }, { new: true });
        return SuccessResponse(res, 'Task has been updated', {updatedTask}, 200)
    
    }
    catch(error){
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
        
    }
}
export const deleteTask = async (req,res) =>{
    try{
        const {taskId} = req.params;
        const userId = req.user.userId;
        if (!userId) {
          return FailureResponse(res, "Sorry you are not authorized", null, 400);
        }
        const checkTask = await Task.findById(taskId)
        if(!checkTask){
            return FailureResponse(res, 'Task not found', null, 404)
        }
        const deleteTask = await Task.findByIdAndDelete(taskId);
        return SuccessResponse(res, 'Task has been deleted', {deleteTask}, 200)
    }
    catch(error){
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
}
export const getAllTasks = async (req,res) =>{
    try{
        const userId = req.user.userId;
        if (!userId) {
          return FailureResponse(res, "Sorry you are not authorized", null, 400);
        }
        const findTasks = await Task.find({ creatorId: userId });
        if (findTasks.length === 0) {
          return FailureResponse(res, "No tasks found for the logged-in user", null, 404);
        }

        return SuccessResponse(res, "Fetched all tasks for the logged-in user", { findTasks }, 200);
    }
    catch(error){
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
}
export const filterTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, dueDate, sortField, sortOrder } = req.query;

    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }

    const filterCriteria = { creatorId: userId };

    if (status) {
      filterCriteria.status = status;
    }
    if (dueDate) {
      const dueDateFormatted = new Date(dueDate);
      filterCriteria.dueDate = { $lte: dueDateFormatted };
    }

    let sortCriteria = {};
    if (sortField && sortOrder) {
      sortCriteria[sortField] = sortOrder === 'ascend' ? 1 : -1; // ascending or descending
    }

    const filteredTasks = await Task.find(filterCriteria).sort(sortCriteria);
    if (filteredTasks.length === 0) {
      return FailureResponse(res, "No tasks found matching the criteria", null, 404);
    }

    return SuccessResponse(res, "Fetched filtered tasks successfully", { filteredTasks }, 200);
  } catch (error) {
    console.log(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};


